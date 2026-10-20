class Json extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.path = '';
      this.myIndexFile = '';
  }

  static get jsonCache() {
      if (!this._jsonCache) {
          this._jsonCache = new Map();
      }
      return this._jsonCache;
  }

  async getJSON(filePath) {
      const cacheKey = filePath;
      const cachedData = Json.jsonCache.get(cacheKey);
      if (cachedData) {
          return cachedData;
      }

      const storageKey = `json-cache:v4:${cacheKey}`;
      try {
          const storedData = sessionStorage.getItem(storageKey);
          if (storedData) {
              const parsedData = JSON.parse(storedData);
              Json.jsonCache.set(cacheKey, parsedData);
              return parsedData;
          }
      } catch (error) {
          console.error('Error restoring cached JSON —', error);
      }

      const response = await fetch(filePath);
      if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      Json.jsonCache.set(cacheKey, data);

      try {
          sessionStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
          console.error('Error caching JSON data —', error);
      }

      return data;
  }

  connectedCallback() {
      const path = this.getAttribute('path');
      const myIndexFile = this.getAttribute('myIndexFile');

      if (path && myIndexFile) {
          this.path = path;
          this.myIndexFile = myIndexFile;
          this.contentReady = this.loadJSONFiles(`${this.path}/${this.myIndexFile}.json`)
              .catch(error => console.error('Error loading JSON files —', error))
              .then(() => this.dispatchContentReady());
      } else {
          console.error('Missing required attributes: path or myIndexFile.');
          this.contentReady = Promise.resolve();
      }
  }

  dispatchContentReady() {
      this.dispatchEvent(new CustomEvent('content-ready', { bubbles: true, composed: true }));
  }

  async loadJSONFiles(indexFile) {
      try {
          const data = await this.getJSON(indexFile);

          if (data && Array.isArray(data.files)) {
              for (const file of data.files) {
                  await this.loadJSON(`${this.path}/${file}.json`);
              }
          }
      } catch (error) {
          console.error('Error loading JSON files list —', error);
      }
  }

  async loadJSON(file) {
      try {
          const data = await this.getJSON(file);
          this.processData(data);
      } catch (error) {
          console.error('Error loading JSON —', error);
      }
  }

  processData(jsonData) {
      let htmlContent = `
      <link rel="stylesheet" href="index.css">
      <div class="blog">
      `;

      if (jsonData.images && Array.isArray(jsonData.images)) {
          jsonData.images.forEach(imageFilename => {
              const imageSource = `${jsonData.folderPath}/${imageFilename}`;
              htmlContent += `<img src="${imageSource}" loading="lazy" decoding="async" alt="${jsonData.name || 'Blog image'}">`;
          });
      }

      htmlContent += `          
          <h2>${jsonData.name}</h2> 
          <p>${jsonData.text}</p> 
      `;

      htmlContent += `</div>`;
      this.shadowRoot.innerHTML += htmlContent;
  }
}

customElements.define('json-component', Json);

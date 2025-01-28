class Json extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
      const path = this.getAttribute('path');
      const myIndexFile = this.getAttribute('myIndexFile');

      if (path && myIndexFile) {
          this.path = path;
          this.myIndexFile = myIndexFile;
          this.loadJSONFiles(`${this.path}/${this.myIndexFile}.json`)
              .catch(error => console.error('Error loading JSON files:', error));
      } else {
          console.error('Missing required attributes: path or myIndexFile.');
      }
  }

  async loadJSONFiles(indexFile) {
      try {
          const response = await fetch(indexFile);
          const data = await response.json();

          if (data && Array.isArray(data.files)) {
              for (const file of data.files) {
                  await this.loadJSON(`${this.path}/${file}.json`);
              }
          }
      } catch (error) {
          console.error('Error loading JSON files list:', error);
      }
  }

  async loadJSON(file) {
      try {
          const response = await fetch(file);
          const data = await response.json();
          this.processData(data);
      } catch (error) {
          console.error('Error loading JSON:', error);
      }
  }

  processData(jsonData) {
      let htmlContent = `
      <link rel="stylesheet" href="index.css">
      <div class="blog">
      `;

      if (jsonData.images && Array.isArray(jsonData.images)) {
          jsonData.images.forEach(imageFilename => {
              htmlContent += `<img src="${jsonData.folderPath}/${imageFilename}">`;
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

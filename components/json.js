class Json extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.path = '';
    }
  

    connectedCallback() {
      const jsonFolderPath = this.getAttribute('path');
      if (jsonFolderPath) {
          this.loadJSONFiles(`${this.path}/index.json`).catch(error => console.error('Error loading JSON files:', error));
      } else {
          console.error('Missing data-json-folder attribute.');
      }
    }
  
  
    render() {
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
  
    static get observedAttributes() {
      return ['path'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
          this[name] = newValue;
          this.render();
      }
    }
  }
  
  customElements.define('json-component', Json);
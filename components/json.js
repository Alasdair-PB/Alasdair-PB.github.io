class Json extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.path = '';
    }
  
    connectedCallback() {
      const jsonFolderPath = this.getAttribute('path');
  
      if (jsonFolderPath) {
          this.loadJSONFiles(`${this.path}/index.json`);
      } else {
          console.error('Missing data-json-folder attribute.');
      }
    }
  
    render() {
    }
  
    loadJSONFiles(indexFile) {
      fetch(indexFile)
        .then(response => response.json())
        .then(data => {
          if (data && Array.isArray(data.files)) {
            data.files.forEach(file => {
                this.loadJSON(`${this.path}/${file}.json`);
            });
          }
        })
        .catch(error => console.error('Error loading JSON files list:', error));
    }
    
      loadJSON(file) {
        fetch(file)
          .then(response => response.json())
          .then(data => this.processData(data))
          .catch(error => console.error('Error loading JSON:', error));
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
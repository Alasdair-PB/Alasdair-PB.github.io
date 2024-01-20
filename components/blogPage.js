class Blog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.title = '';
        this.jsonFolderPath = '';
    }

    connectedCallback() {
        this.render();
        /*const jsonFolderPath = this.getAttribute('data-json-folder');

        if (jsonFolderPath) {
            this.loadJSONFiles(`${jsonFolderPath}/index.json`);
        } else {
            console.error('Missing data-json-folder attribute.');
        }*/

    }

    render() {
        this.shadowRoot.innerHTML = `
            <p> ${this.title} </p>
        `;
    }

    /*loadJSONFiles(indexFile) {
      fetch(indexFile)
        .then(response => response.json())
        .then(data => {
          if (data && Array.isArray(data.files)) {
            data.files.forEach(file => {
                this.loadJSON(`${jsonFolderPath}/${file}`);
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
      console.log(jsonData);
  
      const textElement = document.createElement('p');
      textElement.textContent = jsonData.text;
      this.shadowRoot.appendChild(textElement);
  
      if (jsonData.images && Array.isArray(jsonData.images)) {
        jsonData.images.forEach(imageFilename => {
          const imageElement = document.createElement('img');
          imageElement.src = `${jsonData.folderPath || 'Images'}/${imageFilename}`;
          this.shadowRoot.appendChild(imageElement);
        });
      }
    }*/


    static get observedAttributes() {

        return ['title', 'json-folder-path'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue;
            this.render();
        }
    }
    

}

customElements.define('blog-page', Blog);
  
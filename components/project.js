class Project extends Json {
  
    loadJSONFiles(indexFile) {
        this.shadowRoot.innerHTML += `
            <link rel="stylesheet" href="index.css">  
        `;

        fetch(indexFile)
        .then(response => response.json())
        .then(data => {
          if (data && Array.isArray(data.files)) {
            data.files.forEach(file_path => {
                this.loadJSON(`${file_path}.json`);
            });
          }
        })
        .catch(error => console.error('Error loading JSON files list:', error));

        this.shadowRoot.innerHTML += `
            </div>        
        `;
    }
    
      processData(jsonData) {
        let htmlContent = `
        <div class="text-overlay" 
        
            style="background-image: url('${jsonData.folderPath}${jsonData.images[0]}'); 
                background-position: center; 
                background-size: cover; 
                background-repeat: no-repeat; 
                border-radius: 8px; 
                overflow: hidden;"

            <h2>${jsonData.name}</h2>
            <p>${jsonData.text}</p>
            ${this.blog ? `<a href="${this.blog}" class="blog-link">Read More</a>` : ''}
        </div>
        `;
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
  
  customElements.define('project-component', Project);
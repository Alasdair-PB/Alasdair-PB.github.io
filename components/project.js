class Project extends Json {

    async loadJSONFiles(indexFile) {
      try {
        this.shadowRoot.innerHTML += `<link rel="stylesheet" href="index.css">  `;
          const response = await fetch(indexFile);
          const data = await response.json();
  
          if (data && Array.isArray(data.files)) {
              data.files.sort();
              for (const file of data.files) {
                  await this.loadJSON(`${file}.json`);
              }
          }
      } catch (error) {
          console.error('Error loading JSON files list:', error);
      }
      this.shadowRoot.innerHTML += `</div>`;
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

          <h2>${jsonData.Software}</h2>
          <h2>${jsonData.name}</h2>

          <div class="hide-on-mobile">
            <p>${jsonData.text}</p>
          </div>
          <a href="${jsonData.link}" id="myLink">See more</a>
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
      }
    }
  }
  
  customElements.define('project-component', Project);
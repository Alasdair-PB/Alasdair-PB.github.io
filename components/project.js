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
    let textOverlay = document.createElement("div");
    textOverlay.classList.add("project-overlay");    
    textOverlay.classList.add("text-overlay");

    textOverlay.style.backgroundImage = `url('${jsonData.folderPath}${jsonData.images[0]}')`;
    textOverlay.innerHTML += `
        <h2>${jsonData.Software}</h2>
        <h2>${jsonData.name}</h2>
        <div class="hide-on-mobile">
          <p>${jsonData.text}</p>
        </div>
        <a href="${jsonData.link}" id="myLink">See more</a>
    `;
  
    this.shadowRoot.appendChild(textOverlay);
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
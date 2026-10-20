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
    this.projectCount = (this.projectCount || 0) + 1;
    let projectGrid = this.shadowRoot.querySelector(".project-grid");
    if (!projectGrid) {
      projectGrid = document.createElement("div");
      projectGrid.classList.add("project-grid");
      this.shadowRoot.appendChild(projectGrid);
    }

    let textOverlay = document.createElement("div");
    textOverlay.classList.add("project-overlay");    
    textOverlay.classList.add("text-overlay");

    textOverlay.style.setProperty("--project-image", `url('${jsonData.folderPath}${jsonData.images[0]}')`);
    textOverlay.innerHTML = `
        <div class="project-card-content">
          <h2 id="project-title-${this.projectCount}">${jsonData.Software}</h2>
          <h2>${jsonData.name}</h2>
          <div class="hide-on-mobile">
            <p class="project-card-description">
              <span class="project-card-description-track">
                <span>${jsonData.text}</span>
                <span aria-hidden="true">${jsonData.text}</span>
              </span>
            </p>
          </div>
        </div>
        <a class="project-card-link" href="${jsonData.link}" aria-label="See more about ${jsonData.name}">See more</a>
    `;
  
    projectGrid.appendChild(textOverlay);
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
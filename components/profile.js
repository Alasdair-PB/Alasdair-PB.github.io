class Profile extends Json {

    constructor() {
        super();
      }

    connectedCallback() {
        const jsonFolderPath = 'blog/' + window.location.href.split('/').pop();

        if (jsonFolderPath) {
            this.contentReady = this.loadJSON(`${jsonFolderPath}/intro.json`)
                .then(() => this.dispatchContentReady());
        } else {
            console.error('Missing data-json-folder attribute.');
            this.contentReady = Promise.resolve();
        }
      }

    
    processData(jsonData) {
        let htmlContent = `
            <link rel="stylesheet" href="index.css">  
            <div class="profile-card">
              <header class="profile-card-header">
                <img src="${jsonData.folderPath}${jsonData.images[0]}" alt="${jsonData.imageAlt || `${jsonData.name || 'Project'} image`}">
                <div class="profile-card-heading">
                  <h1>${jsonData.name}</h1>
                  ${jsonData.Software ? `<p class="profile-card-subtitle">${jsonData.Software}</p>` : ''}
                </div>
              </header>
              <div class="profile-card-body">
                <h2>About this project</h2>
                <p class="bio-description">${jsonData.text}</p>
                <p>${jsonData.description}</p>
                ${jsonData.ProjectLinks && jsonData.ProjectLinks.length > 0 ? jsonData.ProjectLinks.map((link, index) => `
                  <a class="profile-project-link" href="${link}">${jsonData.ProjectNames && jsonData.ProjectNames[index] ? jsonData.ProjectNames[index] : 'Project link'}</a>`).join('') : ''}
              </div>
            </div>
        `;
        this.shadowRoot.innerHTML += htmlContent;
    }
  
    static get observedAttributes() {
      return [];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
          this[name] = newValue;
          this.render();
      }
    }
}

customElements.define('profile-component', Profile);
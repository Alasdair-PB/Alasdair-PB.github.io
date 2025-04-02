class Profile extends Json {

    constructor() {
        super();
      }

    connectedCallback() {
        const jsonFolderPath = 'blog/' + window.location.href.split('/').pop();

        if (jsonFolderPath) {
            this.loadJSON(`${jsonFolderPath}/intro.json`);
        } else {
            console.error('Missing data-json-folder attribute.');
        }
      }

    
    processData(jsonData) {
        let htmlContent = `
            <link rel="stylesheet" href="index.css">  
            <div class="intro">
              <img src='${jsonData.folderPath}${jsonData.images[0]}'>
              <h1 class="title">${jsonData.name}</h1>
              <h2>About this project</h2>
              <div class="arrow-text">
                  ${jsonData.text}
              </div>
              <p> ${jsonData.description} </p>
              ${jsonData.ProjectLinks && jsonData.ProjectLinks.length > 0 ? jsonData.ProjectLinks.map((link, index) => `
                <a class="intro" href="${link}">${jsonData.ProjectNames && jsonData.ProjectNames[index] ? jsonData.ProjectNames[index] : 'Github Repo'}</a>`).join('') : ''}
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
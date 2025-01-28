class Blogger extends Json {

    constructor() {
        super();
      }

    connectedCallback() {
        const jsonFolderPath = 'blog/' + window.location.href.split('/').pop();
        this.processData(jsonFolderPath);
      }

    
    processData(jsonFolderPath) {
        let htmlContent = `
            <link rel="stylesheet" href="index.css">  
            <blog-component 
                class="card-container"
                path=${jsonFolderPath}
                myIndexFile = "index">
            </blog-component>
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

customElements.define('blogger-component', Blogger);
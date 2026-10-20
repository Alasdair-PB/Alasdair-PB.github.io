class Blogger extends Json {

    constructor() {
        super();
      }

    connectedCallback() {
        const route = window.location.hash.replace(/^#\/?/, '').trim();
        const jsonFolderPath = route && route !== 'home' ? `blog/${route}` : 'blog';
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
        const blogComponent = this.shadowRoot.querySelector('blog-component');
        this.contentReady = blogComponent.contentReady || new Promise(resolve => {
            blogComponent.addEventListener('content-ready', resolve, { once: true });
        });
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
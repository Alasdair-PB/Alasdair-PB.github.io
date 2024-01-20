class Card extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.title = '';
        this.text = '';
        this.image = '';
        this.blog = '';
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="index.css">
            <div class="card">
                <h2>${this.title}</h2>
                <p>${this.text}</p>
                <img src=${this.image}>
                ${this.blog ? `<a href="${this.blog}" class="blog-link">Read More</a>` : ''}
            </div>
        `;
    }

    static get observedAttributes() {
        return ['title', 'text', 'image', 'blog'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue;
            this.render();
        }
    }
}

customElements.define('card-component', Card);

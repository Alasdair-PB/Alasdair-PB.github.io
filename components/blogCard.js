class BlogCard extends Card {

    render() {
        this.shadowRoot.innerHTML = `
            <p> ${this.title} </p>
        `;
    }

}

customElements.define('blog-card-component', BlogCard);
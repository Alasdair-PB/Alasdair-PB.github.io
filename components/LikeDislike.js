class LikeDislike extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.likeCount = 0;
        this.dislikeCount = 0;
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.getElementById('likeButton').addEventListener('click', this.like.bind(this));
        this.shadowRoot.getElementById('dislikeButton').addEventListener('click', this.dislike.bind(this));
    }

    render() {

        
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="index.css">
            <div class="like_dislike">
                <button id="likeButton">Like ${this.likeCount}</button>
                <button id="dislikeButton">Dislike ${this.dislikeCount}</button>
        `;
    }

    like() {
        this.likeCount++;
        this.render();
    }

    dislike() {
        this.dislikeCount++;
        this.render();
    }
}

customElements.define('like-dislike', LikeDislike);

class LinkClickHandler {
    constructor(link) {
      this.link = link;
    }
  
    handleClick(event) {
      if (event.button === 0) {
        event.preventDefault();
        window.location.href = this.link;
      }
    }
  
    attachTo(element) {
      element.addEventListener('click', (event) => this.handleClick(event));
    }
  }
  
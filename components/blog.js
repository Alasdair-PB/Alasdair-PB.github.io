class Blog extends Json {

  loadJSONFiles(indexFile) {
    fetch(indexFile)
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data.files)) {
          data.files.forEach(file => {
              this.loadJSON(`${this.path}/${file}.json`);
          });
        }
      })
      .catch(error => console.error('Error loading JSON files list:', error));
  }
  
    processData(jsonData) {
      let htmlContent = `
      <link rel="stylesheet" href="index.css">
      <div class="blog">
      `;
    
      if (jsonData.images && Array.isArray(jsonData.images)) {
          jsonData.images.forEach(imageFilename => {
              htmlContent += `<img src="${jsonData.folderPath}${imageFilename}">`;
          });
      }

      htmlContent += `          
        <h2>${jsonData.name}</h2> 
        <p>${jsonData.text}</p> 
    `;
      
      htmlContent += `</div>`;
      this.shadowRoot.innerHTML += htmlContent;
      
    }
}

customElements.define('blog-component', Blog);
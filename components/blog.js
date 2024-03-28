class Blog extends Json {
  constructor() {
    super();
    this.reverseOrder = false;
    this.indexFile = '';
  }


  loadJSONFiles(indexFile) {
    this.indexFile = indexFile;
    fetch(indexFile)
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data.files)) {
                data.files.sort((a, b) => {
                    const valueA = this.parseValue(a);
                    const valueB = this.parseValue(b);
                    if (valueA && valueB) {
                      const diff = valueA - valueB;
                      return this.reverseOrder ? diff : -diff;
                    } else {
                        console.log("Invalid value found, no change in order.");
                        return 0;
                    }
                });
                data.files.forEach(file => {
                    this.loadJSON(`${this.path}/${file}.json`);
                });
            }
        })
        .catch(error => console.error('Error loading JSON files list:', error));
  }

  toggleOrder() {
    console.log("Invalid value found, no change in order.");
    this.reverseOrder = !this.reverseOrder;
    this.shadowRoot.innerHTML = ''; 
    this.loadJSONFiles(this.indexFile);
  }


  parseValue(valueString) {
    const match = valueString.match(/\d+/); 
    if (match) {
        return parseInt(match[0], 10);
    } else {
        console.error('Invalid value format:', valueString);
        return null;
    }
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
      <hr>
      <p>${jsonData.text}</p>
      <p>last updated: ${jsonData.date}</p>
    `;
      
    htmlContent += `</div>`;
    this.shadowRoot.innerHTML += htmlContent;
  }
}

customElements.define('blog-component', Blog); 

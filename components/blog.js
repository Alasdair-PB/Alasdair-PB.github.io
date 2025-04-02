class Blog extends Json {
  constructor() {
    super();
    this.reverseOrder = true;
    this.indexFile = '';
  }


  async loadJSONFiles(indexFile) {
    try {
        this.indexFile = indexFile;
        const response = await fetch(indexFile);
        const data = await response.json();

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

            for (const file of data.files) {
                await this.loadJSON(`${this.path}/${file}.json`); 
            }
        }
    } catch (error) {
        console.error('Error loading JSON files list:', error);
    }
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
      <p>Last updated: ${jsonData.date}</p>
    `;
  
    if (jsonData.Videos && Array.isArray(jsonData.Videos) && jsonData.Videos.length > 0) {
      jsonData.Videos.forEach(videoUrl => {
        const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/|.*[?&]v=))([^"&?\/\s]{11})/);
        if (videoIdMatch && videoIdMatch[1]) {
          const videoId = videoIdMatch[1];
          htmlContent += `
            <div class="video-container">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
          `;
        }
      });
    }
  
    htmlContent += `</div>`;
    this.shadowRoot.innerHTML += htmlContent;
  }
}

customElements.define('blog-component', Blog); 

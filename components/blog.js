class Blog extends Json {
  constructor() {
    super();
    this.reverseOrder = true;
    this.indexFile = '';
    this.entryCount = 0;
  }


  async loadJSONFiles(indexFile) {
    try {
        this.indexFile = indexFile;
        this.entryCount = 0;
        const data = await this.getJSON(indexFile);

        if (data && Array.isArray(data.files)) {
            data.files.sort((a, b) => {
                const valueA = this.parseValue(a);
                const valueB = this.parseValue(b);
                if (valueA && valueB) {
                    const diff = valueA - valueB;
                    return this.reverseOrder ? diff : -diff;
                } else {
                    console.log('Invalid value found, no change in order.');
                    return 0;
                }
            });

            for (const file of data.files) {
                await this.loadJSON(`${this.path}/${file}.json`);
            }
        }
    } catch (error) {
        console.error('Error loading JSON files list —', error);
    }
}

  toggleOrder() {
    console.log('Invalid value found, no change in order.');
    this.reverseOrder = !this.reverseOrder;
    this.shadowRoot.innerHTML = '';
    this.loadJSONFiles(this.indexFile);
  }


  parseValue(valueString) {
    const match = valueString.match(/\d+/);
    if (match) {
        return parseInt(match[0], 10);
    } else {
        console.error('Invalid value format —', valueString);
        return null;
    }
  }

  
  processData(jsonData) {
    const imageSide = this.entryCount % 2 === 0 ? ' image-left' : '';
    this.entryCount++;
    const titleId = `blog-title-${this.entryCount}`;
    let imageContent = '';
    if (jsonData.images && Array.isArray(jsonData.images)) {
      jsonData.images.forEach((imageFilename, index) => {
        const imageAlt = jsonData.imageAlts && jsonData.imageAlts[index]
          ? jsonData.imageAlts[index]
          : `${jsonData.name || 'Blog'} image`;
        imageContent += `<img src="${jsonData.folderPath}${imageFilename}" loading="lazy" decoding="async" alt="${imageAlt}">`;
      });
    }

    let htmlContent = `
      <link rel="stylesheet" href="index.css">
      <article class="blog" aria-labelledby="${titleId}">
        <header class="blog-header">
          <div class="blog-heading">
            <h2 id="${titleId}">${jsonData.name}</h2>
            ${jsonData.subtitle ? `<p class="blog-subtitle">${jsonData.subtitle}</p>` : ''}
          </div>
        </header>
        <div class="blog-content${imageContent ? ` has-images${imageSide}` : ''}">
    `;

    htmlContent += `
          <div class="blog-copy">
            <p>${jsonData.text}</p>
            <p>Last updated: ${jsonData.date}</p>
          </div>
          ${imageContent ? `<div class="blog-images">${imageContent}</div>` : ''}
        </div>
    `;
  
    if (jsonData.Videos && Array.isArray(jsonData.Videos) && jsonData.Videos.length > 0) {
      jsonData.Videos.forEach(videoUrl => {
        const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/|.*[?&]v=))([^"&?\/\s]{11})/);
        if (videoIdMatch && videoIdMatch[1]) {
          const videoId = videoIdMatch[1];
          htmlContent += `
            <div class="video-container">
              <iframe src="https://www.youtube.com/embed/${videoId}" title="${jsonData.name} video" allowfullscreen loading="lazy"></iframe>
            </div>
          `;
        }
      });
    }
  
    htmlContent += `</article>`;
    this.shadowRoot.innerHTML += htmlContent;
  }
}

customElements.define('blog-component', Blog); 

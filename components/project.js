class Project extends Json {

    async loadJSONFiles(indexFile) {
      try {
          const response = await fetch(indexFile);
          const data = await response.json();
  
          if (data && Array.isArray(data.files)) {
              data.files.sort();
              for (const file of data.files) {
                  await this.loadJSON(`${this.path}/${file}.json`);
              }
          }
      } catch (error) {
          console.error('Error loading JSON files list:', error);
      }
  }

    processData(jsonData) {
      let htmlContent = `
      <div class="text-overlay" 
      
          style="background-image: url('${jsonData.folderPath}${jsonData.images[0]}'); 
              background-position: center; 
              background-size: cover; 
              background-repeat: no-repeat; 
              border-radius: 8px; 
              overflow: hidden;"

          <h2>${jsonData.name}</h2>
          <p>${jsonData.text}</p>

          <script>
            function handleClick(event) {
              if (event.button === 0) {
                navigate('${jsonData.link}');
                event.preventDefault(); 
              }
            }
          </script>

          <a href="${jsonData.link}" target="_blank" rel="noopener noreferrer">see more</a>
      </div>
      `;
      this.shadowRoot.innerHTML += htmlContent;
    }

  
  
    static get observedAttributes() {
      return ['path'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
          this[name] = newValue;
          this.render();
      }
    }
  }
  
  customElements.define('project-component', Project);
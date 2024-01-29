async function loadContent(url) {
    document.getElementById('loading').style.display = 'block';

    try {
        const response = await fetch(url);
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error fetching content:', error);
        return '<p>Error loading content</p>';
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function navigate(hash) {
    window.location.hash = hash;
}

function router() {
    let hash = window.location.hash;

    if (!hash || hash === '#/') {
        hash = '#/home';
    }

    const contentDiv = document.getElementById('content');

    switch (hash) {
        case '#/home': 
            loadContent('home.html').then(html => contentDiv.innerHTML = html);
            break;
        default:
            loadContent('loader.html').then(html => contentDiv.innerHTML = html);
            break;
    }
}

window.onload = function() {
    document.getElementById('loading').style.display = 'none';
};

window.addEventListener('hashchange', router);

if (!window.location.hash || window.location.hash === '#/') {
    window.location.hash = '#/home';
    router(); 
} else {
    router(); 
}

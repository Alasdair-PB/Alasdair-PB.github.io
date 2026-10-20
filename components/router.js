let loadingDismissTimer;
let loadingHideTimer;
let currentNavigation = 0;
let navigationShell;
let navigationShellPromise;
const minimumLoadingDuration = 1900;

function resetLoading() {
    const loading = document.getElementById('loading');
    if (!loading) {
        return;
    }

    clearTimeout(loadingDismissTimer);
    clearTimeout(loadingHideTimer);
    loading.style.display = 'flex';
    loading.classList.remove('is-complete', 'is-dismissing', 'is-loading');
    loading.classList.add('is-resetting');
    void loading.offsetWidth;
}

function startLoading() {
    const loading = document.getElementById('loading');
    if (!loading) {
        return;
    }

    loading.classList.remove('is-resetting');
    void loading.offsetWidth;
    loading.classList.add('is-loading');
}

function completeLoading(navigationId) {
    const loading = document.getElementById('loading');
    if (!loading || navigationId !== currentNavigation) {
        return;
    }

    loading.classList.remove('is-loading');
    loading.classList.add('is-complete');
    loadingDismissTimer = setTimeout(() => {
        if (navigationId !== currentNavigation) {
            return;
        }
        loading.classList.add('is-dismissing');
        loadingHideTimer = setTimeout(() => {
            if (navigationId !== currentNavigation) {
                return;
            }
            loading.style.display = 'none';
            loading.classList.remove('is-complete', 'is-dismissing', 'is-loading');
        }, 400);
    }, 300);
}

async function loadContent(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Request failed for ${url}: ${response.status}`);
    }
    return response.text();
}

function getNavigationShell() {
    if (!navigationShellPromise) {
        navigationShellPromise = loadContent('toolsBar.html').then(html => {
            navigationShell = html;
            return html;
        });
    }
    return navigationShellPromise;
}

function waitForPageContent() {
    const components = document.querySelectorAll(
        'blogger-component, blog-component, project-component, profile-component'
    );
    return Promise.all(Array.from(components, component => component.contentReady || Promise.resolve()));
}

function waitForMinimumLoadingTime(startedAt) {
    const remaining = Math.max(0, minimumLoadingDuration - (performance.now() - startedAt));
    return new Promise(resolve => setTimeout(resolve, remaining));
}

function preloadBanner() {
    if (document.querySelector('link[rel="preload"][href="misc/Img/art/zero-attention.jpg"]')) {
        return;
    }

    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'image';
    preload.href = 'misc/Img/art/zero-attention.jpg';
    document.head.appendChild(preload);
}

function navigate(hash) {
    window.location.hash = hash;
}

function updateNavigation(hash) {
    const route = hash.replace(/^#\/?/, '').trim();
    const routeTitles = {
        rogue: 'Tooling',
        mouseBlockade: 'Games',
        newcastle: 'Coursework'
    };
    const pageTitle = routeTitles[route] || (route && route !== 'home'
        ? route.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ')
        : 'Portfolio');
    const currentPage = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);
    document.title = `${currentPage} | Alasdair PB`;
    const breadcrumb = document.querySelector('.breadcrumb-current');
    const homeBreadcrumb = document.querySelector('.breadcrumb-home');
    const breadcrumbs = document.querySelector('.breadcrumbs');
    const banner = document.querySelector('.banner');
    const routeLinks = document.querySelectorAll('.route-links a[data-route]');
    const homeLink = document.querySelector('.home a');

    if (breadcrumb) {
        breadcrumb.textContent = currentPage;
    }

    if (homeLink) {
        if (!route || route === 'home') {
            homeLink.setAttribute('aria-current', 'page');
        } else {
            homeLink.removeAttribute('aria-current');
        }
    }

    if (breadcrumbs) {
        breadcrumbs.hidden = !route || route === 'home';
    }

    if (homeBreadcrumb) {
        homeBreadcrumb.hidden = !route || route === 'home';
    }

    if (banner) {
        banner.hidden = route && route !== 'home';
    }

    routeLinks.forEach(link => {
        if (link.dataset.route === route) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function router() {
    let hash = window.location.hash;

    if (!hash || hash === '#/') {
        hash = '#/home';
    }

    if (hash === '#/home') {
        preloadBanner();
    }

    const navigationId = ++currentNavigation;
    let startedAt = performance.now();
    resetLoading();
    const contentDiv = document.getElementById('content');

    Promise.all([
        getNavigationShell(),
        loadContent(hash === '#/home' ? 'home.html' : 'loader.html')
    ]).then(async ([shell, content]) => {
        if (navigationId !== currentNavigation) {
            return;
        }

        const loading = document.getElementById('loading');
        if (loading) {
            loading.remove();
        }

        contentDiv.innerHTML = shell + content + '</div>';
        const renderedLoading = document.getElementById('loading');
        if (loading && renderedLoading) {
            renderedLoading.replaceWith(loading);
        }

        updateNavigation(hash);
        if (!loading) {
            resetLoading();
        }
        startLoading();
        startedAt = performance.now();

        await Promise.all([
            waitForPageContent(),
            waitForMinimumLoadingTime(startedAt)
        ]);

        completeLoading(navigationId);
    }).catch(async error => {
        if (navigationId !== currentNavigation) {
            return;
        }
        console.error('Error loading page:', error);
        const loading = document.getElementById('loading');
        if (loading) {
            loading.remove();
        }
        contentDiv.innerHTML = `${navigationShell || ''}<main class="container"><p>Error loading page content.</p></main></div>`;
        const renderedLoading = document.getElementById('loading');
        if (loading && renderedLoading) {
            renderedLoading.replaceWith(loading);
        }
        if (!document.getElementById('loading')) {
            return;
        }
        if (!loading) {
            resetLoading();
        }
        startLoading();
        startedAt = performance.now();
        await waitForMinimumLoadingTime(startedAt);
        completeLoading(navigationId);
    });
}

window.addEventListener('hashchange', router);

if (!window.location.hash || window.location.hash === '#/') {
    window.location.hash = '#/home';
    router(); 
} else {
    router(); 
}

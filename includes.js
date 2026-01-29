const getBasePath = () => {
    const base = document.body?.dataset?.base || '.';
    if (!base || base === '/') {
        return '';
    }
    return base.endsWith('/') ? base.slice(0, -1) : base;
};

const includePartial = async (selector, url) => {
    const target = document.querySelector(selector);
    if (!target) {
        return null;
    }

    try {
        const response = await fetch(url, { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.status}`);
        }
        target.innerHTML = await response.text();
        return target;
    } catch (error) {
        console.warn('[includes] partial load failed', error);
        return null;
    }
};

(async () => {
    const basePath = getBasePath();
    const headerUrl = `${basePath}/partials/header.html`;
    const footerUrl = `${basePath}/partials/footer.html`;

    const headerWrapper = await includePartial('[data-include="header"]', headerUrl);
    const footerWrapper = await includePartial('[data-include="footer"]', footerUrl);

    if (headerWrapper) {
        const mode = document.body?.dataset?.header || 'always';
        if (mode === 'always') {
            const header = headerWrapper.querySelector('header');
            if (header) {
                header.classList.add('header-visible');
            }
        }
    }

    const normalizeLink = (link) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('/')) {
            return;
        }
        // Skip language links or external links that shouldn't be prefixed
        if (href.startsWith('/en/') || href.startsWith('/ua/')) {
            return;
        }

        if (!basePath) {
            return;
        }
        link.setAttribute('href', `${basePath}${href}`);
    };

    headerWrapper?.querySelectorAll('a[href^="/"]').forEach(normalizeLink);
    footerWrapper?.querySelectorAll('a[href^="/"]').forEach(normalizeLink);
})();

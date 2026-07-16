if (window.location.protocol !== 'file:') {
  function navegar(url) {
    if (url === location.pathname || url === location.pathname + location.search) return;
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var mainNuevo = doc.querySelector('main');
        var mainViejo = document.querySelector('main');
        if (mainNuevo && mainViejo) {
          mainViejo.replaceWith(mainNuevo);
        }
        document.title = doc.title;
        history.pushState(null, '', url);
        var filename = url.split('?')[0].split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(function (nl) {
          nl.classList.remove('activo');
          if (nl.getAttribute('href') === filename) nl.classList.add('activo');
        });
        if (url.includes('comprar')) {
          if (typeof iniciarCompra === 'function') {
            iniciarCompra();
          } else {
            var s = document.createElement('script');
            s.src = 'js/compra.js?v=4';
            s.onload = function () {
              if (typeof iniciarCompra === 'function') iniciarCompra();
            };
            document.body.appendChild(s);
          }
        }
      })
      .catch(function () {
        window.location.href = url;
      });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.hasAttribute('download') || link.target === '_blank') return;
    if (link.hostname && link.hostname !== location.hostname) return;
    if (href === location.pathname || href === location.href) return;
    e.preventDefault();
    navegar(href);
  });

  window.addEventListener('popstate', function () {
    navegar(location.pathname + location.search);
  });
}

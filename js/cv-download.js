/* CV download.
   A normal <a download> link works on any web host and from the local folder.
   Inside the Claude artifact viewer plain downloads are blocked, so when its
   "downloads" capability is available the click is routed through it instead. */
(function () {
  var links = document.querySelectorAll('a[data-cv]');
  if (!links.length || !window.claude || typeof window.claude.use !== 'function') return;

  window.claude.use('downloads').then(function (downloads) {
    if (!downloads) return;                                  // keep the normal link behaviour
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var name = a.getAttribute('download') || 'cv.pdf';
        fetch(a.getAttribute('href'))
          .then(function (r) { return r.blob(); })
          .then(function (blob) { return downloads.save({ filename: name, data: blob }); })
          .catch(function () { window.location.href = a.getAttribute('href'); });
      });
    });
  });
})();

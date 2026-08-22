---
layout: null
permalink: /app.js
---
(function () {
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('{{ "/sw.js" | relative_url }}?v={{ site.time | date: "%s" }}');
    });
  }
}());

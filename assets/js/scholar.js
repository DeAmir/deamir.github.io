(function () {
  'use strict';

  var root = document.documentElement;
  var themeToggle = document.querySelector('.theme-toggle');
  var themeColor = document.querySelector('[data-theme-color]');
  var navToggle = document.querySelector('.nav-toggle');
  var navigation = document.querySelector('.site-navigation');
  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  function storedTheme() {
    try { return localStorage.getItem('scholar-theme'); } catch (error) { return null; }
  }

  function setTheme(theme, persist) {
    root.dataset.theme = theme;

    if (persist) {
      try { localStorage.setItem('scholar-theme', theme); } catch (error) {}
    }

    if (themeToggle) {
      var nextTheme = theme === 'dark' ? 'light' : 'dark';
      themeToggle.setAttribute('aria-label', 'Switch to ' + nextTheme + ' theme');
      themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    if (themeColor) {
      themeColor.setAttribute('content', theme === 'dark' ? '#111d20' : '#edf5f7');
    }

    updateGiscusTheme(theme);
  }

  function updateGiscusTheme(theme) {
    var giscusFrame = document.querySelector('iframe.giscus-frame');
    if (!giscusFrame) return;
    giscusFrame.contentWindow.postMessage({
      giscus: { setConfig: { theme: theme === 'dark' ? 'dark' : 'light' } }
    }, 'https://giscus.app');
  }

  setTheme(root.dataset.theme || 'light', false);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });
  }

  function handleSystemTheme(event) {
    if (!storedTheme()) setTheme(event.matches ? 'dark' : 'light', false);
  }

  if (typeof systemTheme.addEventListener === 'function') {
    systemTheme.addEventListener('change', handleSystemTheme);
  } else if (typeof systemTheme.addListener === 'function') {
    systemTheme.addListener(handleSystemTheme);
  }

  if (navToggle && navigation) {
    navToggle.addEventListener('click', function () {
      var open = navigation.dataset.open !== 'true';
      navigation.dataset.open = String(open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.querySelector('.sr-only').textContent = open ? 'Close navigation' : 'Open navigation';
    });

    navigation.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        navigation.dataset.open = 'false';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var comments = document.querySelector('.comments');
  if (comments && 'MutationObserver' in window) {
    new MutationObserver(function () {
      updateGiscusTheme(root.dataset.theme || 'light');
    }).observe(comments, { childList: true, subtree: true });
  }

  var copyButton = document.querySelector('[data-copy-url]');
  if (copyButton) {
    copyButton.addEventListener('click', function () {
      var status = document.querySelector('.copy-status');
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        if (status) status.textContent = 'Copy unavailable';
        return;
      }
      navigator.clipboard.writeText(window.location.href).then(function () {
        if (status) status.textContent = 'Copied';
      }).catch(function () {
        if (status) status.textContent = 'Copy unavailable';
      });
    });
  }

  var content = document.querySelector('[data-post-content]');
  var toc = document.querySelector('[data-toc]');
  var tocDetails = document.querySelector('.toc-details');
  var currentSection = document.querySelector('[data-toc-current]');
  var progressTrack = document.querySelector('.reading-progress');
  var progressBar = document.querySelector('[data-reading-progress]');

  if (tocDetails && window.matchMedia('(max-width: 760px)').matches) {
    tocDetails.open = false;
  }

  if (content && toc) {
    var headings = Array.from(content.querySelectorAll('h2, h3'));
    var usedIds = new Set();
    var list = document.createElement('ol');

    headings.forEach(function (heading, index) {
      var baseId = heading.id || 'section-' + (index + 1);
      var uniqueId = baseId;
      var suffix = 2;

      while (usedIds.has(uniqueId)) {
        uniqueId = baseId + '-' + suffix;
        suffix += 1;
      }

      usedIds.add(uniqueId);
      heading.id = uniqueId;

      var item = document.createElement('li');
      item.dataset.level = heading.tagName === 'H3' ? '3' : '2';
      var link = document.createElement('a');
      link.href = '#' + encodeURIComponent(uniqueId);
      link.textContent = heading.textContent;
      item.appendChild(link);
      list.appendChild(item);
    });

    if (headings.length) toc.appendChild(list);

    var links = Array.from(toc.querySelectorAll('a'));

    function setCurrentLink(activeLink) {
      links.forEach(function (link) {
        link.removeAttribute('aria-current');
      });
      if (activeLink) activeLink.setAttribute('aria-current', 'location');
      if (currentSection) {
        currentSection.textContent = activeLink
          ? activeLink.textContent
          : currentSection.dataset.defaultSection;
      }
    }

    function updateReadingState() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var marker = scrollTop + Math.min(window.innerHeight * 0.2, 160);
      var activeHeading = null;

      headings.forEach(function (heading) {
        var headingTop = heading.getBoundingClientRect().top + scrollTop;
        if (headingTop <= marker) activeHeading = heading;
      });

      var activeLink = activeHeading && links.find(function (link) {
        return decodeURIComponent(link.hash.slice(1)) === activeHeading.id;
      });
      setCurrentLink(activeLink || null);

      if (progressBar && progressTrack) {
        var contentTop = content.getBoundingClientRect().top + scrollTop;
        var contentEnd = contentTop + content.offsetHeight - window.innerHeight;
        var distance = Math.max(contentEnd - contentTop, 1);
        var progress = Math.max(0, Math.min(1, (scrollTop - contentTop) / distance));
        progressBar.style.transform = 'scaleX(' + progress + ')';
        progressTrack.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
      }
    }

    var readingFrame = null;
    function scheduleReadingUpdate() {
      if (readingFrame !== null) return;
      readingFrame = window.requestAnimationFrame(function () {
        readingFrame = null;
        updateReadingState();
      });
    }

    window.addEventListener('load', function () {
      if (window.MathJax && MathJax.startup && MathJax.startup.promise) {
        MathJax.startup.promise.then(function () {
          if (MathJax.typesetPromise) {
            MathJax.typesetPromise([toc]).then(scheduleReadingUpdate);
          }
        });
      }
      scheduleReadingUpdate();
    });

    toc.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (!link) return;
      setCurrentLink(link);

      if (window.matchMedia('(max-width: 760px)').matches) {
        var details = toc.closest('details');
        if (details) details.open = false;
      }
    });

    window.addEventListener('scroll', scheduleReadingUpdate, { passive: true });
    window.addEventListener('resize', scheduleReadingUpdate);

    if ('ResizeObserver' in window) {
      new ResizeObserver(scheduleReadingUpdate).observe(content);
    }

    scheduleReadingUpdate();
  }
}());

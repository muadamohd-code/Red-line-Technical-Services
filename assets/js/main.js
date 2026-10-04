// RED LINE — Technical Services — shared behaviour

document.addEventListener('DOMContentLoaded', function () {

  // mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // scroll reveal (with fallback so content never stays permanently hidden)
  var revealEls = document.querySelectorAll('[data-reveal]');
  var showEl = function (el) {
    el.style.opacity = 1;
    el.style.transform = 'translateY(0)';
  };
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && revealEls.length && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          showEl(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) {
      el.style.opacity = 0;
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      io.observe(el);
    });

    window.setTimeout(function () {
      revealEls.forEach(showEl);
    }, 2500);
  } else {
    revealEls.forEach(showEl);
  }

  // contact / quote request form
  var form = document.getElementById('quoteForm');
  if (form) {
    var formStatus = document.getElementById('formStatus');

    var isArabic = document.documentElement.lang === 'ar';
    var endpoint = 'https://formsubmit.co/ajax/redline.aj@outlook.com';
    var submitBtn = form.querySelector('button[type="submit"]');
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };

    var makeRequestId = function (d) {
      var key = 'rltRequestSeq-' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
      var seq = 1;
      try {
        seq = (parseInt(localStorage.getItem(key), 10) || 0) + 1;
        localStorage.setItem(key, seq);
      } catch (err) {
        seq = Math.floor(Math.random() * 900) + 100;
      }
      return 'RLT-' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '-' + ('00' + seq).slice(-3);
    };

    var showStatus = function (ok, text) {
      if (!formStatus) return;
      formStatus.style.display = 'block';
      formStatus.style.color = ok ? '#3E7A44' : '#B3261E';
      formStatus.textContent = text;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var now = new Date();
      var requestId = makeRequestId(now);
      var services = Array.prototype.map.call(
        form.querySelectorAll('input[name="service"]:checked'),
        function (c) { return c.value; }
      ).join(', ');
      var val = function (id) { var el = form.elements[id]; return el && el.value ? el.value : '-'; };

      // keys are kept in column order for the table-style email
      var data = {
        'Request ID': requestId,
        'Date & Time': now.toLocaleString('en-GB', { timeZone: 'Asia/Dubai' }) + ' (UAE)',
        'Full Name': val('name'),
        'Email': val('email'),
        'Phone': val('phone'),
        'Company / Property Name': val('company'),
        'Emirate': val('emirate'),
        'Property Type': val('property'),
        'Services': services || '-',
        'Project Details': val('message'),
        'Language': isArabic ? 'Arabic' : 'English',
        '_subject': 'New Quote Request ' + requestId + ' - Red Line Technical Services',
        '_template': 'table',
        '_captcha': 'false'
      };
      if (form.elements.email && form.elements.email.value) { data._replyto = form.elements.email.value; }

      if (submitBtn) submitBtn.disabled = true;
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      }).then(function () {
        var msg = form.getAttribute('data-success-message') || 'Thank you! Your request has been sent.';
        showStatus(true, msg + ' (' + requestId + ')');
        form.reset();
      }).catch(function () {
        showStatus(false, isArabic
          ? 'تعذّر إرسال الطلب. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.'
          : 'Sorry, your request could not be sent. Please try again or contact us directly.');
      }).then(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }

});

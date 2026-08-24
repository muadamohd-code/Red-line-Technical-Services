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

    // safety net: force everything visible after 2.5s no matter what
    // (covers browsers/environments where the observer never fires,
    // e.g. elements already in the initial viewport in some engines)
    window.setTimeout(function () {
      revealEls.forEach(showEl);
    }, 2500);
  } else {
    // no IntersectionObserver support or reduced-motion preference: just show everything
    revealEls.forEach(showEl);
  }

  // contact / quote request form -> Google Form embed-style submission target
  var form = document.getElementById('quoteForm');
  if (form) {
    var formStatus = document.getElementById('formStatus');
    var googleFormEndpoint = 'https://docs.google.com/forms/d/e/YOUR_GOOGLE_FORM_ID/formResponse';

    form.addEventListener('submit', function () {
      if (formStatus) {
        formStatus.style.display = 'block';
        formStatus.style.color = '#3E7A44';
        formStatus.textContent = 'Submitting your request…';
      }
    });

    form.action = googleFormEndpoint;
    form.method = 'POST';
    form.target = 'hiddenQuoteFrame';
    form.addEventListener('submit', function () {
      window.setTimeout(function () {
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.style.color = '#3E7A44';
          formStatus.textContent = 'Your request has been sent. We will get back to you shortly.';
        }
        form.reset();
      }, 900);
    });
  }

});

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

  // building health check request modal
  var isArabic = document.documentElement.lang === 'ar';
  var floatingActions = document.createElement('div');
  floatingActions.className = 'floating-actions';
  floatingActions.innerHTML = isArabic
    ? '<button class="health-check-trigger" type="button">فحص مجاني لصحة المبنى</button><a class="whatsapp-float" href="https://wa.me/971506872422" target="_blank" rel="noopener noreferrer" aria-label="تواصل معنا عبر واتساب">واتساب</a>'
    : '<button class="health-check-trigger" type="button">Free Building Health Check</button><a class="whatsapp-float" href="https://wa.me/971506872422" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">WhatsApp</a>';
  floatingActions.insertAdjacentHTML('beforeend', isArabic
    ? '<dialog class="health-check-modal" aria-labelledby="healthCheckTitle"><div class="health-check-header"><h2 id="healthCheckTitle">فحص مجاني لصحة المبنى</h2><button class="health-check-close" type="button" aria-label="إغلاق">×</button></div><p>أرسل بياناتك لنتواصل معك لتقييم احتياجات المبنى.</p><form id="healthCheckForm"><div class="health-check-fields"><div class="field"><label for="healthBuilding">اسم المبنى</label><input id="healthBuilding" name="Building Name" required></div><div class="field"><label for="healthProperty">نوع العقار</label><input id="healthProperty" name="Property Type" required></div><div class="field"><label for="healthEmirate">الإمارة</label><select id="healthEmirate" name="Emirate" required><option value="">اختر الإمارة</option><option>عجمان</option><option>الشارقة</option><option>دبي</option><option>أخرى</option></select></div><div class="field"><label for="healthContact">اسم جهة الاتصال</label><input id="healthContact" name="Contact Name" required></div><div class="field"><label for="healthPhone">رقم الهاتف</label><input id="healthPhone" name="Phone" type="tel" autocomplete="tel" required></div><div class="field"><label for="healthEmail">البريد الإلكتروني</label><input id="healthEmail" name="Email" type="email" autocomplete="email" required></div></div><button class="btn btn-primary" type="submit">إرسال الطلب</button><p class="health-check-status" role="status" aria-live="polite"></p></form></dialog>'
    : '<dialog class="health-check-modal" aria-labelledby="healthCheckTitle"><div class="health-check-header"><h2 id="healthCheckTitle">Free Building Health Check</h2><button class="health-check-close" type="button" aria-label="Close">×</button></div><p>Share your details and we will contact you to assess your building needs.</p><form id="healthCheckForm"><div class="health-check-fields"><div class="field"><label for="healthBuilding">Building Name</label><input id="healthBuilding" name="Building Name" required></div><div class="field"><label for="healthProperty">Property Type</label><input id="healthProperty" name="Property Type" required></div><div class="field"><label for="healthEmirate">Emirate</label><select id="healthEmirate" name="Emirate" required><option value="">Select an emirate</option><option>Ajman</option><option>Sharjah</option><option>Dubai</option><option>Other</option></select></div><div class="field"><label for="healthContact">Contact Name</label><input id="healthContact" name="Contact Name" autocomplete="name" required></div><div class="field"><label for="healthPhone">Phone</label><input id="healthPhone" name="Phone" type="tel" autocomplete="tel" required></div><div class="field"><label for="healthEmail">Email</label><input id="healthEmail" name="Email" type="email" autocomplete="email" required></div></div><button class="btn btn-primary" type="submit">Request my free check</button><p class="health-check-status" role="status" aria-live="polite"></p></form></dialog>');
  document.body.appendChild(floatingActions);

  var healthDialog = floatingActions.querySelector('.health-check-modal');
  var healthForm = floatingActions.querySelector('#healthCheckForm');
  var healthTrigger = floatingActions.querySelector('.health-check-trigger');
  healthTrigger.addEventListener('click', function () {
    healthDialog.showModal();
    healthDialog.querySelector('input').focus();
  });
  floatingActions.querySelector('.health-check-close').addEventListener('click', function () {
    healthDialog.close();
    healthTrigger.focus();
  });
  healthDialog.addEventListener('click', function (event) {
    if (event.target === healthDialog) healthDialog.close();
  });
  healthForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var submitBtn = healthForm.querySelector('button[type="submit"]');
    var status = healthForm.querySelector('.health-check-status');
    var data = {};
    new FormData(healthForm).forEach(function (value, key) { data[key] = value; });
    data.Language = isArabic ? 'Arabic' : 'English';
    data._subject = 'Free Building Health Check Request - Red Line Technical Services';
    data._template = 'table';
    data._captcha = 'false';
    submitBtn.disabled = true;
    status.textContent = '';

    fetch('https://formsubmit.co/ajax/redline.aj@outlook.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    }).then(function () {
      status.textContent = isArabic
        ? 'شكرًا لك، تم إرسال طلبك بنجاح.'
        : 'Thank you. Your request has been sent.';
      healthForm.reset();
    }).catch(function () {
      status.textContent = isArabic
        ? 'تعذر إرسال الطلب. يرجى المحاولة مرة أخرى أو التواصل معنا عبر واتساب.'
        : 'Your request could not be sent. Please try again or contact us on WhatsApp.';
    }).then(function () {
      submitBtn.disabled = false;
    });
  });

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

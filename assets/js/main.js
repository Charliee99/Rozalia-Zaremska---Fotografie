/* Rozalia Zaremska Fotografia – skrypty strony (bez zewnętrznych bibliotek) */
(function () {
  'use strict';

  /* ---------- Nawigacja mobilna ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu');

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (mq) {
      if (mq.matches) setNav(false);
    });
  }

  /* ---------- Cień nagłówka po przewinięciu ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Podświetlenie aktywnej sekcji w menu ---------- */
  if ('IntersectionObserver' in window && nav) {
    var links = {};
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link || link.classList.contains('btn')) return;
        if (entry.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- Delikatne pojawianie się sekcji ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Rok w stopce ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Formularz kontaktowy ---------- */
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var sessionSelect = document.getElementById('f-session');
  var startedAt = Date.now();
  var MIN_FILL_MS = 3000; // szybsze wysłanie = prawdopodobnie bot
  var ENDPOINT = form.getAttribute('action');
  var CONTACT_EMAIL = 'kontakt@rozaliazaremska.pl';

  // Przyciski „Zapytaj” w ofercie wybierają rodzaj sesji w formularzu
  document.querySelectorAll('[data-session]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-session');
      for (var i = 0; i < sessionSelect.options.length; i++) {
        if (sessionSelect.options[i].text === value) { sessionSelect.selectedIndex = i; break; }
      }
      clearError(sessionSelect);
    });
  });

  var messages = {
    name: 'Podaj swoje imię.',
    emailMissing: 'Podaj adres e-mail, abym mogła odpowiedzieć.',
    emailInvalid: 'Ten adres e-mail wygląda na niepoprawny (np. imie@domena.pl).',
    rodzaj_sesji: 'Wybierz rodzaj sesji.',
    messageMissing: 'Napisz kilka słów o swoim pomyśle.',
    messageShort: 'Wiadomość jest za krótka – napisz proszę trochę więcej.',
    zgoda_rodo: 'Zaznacz zgodę na przetwarzanie danych – bez niej nie mogę odpowiedzieć.'
  };

  function errorEl(field) { return document.getElementById(field.id + '-err'); }

  function setError(field, msg) {
    field.setAttribute('aria-invalid', 'true');
    var el = errorEl(field);
    if (el) el.textContent = msg;
  }

  function clearError(field) {
    field.removeAttribute('aria-invalid');
    var el = errorEl(field);
    if (el) el.textContent = '';
  }

  function validateField(field) {
    var v = field.type === 'checkbox' ? field.checked : field.value.trim();
    switch (field.name) {
      case 'name':
        if (!v) return setError(field, messages.name), false;
        break;
      case 'email':
        if (!v) return setError(field, messages.emailMissing), false;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setError(field, messages.emailInvalid), false;
        break;
      case 'rodzaj_sesji':
        if (!v) return setError(field, messages.rodzaj_sesji), false;
        break;
      case 'message':
        if (!v) return setError(field, messages.messageMissing), false;
        if (v.length < 10) return setError(field, messages.messageShort), false;
        break;
      case 'zgoda_rodo':
        if (!v) return setError(field, messages.zgoda_rodo), false;
        break;
    }
    clearError(field);
    return true;
  }

  var validated = form.querySelectorAll('[required]');
  validated.forEach(function (field) {
    var evt = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'blur';
    field.addEventListener(evt, function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  function showStatus(type, html) {
    status.className = 'form-status form-status--' + type;
    status.innerHTML = html;
    if (type !== 'info') status.focus({ preventScroll: false });
  }

  function setSending(sending) {
    submitBtn.disabled = sending;
    submitBtn.textContent = sending ? 'Wysyłanie…' : 'Wyślij zapytanie';
    form.setAttribute('aria-busy', String(sending));
  }

  var fallback = 'Możesz też napisać bezpośrednio na <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // 1. Walidacja
    var firstInvalid = null;
    validated.forEach(function (field) {
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      showStatus('error', 'Uzupełnij proszę zaznaczone pola.');
      firstInvalid.focus();
      return;
    }

    // 2. Ochrona przed spamem: honeypot + minimalny czas wypełniania
    var data = new FormData(form);
    if (data.get('botcheck') || Date.now() - startedAt < MIN_FILL_MS) {
      // Udajemy sukces, żeby nie podpowiadać botom
      showStatus('success', 'Dziękuję! Wiadomość została wysłana.');
      form.reset();
      return;
    }

    // 3. Klucz nieskonfigurowany
    if (!data.get('access_key') || String(data.get('access_key')).indexOf('WSTAW_') === 0) {
      showStatus('error', 'Formularz nie jest jeszcze skonfigurowany. ' + fallback);
      return;
    }

    // 4. Wysyłka
    var payload = {};
    data.forEach(function (value, key) {
      if (key !== 'botcheck' && key !== 'redirect') payload[key] = typeof value === 'string' ? value.trim() : value;
    });
    payload.subject = 'Zapytanie o sesję: ' + payload.rodzaj_sesji + ' – ' + payload.name;

    setSending(true);
    showStatus('info', 'Wysyłam wiadomość…');

    var controller = 'AbortController' in window ? new AbortController() : null;
    var timeout = setTimeout(function () { if (controller) controller.abort(); }, 15000);

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) {
          if (!res.ok || !json.success) {
            var err = new Error(json.message || 'HTTP ' + res.status);
            err.status = res.status;
            throw err;
          }
          return json;
        });
      })
      .then(function () {
        var name = payload.name ? ', ' + escapeHtml(payload.name) : '';
        showStatus('success', '<strong>Dziękuję' + name + '!</strong> Wiadomość dotarła. Odpiszę na podany adres e-mail zwykle w ciągu 24–48 godzin.');
        form.reset();
        startedAt = Date.now();
      })
      .catch(function (err) {
        var msg;
        if (err.name === 'AbortError') msg = 'Serwer nie odpowiada. Sprawdź połączenie z internetem i spróbuj ponownie.';
        else if (err.status === 429) msg = 'Wysłano zbyt wiele wiadomości w krótkim czasie. Spróbuj ponownie za kilka minut.';
        else if (!navigator.onLine) msg = 'Brak połączenia z internetem. Twoja wiadomość nie została utracona – spróbuj ponownie, gdy połączenie wróci.';
        else msg = 'Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę.';
        showStatus('error', msg + ' ' + fallback);
      })
      .finally(function () {
        clearTimeout(timeout);
        setSending(false);
      });
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();

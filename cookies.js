(() => {
  'use strict';

  const CONSENT_KEY = 'byDavid_cookie_consent_v1';
  const GA_ID = 'G-TYVZKNP1XL';

  const readConsent = () => {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  };

  const writeConsent = (analytics) => {
    const consent = {
      necessary: true,
      analytics: Boolean(analytics),
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    } catch (error) {
      // The site still works if localStorage is blocked.
    }

    if (consent.analytics) loadAnalytics();
    return consent;
  };

  const loadAnalytics = () => {
    if (window.__byDavidGaLoaded || !GA_ID) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    });

    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    });

    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      anonymize_ip: true,
      send_page_view: true
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(script);
    window.__byDavidGaLoaded = true;
  };

  const markup = `
    <div class="cookie-consent" id="cookieConsent" hidden>
      <div class="cookie-backdrop" data-cookie-close></div>
      <section class="cookie-panel" role="dialog" aria-modal="true" aria-labelledby="cookieTitle">
        <button class="cookie-close" type="button" aria-label="Zavrieť nastavenia cookies" data-cookie-close>×</button>
        <div class="cookie-panel-topline">
          <span class="cookie-badge">SÚKROMIE</span>
          <span class="cookie-symbol" aria-hidden="true">✦</span>
        </div>
        <h2 id="cookieTitle">Vyberte si, čo chcete povoliť</h2>
        <p class="cookie-intro">
          Používame nevyhnutné uloženie vašej voľby a voliteľnú analytiku Google Analytics.
          Analytika sa spustí až po vašom súhlase.
        </p>

        <div class="cookie-options">
          <label class="cookie-option cookie-option-locked">
            <span>
              <strong>Nevyhnutné</strong>
              <small>Uloženie vašich preferencií a základné fungovanie webu.</small>
            </span>
            <input type="checkbox" checked disabled aria-label="Nevyhnutné cookies sú vždy aktívne">
            <span class="cookie-toggle" aria-hidden="true"></span>
          </label>
          <label class="cookie-option" for="cookieAnalytics">
            <span>
              <strong>Analytické</strong>
              <small>Google Analytics 4 na anonymné meranie návštevnosti.</small>
            </span>
            <input type="checkbox" id="cookieAnalytics">
            <span class="cookie-toggle" aria-hidden="true"></span>
          </label>
        </div>

        <div class="cookie-actions">
          <button type="button" class="cookie-btn cookie-btn-muted" data-cookie-reject>Nevyhnutné</button>
          <button type="button" class="cookie-btn cookie-btn-outline" data-cookie-settings>Nastaviť</button>
          <button type="button" class="cookie-btn cookie-btn-outline cookie-save-btn" data-cookie-save>Uložiť</button>
          <button type="button" class="cookie-btn cookie-btn-primary" data-cookie-accept>Prijať</button>
        </div>
        <div class="cookie-footer-links">
          <a href="zasady-cookies.html">Zásady cookies</a>
          <a href="ochrana-osobnych-udajov.html">Ochrana osobných údajov</a>
        </div>
      </section>
    </div>
  `;

  const ensureUI = () => {
    if (!document.getElementById('cookieConsent')) {
      document.body.insertAdjacentHTML('beforeend', markup);
    }
    return document.getElementById('cookieConsent');
  };

  const hydrateEmailLinks = () => {
    document.querySelectorAll('[data-email-user][data-email-domain]').forEach((element) => {
      const email = `${element.dataset.emailUser}@${element.dataset.emailDomain}`;
      element.querySelectorAll('.js-email-text').forEach((target) => {
        target.textContent = email;
      });
      if (element.tagName === 'A') element.href = `mailto:${email}`;
    });
  };

  const setVisibility = (visible, settings = false) => {
    const root = ensureUI();
    root.classList.toggle('is-settings', settings);
    root.hidden = !visible;
    document.body.classList.toggle('cookie-lock', visible && settings);
  };

  const openSettings = () => {
    const root = ensureUI();
    const consent = readConsent();
    const checkbox = root.querySelector('#cookieAnalytics');
    if (checkbox) checkbox.checked = Boolean(consent && consent.analytics);
    setVisibility(true, true);
  };

  const closeSettings = () => {
    if (readConsent()) setVisibility(false);
  };

  const saveAndClose = (analytics) => {
    writeConsent(analytics);
    setVisibility(false);
  };

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-open-cookie-settings]');
    if (target) {
      event.preventDefault();
      openSettings();
      return;
    }

    if (event.target.closest('[data-cookie-accept]')) {
      saveAndClose(true);
      return;
    }

    if (event.target.closest('[data-cookie-reject]')) {
      saveAndClose(false);
      return;
    }

    if (event.target.closest('[data-cookie-settings]')) {
      openSettings();
      return;
    }

    if (event.target.closest('[data-cookie-save]')) {
      const checkbox = document.getElementById('cookieAnalytics');
      saveAndClose(Boolean(checkbox && checkbox.checked));
      return;
    }

    if (event.target.closest('[data-cookie-close]')) {
      closeSettings();
    }
  });

  const consent = readConsent();
  if (consent && consent.analytics) loadAnalytics();

  window.addEventListener('DOMContentLoaded', () => {
    hydrateEmailLinks();
    ensureUI();
    if (!consent) setVisibility(true, false);
  });
})();

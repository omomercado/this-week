/*!
 * This Week at Omo — website section for omomercado.com
 * Reads week.json from this folder and renders the weekly lineup into
 * <div id="omo-this-week">…</div>. Whatever is inside that div (the plain-text
 * fallback) stays for search engines that don't run JavaScript.
 * Updated weekly; only week.json and photos/ change.
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var BASE = script ? script.src.replace(/[^/]*$/, '') : 'https://omomercado.github.io/this-week/';
  var VENUE = {
    '@type': 'Place',
    name: 'Omo Mercado',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '259B E Arrow Hwy',
      addressLocality: 'Upland',
      addressRegion: 'CA',
      postalCode: '91786',
      addressCountry: 'US'
    }
  };

  var CSS = [
    '.omo-tw{--tw-bg:#616C63;--tw-fg:#D4D0CB;--tw-line:rgba(212,208,203,.45);',
    "--tw-display:'Druk Condensed','Druk','druk-condensed','druk',Anton,Impact,sans-serif;",
    "--tw-mono:'GT America Mono','gt-america-mono','DM Mono',ui-monospace,monospace;",
    "--tw-serif:'Lydian BT','Lydian',Georgia,serif;",
    'box-sizing:border-box;width:100%;text-align:left;background:var(--tw-bg);color:var(--tw-fg);font-family:var(--tw-mono);padding:104px 32px 112px;-webkit-font-smoothing:antialiased}',
    '.omo-tw *,.omo-tw *::before,.omo-tw *::after{box-sizing:border-box}',
    '.omo-tw p,.omo-tw h2,.omo-tw h3,.omo-tw ul{margin:0;padding:0}',
    '.omo-tw a{color:var(--tw-fg)}',
    '.omo-tw__wrap{position:relative;max-width:1200px;margin:0 auto;display:flex;flex-direction:column;gap:56px}',
    '.omo-tw__age{position:absolute;top:-68px;right:0;font-size:14px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}',
    '.omo-tw__title{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;column-gap:56px;row-gap:8px;font-family:var(--tw-display);font-weight:400;font-size:132px;line-height:.86;letter-spacing:.005em;text-transform:uppercase;text-align:center;color:var(--tw-fg)}',
    '.omo-tw__arrow{width:34px;height:64px;flex:none}',
    '.omo-tw__nav{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap}',
    '.omo-tw__dot{width:12px;height:12px;border-radius:50%;background:var(--tw-fg);flex:none}',
    '.omo-tw__dot--l{margin-right:18px}.omo-tw__dot--r{margin-left:18px}',
    '.omo-tw__tab{height:72px;min-width:104px;padding:0 24px;border-radius:36px;border:2px solid transparent;background:transparent;color:var(--tw-fg);font-family:var(--tw-mono);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;font-weight:400;-webkit-appearance:none;appearance:none}',
    '.omo-tw__tab:focus-visible{outline:2px dashed var(--tw-fg);outline-offset:3px}',
    '.omo-tw__tab[aria-pressed="true"]{border-color:var(--tw-fg);font-weight:600}',
    '.omo-tw__tab b{font-weight:inherit;font-size:17px;letter-spacing:.08em;line-height:1}',
    '.omo-tw__tab span{font-size:13px;letter-spacing:.06em;line-height:1}',
    '.omo-tw__day{display:flex;flex-wrap:wrap;align-items:center;gap:64px}',
    '.omo-tw__photo{position:relative;flex:1 1 520px;min-width:0;aspect-ratio:1/1;border-radius:32px;overflow:hidden;background:#2b302c}',
    '.omo-tw__photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}',
    '.omo-tw__copy{flex:1 1 420px;min-width:0;display:flex;flex-direction:column;gap:26px}',
    '.omo-tw__when{font-size:16px;letter-spacing:.12em;text-transform:uppercase}',
    '.omo-tw__when b{font-weight:600}',
    '.omo-tw__head{font-family:var(--tw-display);font-weight:400;font-size:96px;line-height:.9;letter-spacing:.005em;text-transform:uppercase;color:var(--tw-fg)}',
    '.omo-tw__sub{font-size:20px;font-weight:600;line-height:1.3;letter-spacing:.06em;text-transform:uppercase}',
    '.omo-tw__sub--lydian{font-family:var(--tw-serif);font-weight:400;font-size:34px;line-height:1.1;letter-spacing:0;text-transform:none}',
    '.omo-tw__list{list-style:none;padding-top:22px!important;border-top:1px solid var(--tw-line);display:flex;flex-direction:column;gap:8px;font-size:17px;line-height:1.45;letter-spacing:.06em;text-transform:uppercase}',
    '.omo-tw__list li{margin:0;padding:0}.omo-tw__list li::before{content:none!important}',
    '.omo-tw__list b,.omo-tw__every b{font-weight:600}',
    '.omo-tw__foot{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding-top:22px;border-top:1px solid var(--tw-line)}',
    '.omo-tw__open{display:flex;flex-direction:column;gap:4px}',
    '.omo-tw__open small{font-size:14px;letter-spacing:.12em;text-transform:uppercase}',
    '.omo-tw__big{font-family:var(--tw-display);font-size:44px;line-height:1;text-transform:uppercase}',
    '.omo-tw__callout{text-align:right}',
    '.omo-tw__every{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;column-gap:28px;row-gap:10px;padding-top:28px;border-top:1px solid var(--tw-line);font-size:14px;letter-spacing:.1em;text-transform:uppercase;text-align:center}',
    '.omo-tw__every a{font-weight:600}',
    '@media (max-width:767px){',
    '.omo-tw{padding:64px 16px 72px}',
    '.omo-tw__wrap{gap:36px}',
    '.omo-tw__age{top:-40px;right:0;font-size:11px}',
    '.omo-tw__title{flex-direction:column;gap:10px;font-size:76px}',
    '.omo-tw__arrow{width:20px;height:38px}',
    '.omo-tw__nav{flex-wrap:nowrap;justify-content:space-between;gap:2px}',
    '.omo-tw__dot{width:8px;height:8px}.omo-tw__dot--l,.omo-tw__dot--r{margin:0}',
    '.omo-tw__tab{height:58px;min-width:0;width:62px;padding:0;border-radius:29px}',
    '.omo-tw__tab b{font-size:14px;letter-spacing:.06em}.omo-tw__tab span{font-size:11px;letter-spacing:.04em}',
    '.omo-tw__day{flex-direction:column;align-items:stretch;gap:22px}',
    '.omo-tw__photo{flex:none;width:100%;border-radius:22px}',
    '.omo-tw__copy{flex:none;gap:22px;text-align:center}',
    '.omo-tw__when{font-size:13px;margin-top:6px}',
    '.omo-tw__head{font-size:58px}',
    '.omo-tw__sub{font-size:15px}.omo-tw__sub--lydian{font-size:24px}',
    '.omo-tw__list{padding-top:18px!important;gap:6px;font-size:14px;letter-spacing:.05em}',
    '.omo-tw__foot{gap:16px;padding-top:18px;text-align:left}',
    '.omo-tw__open small{font-size:12px}.omo-tw__big{font-size:32px}',
    '.omo-tw__every{flex-direction:column;gap:8px;padding-top:24px;font-size:12px;line-height:1.5}',
    '.omo-tw__every .omo-tw__sep{display:none}.omo-tw__every a{padding:12px 0}',
    '}'
  ].join('');

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  function pair(p) { // ["Bold part", "rest"] -> <b>Bold</b> rest
    return [el('b', { text: p[0] }), p[1] ? ' ' + p[1] : ''];
  }

  function arrow() {
    var ns = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(ns, 'svg');
    s.setAttribute('class', 'omo-tw__arrow');
    s.setAttribute('viewBox', '0 0 34 64');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '2.5');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    ['M17 2v58', 'M3 46l14 14 14-14'].forEach(function (d) {
      var p = document.createElementNS(ns, 'path'); p.setAttribute('d', d); s.appendChild(p);
    });
    return s;
  }

  function todayLA() {
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    } catch (e) { return new Date().toISOString().slice(0, 10); }
  }

  function pickDefault(days) {
    var t = todayLA();
    for (var i = 0; i < days.length; i++) if (days[i].iso >= t) return i;
    return 0;
  }

  function schema(data) {
    var events = data.days.map(function (d) {
      var ev = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: d.headline + (d.sub && d.subStyle !== 'lydian' ? ' · ' + d.sub : '') + ' at Omo Mercado',
        description: d.description || '',
        startDate: d.start,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: VENUE,
        image: [BASE + d.photo],
        organizer: { '@type': 'Organization', name: 'Omo Mercado', url: 'https://www.omomercado.com' },
        typicalAgeRange: '21-'
      };
      if (d.end) ev.endDate = d.end;
      return ev;
    });
    var old = document.getElementById('omo-tw-schema');
    if (old) old.remove();
    var s = el('script', { type: 'application/ld+json', id: 'omo-tw-schema' });
    s.textContent = JSON.stringify(events);
    document.head.appendChild(s);
  }

  function render(root, data) {
    var days = data.days;
    var current = pickDefault(days);

    var tabs = days.map(function (d, i) {
      var b = el('button', { type: 'button', class: 'omo-tw__tab', 'aria-pressed': 'false', 'aria-label': d.day + ' ' + d.date }, [
        el('b', { text: d.key }), el('span', { text: d.date })
      ]);
      b.addEventListener('click', function () { select(i); });
      return b;
    });

    var img = el('img', { loading: 'lazy', decoding: 'async', width: '1200', height: '1200' });
    var photo = el('div', { class: 'omo-tw__photo' }, [img]);
    var when = el('p', { class: 'omo-tw__when' });
    var head = el('h3', { class: 'omo-tw__head' });
    var sub = el('p', { class: 'omo-tw__sub' });
    var list = el('ul', { class: 'omo-tw__list' });
    var open = el('span', { class: 'omo-tw__big' });
    var callout = el('span', { class: 'omo-tw__big omo-tw__callout' });
    var foot = el('div', { class: 'omo-tw__foot' }, [
      el('div', { class: 'omo-tw__open' }, [el('small', { text: 'Open' }), open]),
      callout
    ]);
    var copy = el('div', { class: 'omo-tw__copy' }, [when, head, sub, list, foot]);
    var article = el('article', { class: 'omo-tw__day', 'aria-live': 'polite' }, [photo, copy]);

    var every = el('div', { class: 'omo-tw__every' });
    (data.everyWeek || []).forEach(function (p, i) {
      if (i) every.appendChild(el('span', { class: 'omo-tw__sep', 'aria-hidden': 'true', text: '·' }));
      every.appendChild(el('span', null, pair(p)));
    });

    var section = el('section', { class: 'omo-tw', 'aria-labelledby': 'omo-tw-title' }, [
      el('div', { class: 'omo-tw__wrap' }, [
        el('p', { class: 'omo-tw__age' }, ['All Events · ', el('b', { text: 'Ages 21+' })]),
        el('h2', { class: 'omo-tw__title', id: 'omo-tw-title' }, [el('span', { text: 'This Week' }), arrow(), el('span', { text: 'At Omo' })]),
        el('nav', { class: 'omo-tw__nav', 'aria-label': 'Days this week · ' + (data.range || '') }, [el('span', { class: 'omo-tw__dot omo-tw__dot--l', 'aria-hidden': 'true' })].concat(tabs, [el('span', { class: 'omo-tw__dot omo-tw__dot--r', 'aria-hidden': 'true' })])),
        article,
        every
      ])
    ]);

    function select(i) {
      current = i;
      var d = days[i];
      tabs.forEach(function (t, j) { t.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      img.src = BASE + d.photo;
      img.alt = d.alt || d.headline;
      img.style.objectPosition = d.focus || '50% 50%';
      when.textContent = '';
      when.appendChild(el('b', { text: d.day }));
      when.appendChild(document.createTextNode(' ' + d.date));
      head.textContent = d.headline;
      sub.textContent = d.sub || '';
      sub.className = 'omo-tw__sub' + (d.subStyle === 'lydian' ? ' omo-tw__sub--lydian' : '');
      sub.style.display = d.sub ? '' : 'none';
      list.textContent = '';
      (d.details || []).forEach(function (p) { list.appendChild(el('li', null, pair(p))); });
      open.textContent = d.open || '';
      callout.textContent = d.callout || '';
      callout.style.display = d.callout ? '' : 'none';
    }

    // preload the other photos so tab switches are instant
    days.forEach(function (d) { var p = new Image(); p.src = BASE + d.photo; });

    root.textContent = '';
    root.appendChild(section);
    select(current);
    schema(data);
  }

  function boot() {
    var root = document.getElementById('omo-this-week');
    if (!root || root.getAttribute('data-ready')) return;
    root.setAttribute('data-ready', '1');

    if (!document.getElementById('omo-tw-css')) {
      var fonts = el('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Anton&family=DM+Mono:wght@400;500&display=swap' });
      document.head.appendChild(fonts);
      var st = el('style', { id: 'omo-tw-css' });
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    var bust = Math.floor(Date.now() / 300000); // refresh at most every 5 min
    fetch(BASE + 'week.json?v=' + bust, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) { render(root, data); })
      .catch(function () { /* keep the plain-text fallback */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  // Squarespace swaps pages without a full reload on some templates
  window.addEventListener('mercury:load', function () { boot(); });
})();

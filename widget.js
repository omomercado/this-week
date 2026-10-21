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

  var DEFAULT_INTRO = "Something's always going at Omo. Run club on Tuesdays, a movie and wine flights on Wednesdays, $10 spritz on Thursdays, and DJs on the decks to close out the week. Here's what's on this week at Upland's neighborhood natural wine bar.";

  var CSS = [
    '.omo-tw{--tw-bg:#616C63;--tw-fg:#D4D0CB;--tw-line:rgba(212,208,203,.45);--tw-gutter:32px;',
    "--tw-display:'Druk Condensed','Druk','druk-condensed','druk',Anton,Impact,sans-serif;",
    "--tw-mono:'SometypeMono','Sometype Mono','GT America Mono','gt-america-mono','DM Mono',ui-monospace,monospace;",
    "--tw-serif:'Lydian BT','Lydian',Georgia,serif;",
    'box-sizing:border-box;width:100%;overflow:hidden;text-align:left;background:var(--tw-bg);color:var(--tw-fg);font-family:var(--tw-mono);padding:96px var(--tw-gutter) 104px;-webkit-font-smoothing:antialiased}',
    '.omo-tw *,.omo-tw *::before,.omo-tw *::after{box-sizing:border-box}',
    '.omo-tw p,.omo-tw h2,.omo-tw h3,.omo-tw ul{margin:0;padding:0}',
    '.omo-tw a{color:var(--tw-fg)}',
    '.omo-tw__wrap{max-width:1200px;margin:0 auto;display:flex;flex-direction:column;gap:56px}',
    // header
    '.omo-tw__header{display:flex;flex-direction:column;align-items:center;gap:28px;text-align:center}',
    '.omo-tw__age{font-size:14px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}',
    '.omo-tw__age b{font-weight:600}',
    '.omo-tw__title{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;column-gap:56px;row-gap:8px;font-family:var(--tw-display);font-weight:400;font-size:132px;line-height:.86;letter-spacing:.005em;text-transform:uppercase;text-align:center;color:var(--tw-fg)}',
    '.omo-tw__arrow{width:34px;height:64px;flex:none}',
    '.omo-tw__intro{max-width:640px;margin:4px auto 0!important;font-size:16px;line-height:1.7;letter-spacing:.02em;text-align:center;color:var(--tw-fg)}',
    // day tabs
    '.omo-tw__nav{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap}',
    '.omo-tw__dot{width:12px;height:12px;border-radius:50%;background:var(--tw-fg);flex:none}',
    '.omo-tw__dot--l{margin-right:18px}.omo-tw__dot--r{margin-left:18px}',
    '.omo-tw__tab{height:72px;min-width:104px;padding:0 24px;border-radius:36px;border:2px solid transparent;background:transparent;color:var(--tw-fg);font-family:var(--tw-mono);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;font-weight:400;-webkit-appearance:none;appearance:none;transition:border-color .2s}',
    '.omo-tw__tab:focus-visible,.omo-tw__pip:focus-visible,.omo-tw__track:focus-visible{outline:2px dashed var(--tw-fg);outline-offset:3px}',
    '.omo-tw__tab[aria-pressed="true"]{border-color:var(--tw-fg);font-weight:600}',
    '.omo-tw__tab b{font-weight:inherit;font-size:17px;letter-spacing:.08em;line-height:1}',
    '.omo-tw__tab span{font-size:13px;letter-spacing:.06em;line-height:1}',
    // swipe track: bleeds to the screen edges so the next day peeks in
    '.omo-tw__track{position:relative;display:flex;gap:32px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;scrollbar-width:none;',
    'margin:0 calc(-1 * var(--tw-bleed,32px));padding:0 var(--tw-bleed,32px);scroll-padding:0 var(--tw-bleed,32px)}',
    '.omo-tw__track::-webkit-scrollbar{display:none}',
    '.omo-tw__card{flex:0 0 clamp(300px,36vw,500px);scroll-snap-align:start;display:flex;flex-direction:column;gap:22px;transition:opacity .3s}',
    '.omo-tw__card[data-current="false"]{opacity:.55}',
    '.omo-tw__photo{position:relative;width:100%;aspect-ratio:1/1;border-radius:28px;overflow:hidden;background:#2b302c}',
    '.omo-tw__photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}',
    '.omo-tw__when{font-size:15px;letter-spacing:.12em;text-transform:uppercase;margin-top:6px!important}',
    '.omo-tw__when b{font-weight:600}',
    '.omo-tw__head{font-family:var(--tw-display);font-weight:400;font-size:68px;line-height:.9;letter-spacing:.005em;text-transform:uppercase;color:var(--tw-fg)}',
    '.omo-tw__sub{font-size:17px;font-weight:600;line-height:1.35;letter-spacing:.06em;text-transform:uppercase}',
    '.omo-tw__sub--lydian{font-family:var(--tw-serif);font-weight:400;font-size:28px;line-height:1.1;letter-spacing:0;text-transform:none}',
    '.omo-tw__list{list-style:none;padding-top:18px!important;border-top:1px solid var(--tw-line);display:flex;flex-direction:column;gap:6px;font-size:15px;line-height:1.45;letter-spacing:.06em;text-transform:uppercase}',
    '.omo-tw__list li{margin:0;padding:0}.omo-tw__list li::before{content:none!important}',
    '.omo-tw__list b,.omo-tw__every b{font-weight:600}',
    '.omo-tw__foot{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;padding-top:18px;border-top:1px solid var(--tw-line)}',
    '.omo-tw__open{display:flex;flex-direction:column;gap:4px}',
    '.omo-tw__open small{font-size:13px;letter-spacing:.12em;text-transform:uppercase}',
    '.omo-tw__big{font-family:var(--tw-display);font-size:38px;line-height:1;text-transform:uppercase}',
    '.omo-tw__callout{text-align:right}',
    // pager pill
    '.omo-tw__pager{align-self:center;display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:999px;background:rgba(212,208,203,.16)}',
    '.omo-tw__pip{width:24px;height:24px;padding:0;border:0;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-appearance:none;appearance:none}',
    '.omo-tw__pip i{display:block;width:8px;height:8px;border-radius:4px;background:var(--tw-fg);opacity:.55;transition:width .25s,opacity .25s}',
    '.omo-tw__pip[aria-current="true"]{width:44px}',
    '.omo-tw__pip[aria-current="true"] i{width:36px;opacity:1}',
    // every week line
    '.omo-tw__every{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;column-gap:28px;row-gap:10px;padding-top:28px;border-top:1px solid var(--tw-line);font-size:14px;letter-spacing:.1em;text-transform:uppercase;text-align:center}',
    '@media (prefers-reduced-motion:reduce){.omo-tw__track{scroll-behavior:auto}.omo-tw *{transition:none!important}}',
    '@media (max-width:767px){',
    '.omo-tw{--tw-gutter:16px;padding-top:56px;padding-bottom:72px}',
    '.omo-tw__wrap{gap:36px}',
    '.omo-tw__header{gap:22px}',
    '.omo-tw__age{font-size:11px}',
    '.omo-tw__title{flex-direction:column;gap:10px;font-size:76px}',
    '.omo-tw__arrow{width:20px;height:38px}',
    '.omo-tw__intro{font-size:14px;line-height:1.65}',
    '.omo-tw__nav{flex-wrap:nowrap;justify-content:space-between;gap:2px}',
    '.omo-tw__dot{width:8px;height:8px}.omo-tw__dot--l,.omo-tw__dot--r{margin:0}',
    '.omo-tw__tab{height:58px;min-width:0;width:62px;padding:0;border-radius:29px}',
    '.omo-tw__tab b{font-size:14px;letter-spacing:.06em}.omo-tw__tab span{font-size:11px;letter-spacing:.04em}',
    '.omo-tw__track{gap:12px}',
    '.omo-tw__card{flex-basis:calc(100% - 32px);gap:18px}',
    '.omo-tw__card[data-current="false"]{opacity:.7}',
    '.omo-tw__photo{border-radius:20px}',
    '.omo-tw__when{font-size:13px}',
    '.omo-tw__head{font-size:52px}',
    '.omo-tw__sub{font-size:14px}.omo-tw__sub--lydian{font-size:22px}',
    '.omo-tw__list{padding-top:14px!important;font-size:13px;letter-spacing:.05em}',
    '.omo-tw__foot{gap:14px;padding-top:14px}',
    '.omo-tw__open small{font-size:11px}.omo-tw__big{font-size:30px}',
    '.omo-tw__every{flex-direction:column;gap:8px;padding-top:24px;font-size:12px;line-height:1.5}',
    '.omo-tw__every .omo-tw__sep{display:none}',
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

  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  function card(d) {
    var img = el('img', {
      src: BASE + d.photo, alt: d.alt || d.headline, loading: 'lazy', decoding: 'async', width: '1200', height: '1200'
    });
    img.style.objectPosition = d.focus || '50% 50%';
    var kids = [
      el('div', { class: 'omo-tw__photo' }, [img]),
      el('p', { class: 'omo-tw__when' }, [el('b', { text: d.day }), ' ' + d.date]),
      el('h3', { class: 'omo-tw__head', text: d.headline })
    ];
    if (d.sub) kids.push(el('p', { class: 'omo-tw__sub' + (d.subStyle === 'lydian' ? ' omo-tw__sub--lydian' : ''), text: d.sub }));
    if (d.details && d.details.length) kids.push(el('ul', { class: 'omo-tw__list' }, d.details.map(function (p) { return el('li', null, pair(p)); })));
    var foot = [el('div', { class: 'omo-tw__open' }, [el('small', { text: 'Open' }), el('span', { class: 'omo-tw__big', text: d.open || '' })])];
    if (d.callout) foot.push(el('span', { class: 'omo-tw__big omo-tw__callout', text: d.callout }));
    kids.push(el('div', { class: 'omo-tw__foot' }, foot));
    return el('article', { class: 'omo-tw__card', 'aria-label': d.day + ' ' + d.date + ': ' + d.headline, 'data-current': 'false' }, kids);
  }

  function render(root, data) {
    var days = data.days;
    var introSrc = root.querySelector('[data-omo-intro]');
    var introText = (introSrc && introSrc.textContent.trim()) || data.intro || DEFAULT_INTRO;
    var current = -1;

    var cards = days.map(card);
    var track = el('div', { class: 'omo-tw__track', role: 'region', 'aria-label': 'This week, swipe for more days', tabindex: '0' }, cards);

    var tabs = days.map(function (d, i) {
      var b = el('button', { type: 'button', class: 'omo-tw__tab', 'aria-pressed': 'false', 'aria-label': d.day + ' ' + d.date }, [
        el('b', { text: d.key }), el('span', { text: d.date })
      ]);
      b.addEventListener('click', function () { go(i, true); });
      return b;
    });

    var pips = days.map(function (d, i) {
      var b = el('button', { type: 'button', class: 'omo-tw__pip', 'aria-label': 'Show ' + d.day }, [el('i')]);
      b.addEventListener('click', function () { go(i, true); });
      return b;
    });

    var every = el('div', { class: 'omo-tw__every' });
    (data.everyWeek || []).forEach(function (p, i) {
      if (i) every.appendChild(el('span', { class: 'omo-tw__sep', 'aria-hidden': 'true', text: '·' }));
      every.appendChild(el('span', null, pair(p)));
    });

    var wrap;
    var section = el('section', { class: 'omo-tw', 'aria-labelledby': 'omo-tw-title' }, [
      wrap = el('div', { class: 'omo-tw__wrap' }, [
        el('header', { class: 'omo-tw__header' }, [
          el('p', { class: 'omo-tw__age' }, ['All Events · ', el('b', { text: 'Ages 21+' })]),
          el('h2', { class: 'omo-tw__title', id: 'omo-tw-title' }, [el('span', { text: 'This Week' }), arrow(), el('span', { text: 'At Omo' })]),
          el('p', { class: 'omo-tw__intro', text: introText })
        ]),
        el('nav', { class: 'omo-tw__nav', 'aria-label': 'Days this week · ' + (data.range || '') }, [el('span', { class: 'omo-tw__dot omo-tw__dot--l', 'aria-hidden': 'true' })].concat(tabs, [el('span', { class: 'omo-tw__dot omo-tw__dot--r', 'aria-hidden': 'true' })])),
        track,
        el('div', { class: 'omo-tw__pager' }, pips),
        every
      ])
    ]);

    function bleed() { // let the swipe row run to the section's edges, wherever Squarespace puts it
      var b = Math.max(0, wrap.getBoundingClientRect().left - section.getBoundingClientRect().left);
      section.style.setProperty('--tw-bleed', b + 'px');
    }

    function padLeft() { return parseFloat(getComputedStyle(track).paddingLeft) || 0; }
    function targetLeft(i) { return cards[i].offsetLeft - padLeft(); }

    function mark(i) {
      if (i === current) return;
      current = i;
      tabs.forEach(function (t, j) { t.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      pips.forEach(function (p, j) { p.setAttribute('aria-current', j === i ? 'true' : 'false'); });
      cards.forEach(function (c, j) { c.setAttribute('data-current', j === i ? 'true' : 'false'); });
    }

    function go(i, smooth) {
      mark(i);
      var left = Math.max(0, Math.min(targetLeft(i), track.scrollWidth - track.clientWidth));
      if (track.scrollTo) track.scrollTo({ left: left, behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
      else track.scrollLeft = left;
    }

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var max = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= max - 2) { // at the end: keep a day that can't scroll further, else the last day
          if (current > -1 && targetLeft(current) >= max - 2) return;
          mark(cards.length - 1); return;
        }
        var best = 0, dist = Infinity;
        cards.forEach(function (c, j) {
          var dd = Math.abs(targetLeft(j) - track.scrollLeft);
          if (dd < dist) { dist = dd; best = j; }
        });
        mark(best);
      });
    }, { passive: true });

    root.textContent = '';
    root.style.cssText = 'padding:0;margin:0;background:none;text-align:left;letter-spacing:normal';
    root.appendChild(section);
    bleed();
    var start = pickDefault(days);
    mark(start);
    requestAnimationFrame(function () { go(start, false); });
    var lastW = window.innerWidth;
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastW) return; // ignore mobile URL-bar resizes
      lastW = window.innerWidth;
      bleed();
      if (current > -1) go(current, false);
    });
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

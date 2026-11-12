(function () {
  'use strict';

  /* ---------- Datos de ejemplo (reemplazar por datos reales) ---------- */
  var PROVIDERS = [
    {
      id: 1, initials: 'CV', name: 'Clínica Vet Ejemplo Centro', cat: 'Veterinaria', meta: 'Veterinaria · 1,2 km',
      rating: '4,8', badge: 'Matrícula verificada', verified: 'Matrícula verificada', bg: '#CFE6E3',
      address: 'Calle [dirección] · 1,2 km', hours: 'Abierto hoy · 8:00 a. m. a 6:00 p. m.',
      services: [
        { name: 'Consulta general', mins: 30, price: 60000 },
        { name: 'Vacunación', mins: 20, price: 45000 },
        { name: 'Control y seguimiento', mins: 20, price: 35000 }
      ]
    },
    {
      id: 2, initials: 'PC', name: 'Peluquería Canina Ejemplo', cat: 'Peluquería', meta: 'Peluquería · 2,0 km',
      rating: '4,9', badge: 'Identidad verificada', verified: 'Identidad verificada', bg: '#FBE3B5',
      address: 'Calle [dirección] · 2,0 km', hours: 'Abierto hoy · 9:00 a. m. a 5:00 p. m.',
      services: [
        { name: 'Baño y corte', mins: 90, price: 70000 },
        { name: 'Baño', mins: 60, price: 45000 },
        { name: 'Corte de uñas', mins: 15, price: 15000 }
      ]
    },
    {
      id: 3, initials: 'GM', name: 'Guardería Mascotas Ejemplo', cat: 'Guardería', meta: 'Guardería · 2,6 km',
      rating: '4,7', badge: 'Identidad verificada', verified: 'Identidad verificada', bg: '#D9E4F5',
      address: 'Calle [dirección] · 2,6 km', hours: 'Abierto hoy · 7:00 a. m. a 7:00 p. m.',
      services: [
        { name: 'Día completo de guardería', mins: 480, price: 40000 },
        { name: 'Medio día de guardería', mins: 240, price: 25000 },
        { name: 'Noche de hospedaje', mins: 720, price: 60000 }
      ]
    },
    {
      id: 4, initials: 'VD', name: 'Veterinario a Domicilio Ejemplo', cat: 'A domicilio', meta: 'A domicilio · cubre tu zona',
      rating: '4,8', badge: 'Matrícula verificada', verified: 'Matrícula verificada', bg: '#E6DDF3',
      address: 'Atiende en tu casa · [zona de cobertura]', hours: 'Disponible hoy · 8:00 a. m. a 6:00 p. m.',
      services: [
        { name: 'Consulta en casa', mins: 45, price: 90000 },
        { name: 'Vacunación en casa', mins: 30, price: 70000 },
        { name: 'Control en casa', mins: 30, price: 60000 }
      ]
    }
  ];

  var CATEGORIES = ['Todos', 'Veterinaria', 'Peluquería', 'Guardería', 'A domicilio'];
  var TIMES = [
    { label: '8:00 a. m.', h: 8, m: 0 }, { label: '9:30 a. m.', h: 9, m: 30 }, { label: '11:00 a. m.', h: 11, m: 0 },
    { label: '2:00 p. m.', h: 14, m: 0 }, { label: '3:30 p. m.', h: 15, m: 30 }, { label: '5:00 p. m.', h: 17, m: 0 }
  ];
  var DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  var DOW_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  /* ---------- Estado ---------- */
  var state = {
    query: '',
    cat: 'Todos',
    svc: 0,
    day: 0,
    time: 1,
    pet: '',
    last: null,
    nextId: 5,
    bookings: [
      { id: 1, time: '9:00 a. m.', service: 'Consulta general', pet: '[Mascota 1] · Perro', status: 'confirmed' },
      { id: 2, time: '10:30 a. m.', service: 'Vacunación', pet: '[Mascota 2] · Gato', status: 'pending' },
      { id: 3, time: '2:00 p. m.', service: 'Control y seguimiento', pet: '[Mascota 3] · Perro', status: 'pending' },
      { id: 4, time: '4:30 p. m.', service: 'Consulta general', pet: '[Mascota 4] · Perro', status: 'confirmed' }
    ]
  };

  /* ---------- Utilidades ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function money(n) {
    return '$ ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  function norm(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function byId(id) {
    for (var i = 0; i < PROVIDERS.length; i++) if (PROVIDERS[i].id === id) return PROVIDERS[i];
    return null;
  }
  function minPrice(p) {
    return Math.min.apply(null, p.services.map(function (s) { return s.price; }));
  }
  function nextDays() {
    var out = [];
    for (var i = 0; i < 5; i++) {
      var d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + i);
      out.push({
        date: d,
        dow: DOW[d.getDay()],
        num: d.getDate(),
        full: DOW_FULL[d.getDay()] + ' ' + d.getDate() + ' de ' + MONTHS[d.getMonth()]
      });
    }
    return out;
  }

  /* ---------- Iconos ---------- */
  var ICONS = {
    paw: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="10" r="2"></circle><circle cx="12" cy="7" r="2"></circle><circle cx="17" cy="10" r="2"></circle><path d="M7.5 17c0-3 2-5 4.5-5s4.5 2 4.5 5c0 2-1.5 2.5-4.5 2.5S7.5 19 7.5 17z"></path></svg>',
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4D6563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>',
    back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#12302F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>',
    star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="#F5B041" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"></path></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B3F3E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>',
    bigcheck: '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>',
    pin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F5C5A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>',
    clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F5C5A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>',
    shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F5C5A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"></path><path d="M9 12l2 2 4-4"></path></svg>'
  };

  /* ---------- Pantallas ---------- */
  function resultsHtml() {
    var q = norm(state.query.trim());
    var list = PROVIDERS.filter(function (p) {
      var okCat = state.cat === 'Todos' || p.cat === state.cat;
      var okQ = !q || norm(p.name + ' ' + p.cat + ' ' + p.services.map(function (s) { return s.name; }).join(' ')).indexOf(q) !== -1;
      return okCat && okQ;
    });
    var count = list.length === 1 ? '1 resultado' : list.length + ' resultados';
    var cards = list.map(function (p) {
      return '<a class="card" href="#/perfil/' + p.id + '">' +
        '<div class="tile" style="background:' + p.bg + '">' + p.initials + '</div>' +
        '<div class="card-body">' +
        '<div class="card-name">' + esc(p.name) + '</div>' +
        '<div class="card-meta">' + esc(p.meta) + '</div>' +
        '<div class="card-line">' + ICONS.star + '<b>' + p.rating + '</b><span class="dot">·</span><b>Desde ' + money(minPrice(p)) + '</b></div>' +
        '<div class="badge">' + esc(p.badge) + '</div>' +
        '</div></a>';
    }).join('');
    return {
      count: count,
      html: list.length ? cards : '<p class="empty">No encontramos resultados. Prueba con otro servicio.</p>'
    };
  }

  function homeScreen() {
    var chips = CATEGORIES.map(function (c) {
      return '<button type="button" class="chip" data-action="cat" data-cat="' + c + '" aria-pressed="' + (c === state.cat) + '">' + c + '</button>';
    }).join('');
    var r = resultsHtml();
    return '<header class="top">' +
      '<div class="brand">' + ICONS.paw + 'Vetapp</div>' +
      '<h1 class="title">Cuidado para tu mascota, a un toque</h1>' +
      '<p class="lead">Veterinarias, peluquerías y guarderías verificadas.</p>' +
      '</header>' +
      '<label class="search">' + ICONS.search +
      '<input type="search" id="q" placeholder="Busca un servicio o una clínica" aria-label="Buscar un servicio o una clínica" value="' + esc(state.query) + '" autocomplete="off"></label>' +
      '<div class="chips" role="group" aria-label="Filtrar por tipo de servicio">' + chips + '</div>' +
      '<div class="section-head"><h2>Disponibles hoy</h2><span class="count" id="count" aria-live="polite">' + r.count + '</span></div>' +
      '<div class="list" id="results">' + r.html + '</div>' +
      '<footer class="foot"><p>Demo con datos de ejemplo.</p><p><a href="#/proveedor">¿Eres proveedor? Ver el panel</a></p></footer>';
  }

  function profileScreen(p) {
    var services = p.services.map(function (s) {
      return '<div class="row"><div><div class="row-name">' + esc(s.name) + '</div><div class="row-sub">' + durLabel(s.mins) + '</div></div>' +
        '<div class="row-price">' + money(s.price) + '</div></div>';
    }).join('');
    var review = '<div class="review"><div class="review-head"><b>Cliente verificado</b><span>Reserva pagada</span></div>' +
      '<p>[Texto de la reseña de un cliente que reservó y pagó por la app]</p></div>';
    return '<div class="hero"><span aria-hidden="true">' + p.initials + '</span>' +
      '<a class="back" href="#/" aria-label="Volver a la búsqueda">' + ICONS.back + '</a></div>' +
      '<div class="profile-head"><h1>' + esc(p.name) + '</h1>' +
      '<div class="meta-row"><span class="verified">' + ICONS.check + esc(p.verified) + '</span>' +
      '<span class="rate">' + ICONS.star + p.rating + '</span><span style="color:var(--muted)">Reseñas de reservas pagadas</span></div>' +
      '<div class="info">' + ICONS.pin + esc(p.address) + '</div>' +
      '<div class="info">' + ICONS.clock + esc(p.hours) + '</div></div>' +
      '<section class="block"><h2>Servicios</h2><div class="rows">' + services + '</div></section>' +
      '<section class="block"><h2>Reseñas</h2><div class="reviews">' + review + review + '</div></section>' +
      '<div class="bar"><div class="bar-from"><small>Desde</small><strong>' + money(minPrice(p)) + '</strong></div>' +
      '<a class="btn" href="#/reserva/' + p.id + '">Reservar cita</a></div>';
  }

  function durLabel(mins) {
    if (mins >= 60 && mins % 60 === 0) return (mins / 60) + (mins === 60 ? ' hora' : ' horas');
    if (mins > 60) return Math.floor(mins / 60) + ' h ' + (mins % 60) + ' min';
    return mins + ' min';
  }

  function bookingScreen(p) {
    var days = nextDays();
    var svc = p.services[state.svc] || p.services[0];
    var day = days[state.day];
    var time = TIMES[state.time];

    var svcHtml = p.services.map(function (s, i) {
      return '<button type="button" class="choice" data-action="svc" data-i="' + i + '" aria-pressed="' + (i === state.svc) + '">' +
        '<span><span class="c-name">' + esc(s.name) + '</span><span class="c-dur">' + durLabel(s.mins) + '</span></span>' +
        '<span class="c-price">' + money(s.price) + '</span></button>';
    }).join('');
    var dayHtml = days.map(function (d, i) {
      return '<button type="button" class="day" data-action="day" data-i="' + i + '" aria-pressed="' + (i === state.day) + '" aria-label="' + esc(d.full) + '">' +
        '<span>' + d.dow + '</span><strong>' + d.num + '</strong></button>';
    }).join('');
    var timeHtml = TIMES.map(function (t, i) {
      return '<button type="button" class="time" data-action="time" data-i="' + i + '" aria-pressed="' + (i === state.time) + '">' + t.label + '</button>';
    }).join('');

    return '<div class="page-head"><a class="back" href="#/perfil/' + p.id + '" aria-label="Volver al perfil">' + ICONS.back + '</a>' +
      '<div><h1>Reservar cita</h1><p>' + esc(p.name) + '</p></div></div>' +
      '<section class="step"><h2>1. Servicio</h2><div class="choices">' + svcHtml + '</div></section>' +
      '<section class="step"><h2>2. Día</h2><div class="days">' + dayHtml + '</div></section>' +
      '<section class="step"><h2>3. Hora</h2><div class="times">' + timeHtml + '</div></section>' +
      '<section class="step field"><h2>4. Tu mascota</h2><label for="pet">Nombre de tu mascota</label>' +
      '<input id="pet" type="text" placeholder="Por ejemplo, Luna" value="' + esc(state.pet) + '" autocomplete="off"></section>' +
      '<div class="summary"><div class="sum-row"><span>Servicio</span><span>' + esc(svc.name) + '</span></div>' +
      '<div class="sum-row"><span>Fecha y hora</span><span>' + esc(day.full) + ', ' + time.label + '</span></div>' +
      '<div class="sum-row sum-total"><span>Total</span><span>' + money(svc.price) + '</span></div></div>' +
      '<p class="note">' + ICONS.shield + 'Pago protegido: la clínica recibe el dinero cuando se presta el servicio. En esta demo no se cobra nada.</p>' +
      '<div class="bar bar-col" style="margin-top:22px"><button type="button" class="btn" data-action="pay" data-id="' + p.id + '">Reservar por ' + money(svc.price) + '</button></div>';
  }

  function confirmScreen() {
    var b = state.last;
    return '<div class="success"><div class="check">' + ICONS.bigcheck + '</div>' +
      '<h1>Reserva enviada</h1><p>La clínica debe confirmarla. En la versión real te avisaríamos por WhatsApp.</p></div>' +
      '<div class="detail">' +
      '<div class="sum-row"><span>Proveedor</span><span>' + esc(b.provider) + '</span></div>' +
      '<div class="sum-row"><span>Servicio</span><span>' + esc(b.service) + '</span></div>' +
      '<div class="sum-row"><span>Fecha y hora</span><span>' + esc(b.when) + '</span></div>' +
      '<div class="sum-row"><span>Mascota</span><span>' + esc(b.pet) + '</span></div>' +
      '<div class="sum-row"><span>Pago</span><span>' + money(b.price) + ', retenido hasta el servicio</span></div></div>' +
      '<p class="note">' + ICONS.shield + 'Si el proveedor no confirma, se devuelve el pago completo.</p>' +
      '<div class="bar bar-col" style="margin-top:32px"><a class="btn" href="#/">Volver al inicio</a>' +
      '<button type="button" class="btn btn-outline" data-action="ics">Agregar al calendario</button>' +
      '<a class="btn btn-outline" href="#/proveedor">Ver como proveedor</a></div>';
  }

  function providerScreen() {
    var pending = state.bookings.filter(function (b) { return b.status === 'pending'; }).length;
    var ok = state.bookings.filter(function (b) { return b.status === 'confirmed'; }).length;
    var labels = { pending: 'Por confirmar', confirmed: 'Confirmada', rejected: 'Rechazada' };
    var items = state.bookings.map(function (b) {
      var actions = b.status === 'pending'
        ? '<div class="actions"><button type="button" class="accept" data-action="accept" data-id="' + b.id + '">Aceptar</button>' +
          '<button type="button" data-action="reject" data-id="' + b.id + '">Rechazar</button></div>'
        : '';
      return '<div class="booking"><div class="booking-top"><div><div class="booking-time">' + esc(b.time) + '</div>' +
        '<div class="booking-svc">' + esc(b.service) + '</div><div class="booking-pet">' + esc(b.pet) + '</div></div>' +
        '<span class="pill pill-' + b.status + '">' + labels[b.status] + '</span></div>' + actions + '</div>';
    }).join('');
    var today = new Date();
    return '<div class="page-head"><a class="back" href="#/" aria-label="Salir del panel">' + ICONS.back + '</a>' +
      '<div><div class="eyebrow">Panel del proveedor</div><h1>Agenda de hoy</h1>' +
      '<p>' + DOW_FULL[today.getDay()] + ' ' + today.getDate() + ' de ' + MONTHS[today.getMonth()] + ' · Clínica Vet Ejemplo Centro</p></div></div>' +
      '<div class="stats"><div class="stat stat-pending"><strong>' + pending + '</strong><span>Por confirmar</span></div>' +
      '<div class="stat stat-ok"><strong>' + ok + '</strong><span>Confirmadas</span></div></div>' +
      '<div class="section-head"><h2>Reservas</h2></div><div class="list">' + items + '</div>';
  }

  /* ---------- Rutas ---------- */
  var main = document.getElementById('screen');

  function render() {
    var parts = location.hash.replace(/^#\/?/, '').split('/');
    var name = parts[0] || 'inicio';
    var p = byId(parseInt(parts[1], 10));
    var html, title = 'Vetapp';

    if (name === 'perfil' && p) {
      html = profileScreen(p); title = p.name + ' · Vetapp';
    } else if (name === 'reserva' && p) {
      html = bookingScreen(p); title = 'Reservar cita · Vetapp';
    } else if (name === 'confirmacion' && state.last) {
      html = confirmScreen(); title = 'Reserva enviada · Vetapp';
    } else if (name === 'proveedor') {
      html = providerScreen(); title = 'Panel del proveedor · Vetapp';
    } else {
      if (name !== 'inicio') { location.replace('#/'); return; }
      html = homeScreen();
    }
    main.innerHTML = html;
    document.title = title;
  }

  function route() {
    render();
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  /* ---------- Acciones ---------- */
  function currentProviderId() {
    return parseInt(location.hash.replace(/^#\/?/, '').split('/')[1], 10);
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function icsStamp(d, h, m) {
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' + pad(h) + pad(m) + '00';
  }

  function downloadIcs() {
    var b = state.last;
    if (!b) return;
    var end = new Date(b.start.getTime() + b.mins * 60000);
    var lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Vetapp//Demo//ES', 'BEGIN:VEVENT',
      'UID:' + Date.now() + '@vetapp.demo',
      'DTSTAMP:' + icsStamp(new Date(), new Date().getHours(), new Date().getMinutes()),
      'DTSTART:' + icsStamp(b.start, b.start.getHours(), b.start.getMinutes()),
      'DTEND:' + icsStamp(end, end.getHours(), end.getMinutes()),
      'SUMMARY:' + b.service + ' - ' + b.pet,
      'LOCATION:' + b.provider,
      'END:VEVENT', 'END:VCALENDAR'
    ];
    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'reserva-vetapp.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.getAttribute('data-action');
    var i = parseInt(el.getAttribute('data-i'), 10);

    if (action === 'cat') {
      state.cat = el.getAttribute('data-cat');
      render();
    } else if (action === 'svc') { state.svc = i; render(); keepFocus('svc', i); }
    else if (action === 'day') { state.day = i; render(); keepFocus('day', i); }
    else if (action === 'time') { state.time = i; render(); keepFocus('time', i); }
    else if (action === 'pay') {
      var p = byId(parseInt(el.getAttribute('data-id'), 10));
      var svc = p.services[state.svc] || p.services[0];
      var day = nextDays()[state.day];
      var t = TIMES[state.time];
      var start = new Date(day.date.getTime());
      start.setHours(t.h, t.m, 0, 0);
      var pet = state.pet.trim() || '[Nombre de la mascota]';
      state.last = {
        provider: p.name, service: svc.name, price: svc.price, mins: svc.mins,
        when: day.full + ', ' + t.label, pet: pet, start: start
      };
      state.bookings.unshift({
        id: state.nextId++, time: day.dow + ' ' + day.num + ', ' + t.label,
        service: svc.name, pet: pet, status: 'pending'
      });
      location.hash = '#/confirmacion';
    } else if (action === 'accept' || action === 'reject') {
      var id = parseInt(el.getAttribute('data-id'), 10);
      state.bookings.forEach(function (b) {
        if (b.id === id) b.status = action === 'accept' ? 'confirmed' : 'rejected';
      });
      render();
    } else if (action === 'ics') {
      downloadIcs();
    }
  });

  // Tras re-renderizar una selección, devuelve el foco al botón para quien usa teclado.
  function keepFocus(kind, i) {
    var btn = main.querySelector('[data-action="' + kind + '"][data-i="' + i + '"]');
    if (btn) btn.focus({ preventScroll: true });
  }

  document.addEventListener('input', function (e) {
    if (e.target.id === 'q') {
      state.query = e.target.value;
      var r = resultsHtml();
      document.getElementById('results').innerHTML = r.html;
      document.getElementById('count').textContent = r.count;
    } else if (e.target.id === 'pet') {
      state.pet = e.target.value;
    }
  });

  window.addEventListener('hashchange', route);
  route();
})();

/* Página */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*    -----------------------  Música    -----------------------  */
(function () {
  //
  if (window.__reproductorIniciado) return;
  window.__reproductorIniciado = true;

  const musica = document.getElementById('musica');
  const nombre = document.getElementById('nombre-cancion');
  const progreso = document.getElementById('progreso');
  const volumen = document.getElementById('volumen');
  const iconoVolumen = document.getElementById('icono-volumen');
  const btnSiguiente = document.getElementById('btn-siguiente');
  const btnAnterior = document.getElementById('btn-anterior');

  // Clonar el botón play
  const playViejo = document.getElementById('btn-play');
  const btnPlay = playViejo.cloneNode(true);
  playViejo.replaceWith(btnPlay);

  // Iconos SVG
  const ICONO_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  const ICONO_PAUSA = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
  const ICONO_VOL = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4z"/></svg>';
  const ICONO_MUTE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16 9l5 6m0-6l-5 6" stroke="currentColor" stroke-width="2" fill="none"/></svg>';

  btnPlay.innerHTML = ICONO_PLAY;
  iconoVolumen.innerHTML = ICONO_VOL;

  // Lista de canciones
  const canciones = [
    { titulo: 'Creep - Radiohead', archivo: 'audio/Creep - Radiohead.mp3' },
    { titulo: 'Gangnam Style (강남스타일) - PSY', archivo: 'audio/Gangnam Style (강남스타일) - PSY.mp3' },
    { titulo: 'How It Ends - DeVotchKa', archivo: 'audio/How It Ends - DeVotchKa.mp3' },
    { titulo: 'Lambada - Original Version 1989 - Kaoma', archivo: 'audio/Lambada - Original Version 1989 - Kaoma.mp3' },
    { titulo: 'Lo Que Siento - Cuco', archivo: 'audio/Lo Que Siento - Cuco.mp3' },
    { titulo: 'On the Sea - Beach House', archivo: 'audio/On the Sea - Beach House.mp3' },
    { titulo: 'Saturn - Sleeping At Last', archivo: 'audio/Saturn - Sleeping At Last.mp3' },
    { titulo: 'La Que Me Gusta (Versión Acústica) - Los Amigos Invisibles', archivo: 'audio/La Que Me Gusta (Versión Acústica) - Los Amigos Invisibles.mp3' },
  ];

  let actual = 0;
  musica.volume = 0.5;

  function cargar(indice) {
    actual = indice;
    musica.src = canciones[actual].archivo;
    nombre.textContent = canciones[actual].titulo;
    progreso.value = 0;
  }

  function reproducir() {
    const promesa = musica.play();
    if (promesa !== undefined) {
      promesa.catch((e) => console.error('No se pudo reproducir:', e));
    }
  }

  // Play / Pausa
  btnPlay.addEventListener('click', () => {
    if (musica.paused) {
      reproducir();
    } else {
      musica.pause();
    }
  });

  // El icono que sigue al audio
  musica.addEventListener('play', () => { btnPlay.innerHTML = ICONO_PAUSA; });
  musica.addEventListener('pause', () => { btnPlay.innerHTML = ICONO_PLAY; });

  musica.addEventListener('error', () => {
    nombre.textContent = 'No se encontró el audio';
    btnPlay.innerHTML = ICONO_PLAY;
    console.error('Error cargando:', musica.src);
  });

  // Siguiente / Anterior
  btnSiguiente.addEventListener('click', () => {
    cargar((actual + 1) % canciones.length);
    reproducir();
  });

  btnAnterior.addEventListener('click', () => {
    cargar((actual - 1 + canciones.length) % canciones.length);
    reproducir();
  });

  // Pasa a la siguiente al terminar
  musica.addEventListener('ended', () => {
    cargar((actual + 1) % canciones.length);
    reproducir();
  });

  // Volumen
  volumen.addEventListener('input', () => {
    musica.muted = false;
    musica.volume = volumen.value;
    iconoVolumen.innerHTML = musica.volume == 0 ? ICONO_MUTE : ICONO_VOL;
  });

  iconoVolumen.addEventListener('click', () => {
    musica.muted = !musica.muted;
    iconoVolumen.innerHTML = musica.muted ? ICONO_MUTE : ICONO_VOL;
  });

  // Barra de progreso
  musica.addEventListener('timeupdate', () => {
    if (musica.duration) {
      progreso.value = (musica.currentTime / musica.duration) * 100;
    }
  });

  progreso.addEventListener('input', () => {
    if (musica.duration) {
      musica.currentTime = (progreso.value / 100) * musica.duration;
    }
  });

  cargar(0);
})();
/*    -----------------------  Termina js de música    -----------------------  */

  /* 1. Estrellas del primer viewport*/
  var cielo = document.querySelector(".estrellas");
  if (cielo) {
    var cantidad = window.innerWidth < 760 ? 60 : 130;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < cantidad; i++) {
      var s = document.createElement("span");
      var tam = Math.random() < 0.85 ? 1 + Math.random() : 2.5 + Math.random();
      s.className = "estrella";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.width = s.style.height = tam + "px";
      s.style.setProperty("--d", (2 + Math.random() * 4).toFixed(2) + "s");
      s.style.setProperty("--r", (-Math.random() * 6).toFixed(2) + "s");
      frag.appendChild(s);
    }
    cielo.appendChild(frag);
  }

  /* 2. Título letra por letra */
  document.querySelectorAll("[data-letras]").forEach(function (el) {
    var texto = el.textContent.trim();
    el.setAttribute("aria-label", texto);
    el.textContent = "";
    var n = 0;
    texto.split(" ").forEach(function (palabra, idx, arr) {
      var p = document.createElement("span");
      p.className = "pal";
      p.setAttribute("aria-hidden", "true");
      Array.from(palabra).forEach(function (ch) {
        var l = document.createElement("span");
        l.className = "let";
        l.style.setProperty("--i", n++);
        l.textContent = ch;
        p.appendChild(l);
      });
      el.appendChild(p);
      if (idx < arr.length - 1) { el.appendChild(document.createTextNode(" ")); n++; }
    });
  });

  /* 3. Puntos de navegación + aparición de paneles*/
  var nav = document.querySelector(".puntos");
  var enlaces = nav ? Array.from(nav.querySelectorAll("a")) : [];
  var paneles = Array.from(document.querySelectorAll(".panel"));

  function marcarActivo(panel) {
    enlaces.forEach(function (a) {
      if (a.getAttribute("href") === "#" + panel.id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    if (nav && panel.dataset.tone) nav.dataset.tone = panel.dataset.tone;
  }

  if ("IntersectionObserver" in window) {
    // El panel que cruza la mitad de la pantalla es el activo
    var ioNav = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) marcarActivo(e.target); });
    }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });

    // Los paneles se marcan como visibles la primera vez que se ven (para la línea de tiempo)
    var ioVer = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); ioVer.unobserve(e.target); }
      });
    }, { threshold: 0.3 });

    paneles.forEach(function (p) { ioNav.observe(p); ioVer.observe(p); });
  } else {
    paneles.forEach(function (p) { p.classList.add("is-visible"); });
    if (paneles[0]) marcarActivo(paneles[0]);
  }

  /* 4. Notas con tarjetas que se voltean */
  document.querySelectorAll(".tarjeta").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var abierta = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", abierta ? "false" : "true");
    });
  });

  /* 5. Contador desde una fecha */
  var contador = document.querySelector(".contador");
  if (contador) {
    var inicio = new Date(contador.dataset.fecha);
    var el = {
      dias: contador.querySelector('[data-unidad="dias"]'),
      horas: contador.querySelector('[data-unidad="horas"]'),
      minutos: contador.querySelector('[data-unidad="minutos"]'),
      segundos: contador.querySelector('[data-unidad="segundos"]')
    };
    var dos = function (n) { return String(n).padStart(2, "0"); };

    var actualizar = function () {
      var t = Math.max(0, Math.floor((Date.now() - inicio.getTime()) / 1000));
      el.dias.textContent = Math.floor(t / 86400);
      el.horas.textContent = dos(Math.floor((t % 86400) / 3600));
      el.minutos.textContent = dos(Math.floor((t % 3600) / 60));
      el.segundos.textContent = dos(t % 60);
    };
    if (!isNaN(inicio.getTime())) {
      actualizar();
      setInterval(actualizar, 1000);
    }
  }

  /* 6. Sorpresa con su lotso y confeti */
  var btn = document.getElementById("btn-sorpresa");
  var premio = document.getElementById("premio");
  var canvas = document.getElementById("confeti");
  var ctx = canvas ? canvas.getContext("2d") : null;
  var piezas = [];
  var animando = false;
  var colores = ["#FFD27A", "#ff8fb8", "#d3467f", "#ffffff", "#6d1230", "#ffb27a", "#8fd6c8"];

  function ajustarLienzo() {
    if (!canvas) return;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function lanzarConfeti(x, y) {
    ajustarLienzo();
    for (var i = 0; i < 170; i++) {
      var ang = Math.random() * Math.PI * 2;
      var vel = 5 + Math.random() * 10;
      piezas.push({
        x: x, y: y,
        vx: Math.cos(ang) * vel,
        vy: Math.sin(ang) * vel - 6,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 5,
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.4,
        color: colores[(Math.random() * colores.length) | 0],
        vida: 0
      });
    }
    if (!animando) { animando = true; requestAnimationFrame(pintar); }
  }

  function pintar() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    piezas = piezas.filter(function (p) { return p.y < window.innerHeight + 30 && p.vida < 260; });
    piezas.forEach(function (p) {
      p.vida++;
      p.vy += 0.22;          // g
      p.vx *= 0.992;         // fr aire
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - p.vida / 260);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (piezas.length) requestAnimationFrame(pintar);
    else { animando = false; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
  }

  window.addEventListener("resize", function () { if (animando) ajustarLienzo(); });

  if (btn && premio) {
    btn.addEventListener("click", function () {
      var r = btn.getBoundingClientRect();
      btn.setAttribute("aria-expanded", "true");
      premio.hidden = false;
      premio.focus({ preventScroll: true });
      if (!reducirMovimiento && ctx) {
        lanzarConfeti(r.left + r.width / 2, r.top + r.height / 2);
        setTimeout(function () { lanzarConfeti(window.innerWidth * 0.25, window.innerHeight * 0.75); }, 350);
        setTimeout(function () { lanzarConfeti(window.innerWidth * 0.75, window.innerHeight * 0.75); }, 600);
      }
    });
  }

  /* 7. V*/
  var visor = document.getElementById("visor");
  if (visor && typeof visor.showModal === "function") {
    var imgVisor = visor.querySelector("img");
    var pie = visor.querySelector("p");

    document.addEventListener("click", function (e) {
      var foto = e.target.closest && e.target.closest("img[data-ampliar]");
      if (!foto) return;
      imgVisor.src = foto.dataset.ampliar || foto.src;
      imgVisor.alt = foto.alt || "";
      pie.textContent = foto.alt || "";
      visor.showModal();
    });
    visor.querySelector(".visor__cerrar").addEventListener("click", function () { visor.close(); });
    visor.addEventListener("click", function (e) { if (e.target === visor) visor.close(); }); // clic afuera
  }
})();

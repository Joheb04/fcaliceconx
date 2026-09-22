/* PPP */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Portada */
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

  /* 2. Título */
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

  /* 3. Navegación */
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
    // Panel..
    var ioNav = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) marcarActivo(e.target); });
    }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });

    // para la línea de tiempo
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

  /* 4. Tarjetas */
  document.querySelectorAll(".tarjeta").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var abierta = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", abierta ? "false" : "true");
    });
  });

  /* 5. Contador */
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

  /* 6. Sorpresa yconfeti */
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
      p.vx *= 0.992;         // aire
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

  /* V */
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
    visor.addEventListener("click", function (e) { if (e.target === visor) visor.close(); }); //c...
  }
})();

/* ════════════════════════════════════════════════════════════════════
   SKIN REJUVENESS BY BOMEDICAL — Dra. Brenda Lopez Carmona
   Base: plantilla de medicina estetica de la skill creador-de-webs.

   Todo el contenido critico (testimonios, FAQs, catalogo de tratamientos,
   precios, horarios) esta hardcodeado en el HTML. Este archivo solo
   anima y da interactividad: si el JS no carga, la web se sigue leyendo
   entera.

   No hay calendario de reserva ni formulario: el unico canal de
   conversion es WhatsApp, y todos los CTAs son enlaces directos a
   wa.me con mensaje precargado. Cambiar el numero es buscar y
   reemplazar "525565081447" en el HTML.
   ════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.from((scope || document).querySelectorAll(sel)); };

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ── NAV ── */
  function initNav() {
    var nav = $("#nav");
    var toggle = $(".nav-toggle");
    var links = $(".nav-links");
    if (!nav) return;

    window.addEventListener("scroll", function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    }, { passive: true });

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("is-open");
        toggle.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open);
        document.body.style.overflow = open ? "hidden" : "";
      });

      $$("a", links).forEach(function (a) {
        a.addEventListener("click", function () {
          links.classList.remove("is-open");
          toggle.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
    }
  }

  /* ── SMOOTH SCROLL ── */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 80;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - navOffset,
        behavior: "smooth"
      });
    });
  }

  /* ── REVEALS ── */
  function initReveals() {
    var items = $$(".reveal");
    if (!items.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -4% 0px" });

    items.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      items.forEach(function (el) {
        if (!el.classList.contains("is-visible") && el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ── ACORDEONES ──
     Un solo motor para los dos acordeones del sitio: las FAQs y el
     catalogo completo de tratamientos. Cada grupo se cierra solo dentro
     de si mismo, asi abrir una categoria del catalogo no cierra una FAQ.
     El contenido ya viene hardcodeado en el HTML (gotcha D.3); el JS
     unicamente anima la apertura. */
  function accordion(itemSel, qSel, aSel) {
    var items = $$(itemSel);
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = $(qSel, item);
      var answer = $(aSel, item);
      if (!btn || !answer) return;

      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");

        items.forEach(function (other) {
          other.classList.remove("is-open");
          var otherA = $(aSel, other);
          var otherBtn = $(qSel, other);
          if (otherA) otherA.style.maxHeight = "0";
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          answer.style.maxHeight = answer.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    // Si la ventana cambia de ancho, el alto del panel abierto cambia.
    window.addEventListener("resize", function () {
      items.forEach(function (item) {
        if (!item.classList.contains("is-open")) return;
        var answer = $(aSel, item);
        if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
      });
    });
  }

  /* ── MITO VS VERDAD ──
     En desktop la tarjeta gira con :hover (CSS). En tactil no hay hover,
     asi que el tap alterna la clase; el teclado usa Enter/Espacio. */
  function initMyths() {
    var touchOnly = window.matchMedia("(hover: none)").matches;
    $$(".myth").forEach(function (myth) {
      var toggle = function () { myth.classList.toggle("is-flipped"); };
      if (touchOnly) myth.addEventListener("click", toggle);
      myth.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
    });
  }

  function initFAQ() { accordion(".faq-item", ".faq-q", ".faq-a"); }
  function initCatalog() { accordion(".cat-item", ".cat-q", ".cat-a"); }

  /* ── PARALLAX SUAVE DEL HERO ──
     Desplazamiento leve (max 40px) de la foto de fondo. Es un movimiento
     funcional, no intrusivo: no se apaga con prefers-reduced-motion
     (Windows lo trae activado por defecto en muchas maquinas, ver
     reference/07-windows-troubleshooting.md). */
  function initHeroParallax() {
    var bg = $(".hero-bg-img");
    if (!bg) return;
    if (window.matchMedia("(max-width: 960px)").matches) return;

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, window.innerHeight) * 0.12;
        bg.style.transform = "translate3d(0," + y.toFixed(1) + "px,0) scale(1.06)";
        ticking = false;
      });
    }, { passive: true });
  }

  /* ── GSAP SCROLL ANIMATIONS ── */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ── HERO ENTRANCE (CSS-driven) ── */
  function initHeroEntrance() {
    var heroText = $(".hero-text");
    var heroImg = $(".hero-img-card");
    if (heroText) heroText.classList.add("hero-animate-in");
    if (heroImg) setTimeout(function () { heroImg.classList.add("hero-animate-in"); }, 300);
  }

  /* ── ANTES/DESPUES: barra deslizable de comparacion ── */
  function initBA() {
    $$("[data-ba]").forEach(function (slider) {
      var before = $(".ba-before", slider);
      var handle = $(".ba-handle", slider);
      if (!before || !handle) return;

      var isDragging = false;

      function setPosition(x) {
        var rect = slider.getBoundingClientRect();
        var pct = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
        before.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
        handle.style.left = pct + "%";
      }

      slider.addEventListener("mousedown", function (e) {
        e.preventDefault();
        isDragging = true;
        setPosition(e.clientX);
      });
      window.addEventListener("mousemove", function (e) {
        if (isDragging) {
          e.preventDefault();
          setPosition(e.clientX);
        }
      });
      window.addEventListener("mouseup", function () { isDragging = false; });

      slider.addEventListener("touchstart", function (e) {
        isDragging = true;
        setPosition(e.touches[0].clientX);
      }, { passive: true });
      slider.addEventListener("touchmove", function (e) {
        if (isDragging) setPosition(e.touches[0].clientX);
      }, { passive: true });
      slider.addEventListener("touchend", function () { isDragging = false; });
    });
  }

  /* ── BOOKING: calendario + slots + envio a WhatsApp ── */
  function initBooking() {
    var daysContainer = $("#booking-days");
    var monthLabel = $("#booking-month-label");
    var prevBtn = $("#booking-prev");
    var nextBtn = $("#booking-next");
    var slotsWrap = $("#booking-slots");
    var formWrap = $("#booking-form-wrap");
    var form = $("#booking-form");
    var successWrap = $("#booking-success");
    var slotsGrid = $("#booking-slots-grid");
    if (!daysContainer || !monthLabel) return;

    var MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    // "Hoy" siempre es el de Ciudad de Mexico, se mire desde donde se mire.
    // Se reserva desde manana: hoy se marca en el calendario pero no se puede elegir.
    var mx = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()).split("-");
    var today = new Date(+mx[0], +mx[1] - 1, +mx[2]);
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear();
    var selectedDate = null;
    var selectedSlot = null;

    // Mismos horarios que la seccion Ubicacion: L-V 10:00-19:00, sab 08:00-14:00, dom cerrado.
    // El ultimo turno es una hora antes del cierre.
    var HOURS = { weekday: [10, 18], saturday: [8, 13] };

    function renderSlots() {
      if (!slotsGrid || !selectedDate) return;
      var range = selectedDate.getDay() === 6 ? HOURS.saturday : HOURS.weekday;
      var html = "";
      for (var h = range[0]; h <= range[1]; h++) {
        html += '<button type="button" class="slot" data-time="' + h + ':00">' + h + ':00</button>';
      }
      slotsGrid.innerHTML = html;
    }

    function render() {
      var first = new Date(currentYear, currentMonth, 1);
      var lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
      var startDay = (first.getDay() + 6) % 7;

      monthLabel.textContent = MONTHS[currentMonth] + " " + currentYear;
      prevBtn.disabled = (currentMonth === today.getMonth() && currentYear === today.getFullYear());

      var html = "";
      for (var i = 0; i < startDay; i++) html += '<button disabled></button>';
      for (var d = 1; d <= lastDay; d++) {
        var date = new Date(currentYear, currentMonth, d);
        var isPast = date <= today;
        var isSunday = date.getDay() === 0;
        var isToday = d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
        var isSelected = selectedDate && d === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
        var cls = [];
        if (isToday) cls.push("is-today");
        if (isSelected) cls.push("is-selected");
        if (isPast || isSunday) {
          html += '<button disabled class="' + cls.join(" ") + '">' + d + '</button>';
        } else {
          html += '<button data-day="' + d + '" class="' + cls.join(" ") + '">' + d + '</button>';
        }
      }
      daysContainer.innerHTML = html;
    }

    prevBtn.addEventListener("click", function () {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      render();
    });
    nextBtn.addEventListener("click", function () {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      render();
    });

    daysContainer.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-day]");
      if (!btn) return;
      selectedDate = new Date(currentYear, currentMonth, parseInt(btn.dataset.day));
      selectedSlot = null;
      render();
      renderSlots();
      // El horario es opcional: el formulario aparece apenas se elige el dia
      if (slotsWrap) slotsWrap.hidden = false;
      if (formWrap) formWrap.hidden = false;
      if (successWrap) successWrap.hidden = true;
    });

    if (slotsWrap) {
      slotsWrap.addEventListener("click", function (e) {
        var btn = e.target.closest(".slot:not(:disabled)");
        if (!btn) return;
        // Tocar el horario elegido lo deselecciona (es opcional)
        var wasSelected = btn.classList.contains("is-selected");
        $$(".slot", slotsWrap).forEach(function (s) { s.classList.remove("is-selected"); });
        selectedSlot = wasSelected ? null : btn.dataset.time;
        if (!wasSelected) btn.classList.add("is-selected");
      });
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var inputs = $$(".booking-input", form);
        var name = inputs[0] ? inputs[0].value.trim() : "";
        if (!name) { inputs[0].focus(); return; }

        var dateStr = selectedDate ? selectedDate.getDate() + "/" + (selectedDate.getMonth()+1) + "/" + selectedDate.getFullYear() : "";

        // Numero y nombre del lead. Si cambia el WhatsApp, cambiarlo tambien en los .html.
        var msg = "Hola Dra. Brenda, soy " + name + ". Quiero agendar una valoración para el " + dateStr + (selectedSlot ? " a las " + selectedSlot : "") + ".";
        var waUrl = "https://wa.me/525565081447?text=" + encodeURIComponent(msg);
        window.open(waUrl, "_blank");

        if (slotsWrap) slotsWrap.hidden = true;
        if (formWrap) formWrap.hidden = true;
        if (successWrap) successWrap.hidden = false;
      });
    }

    render();
  }

  function boot() {
    safe(initNav, "initNav");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initReveals, "initReveals");
    safe(initFAQ, "initFAQ");
    safe(initMyths, "initMyths");
    safe(initCatalog, "initCatalog");
    safe(initBA, "initBA");
    safe(initHeroParallax, "initHeroParallax");
    safe(initBooking, "initBooking");
    safe(initGSAP, "initGSAP");
    safe(initHeroEntrance, "initHeroEntrance");

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

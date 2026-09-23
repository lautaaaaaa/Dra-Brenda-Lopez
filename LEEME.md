# Skin Rejuveness by Bömedical® · Dra. Brenda López Carmona

Sitio estático, sin build y sin dependencias. Se sube tal cual por FTP o arrastrando
la carpeta a Hostinger, Netlify o cualquier hosting estático.

## Qué falta antes de publicar

**Fotos** en `assets/img/`: `hero.jpg` (fondo del hero), `equipo-hero.jpg` (tarjeta
del hero, el equipo completo), `doctor.jpg` (la Dra. Brenda en la sección "Equipo") y
`equipo-1.jpg` a `equipo-4.jpg` (el resto del equipo). Los originales en alta están en
`_originales-no-subir/equipo-sep-2026/`, fuera de la carpeta que se publica.

**Faltan los nombres y cargos del equipo.** En `index.html`, sección `#equipo`, hay un
comentario que explica cómo agregarlos debajo de cada foto.

**Video del consultorio** en `assets/video/instalaciones.mp4` (la doctora presentando
el consultorio), con su portada en `assets/img/instalaciones-poster.jpg`.

**El antes y después ya está**, con fotos reales de la doctora (bótox, peeling,
relleno de labios y rinomodelación) en `assets/img/ba-*.png`, tal cual las pasó
Lautaro, sin retocar. Se muestran con el comparador deslizable de la skill, las
cuatro en una fila. Hay una copia de respaldo de los archivos en
`_originales-no-subir/antes-despues/`.

## Estructura

```
index.html                        Home, 16 secciones
tratamiento-*.html                8 micro-landings, una por tratamiento estrella
styles.css                        Todos los estilos, del home y de las subpáginas
main.js                           Nav, acordeones, reveals, parallax del hero
lib/                              GSAP + ScrollTrigger locales, sin CDN
assets/img/                       Fotos de la doctora + motivo de marca
assets/video/                     Video del consultorio (pendiente)
assets/plastic-esthetic-stock/    Fotos de tratamientos y logo de Doctoralia
.htaccess                         Cache correcto en Hostinger, no borrar
sitemap.xml, robots.txt           SEO
```

## Cosas que se editan seguido

**La promoción del mes.** En `index.html`, buscar el comentario
`<!-- PROMO: editar o eliminar -->`. Ese bloque entero (desde
`<section class="section promo"` hasta su `</section>`) se puede cambiar o borrar
sin tocar nada más.

**El número de WhatsApp.** Buscar y reemplazar `525565081447` en todos los `.html`.

**Los precios.** Están en las tarjetas de tratamientos del home
(`<span class="treatment-card__price">`) y en la ficha lateral de cada subpágina
(`<li><strong>Precio</strong>`).

## Al subir una versión nueva

Cambiar la fecha del cache-buster en los `.html`: buscar `?v=20260903` y poner la
fecha del día. Así los visitantes que ya entraron ven los cambios de una, sin
tener que limpiar caché.

## SEO

- Schema `MedicalBusiness` + `Physician` + `FAQPage` en el home, `MedicalWebPage`
  + `BreadcrumbList` + `FAQPage` en cada subpágina.
- El NAP (nombre, dirección, teléfono) es idéntico en header, footer y schema:
  **San Jerónimo Lídice, Álvaro Obregón, CDMX, C.P. 10200**. Si se cambia en un
  lado hay que cambiarlo en los tres, es justamente el problema que esta web viene
  a resolver.
- Antes de publicar, reemplazar `https://skinrejuveness.com/` por el dominio real
  en los `<link rel="canonical">`, en el schema y en `sitemap.xml`.
- Tarea aparte, fuera de la web: reclamar la ficha de Google Business Profile y
  corregir la alcaldía, que hoy aparece como La Magdalena Contreras.

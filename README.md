# Vetapp: demo web

Demo clicable de Vetapp hecha con HTML, CSS y JavaScript, sin dependencias ni paso de compilación. Funciona abriendo `index.html` o publicada en GitHub Pages.

**Qué incluye:** búsqueda y filtros, perfil del proveedor, reserva (servicio, día, hora y nombre de la mascota), confirmación con descarga al calendario y un panel del proveedor donde las reservas nuevas aparecen para aceptar o rechazar.

**Qué no hace todavía:** no guarda datos al recargar la página, no hay cuentas, no cobra y no envía WhatsApp. Todos los proveedores, precios y calificaciones son de ejemplo.

## Publicar en GitHub Pages

1. Entra a github.com e inicia sesión. Pulsa **New** para crear un repositorio, por ejemplo `vetapp-demo`, público y sin README.
2. En la página del repositorio nuevo pulsa **uploading an existing file** y arrastra el contenido de esta carpeta (`index.html`, `styles.css`, `app.js` y este README). Pulsa **Commit changes**.
3. Ve a **Settings** > **Pages**. En **Build and deployment** elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`. Pulsa **Save**.
4. Espera uno o dos minutos. La dirección queda como `https://TU-USUARIO.github.io/vetapp-demo/`.

Con git en el computador, el equivalente es:

```
git init
git add .
git commit -m "Demo de Vetapp"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/vetapp-demo.git
git push -u origin main
```

Los repositorios públicos de GitHub Pages son visibles para cualquiera que tenga el enlace. Eso está bien para una demo con datos de ejemplo, pero no subas datos reales de clientes ni claves.

## Dónde cambiar los datos de ejemplo

En `app.js`, arriba, la lista `PROVIDERS` tiene los proveedores, servicios y precios. Cámbialos por los de tus primeros aliados para enseñar la demo con casos reales.

## Siguientes pasos para que funcione de verdad

1. Cuentas y base de datos con un servicio como Supabase o Firebase, llamado desde esta misma web.
2. Pagos con una pasarela colombiana. El cobro necesita un servidor pequeño, porque las claves no se pueden poner en una página pública.
3. Recordatorios por WhatsApp con la API de WhatsApp Business.
4. Convertirla en PWA para instalarla en el teléfono desde el navegador.

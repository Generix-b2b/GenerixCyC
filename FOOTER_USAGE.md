# Footer Reutilizable - Guía de Uso

## Descripción
Se ha creado un footer reutilizable que puede ser incluido en múltiples páginas HTML sin necesidad de duplicar código.

## Archivos Creados

### 1. `footer.html`
Contiene la estructura y estilos del footer que será reutilizado en todas las páginas.

### 2. `load-footer.js`
Script JavaScript que carga dinámicamente el contenido de `footer.html` en cualquier página.

## Cómo Usar

### Opción 1: Usando JavaScript (Recomendado - Dinámico)

En cualquier página HTML donde quieras que aparezca el footer:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Página</title>
  <style>
    /* Tus estilos aquí */
  </style>
</head>
<body>

  <!-- Tu contenido aquí -->
  <header>...</header>
  <main>...</main>

  <!-- Contenedor para el footer -->
  <div id="footer-container"></div>

  <!-- Script para cargar el footer -->
  <script src="load-footer.js"></script>

</body>
</html>
```

### Opción 2: Incluyendo directamente el HTML (Estático)

Si prefieres no usar JavaScript, puedes copiar y pegar directamente el contenido de `footer.html` al final de tu página:

```html
<!-- Copiar el contenido del archivo footer.html aquí -->
<footer>
  <!-- ... contenido del footer ... -->
</footer>
```

## Ventajas de usar la Opción 1 (JavaScript)

✅ **Una única fuente de verdad**: Cambios en `footer.html` se reflejan automáticamente en todas las páginas  
✅ **Mantenimiento centralizado**: No necesitas actualizar múltiples archivos  
✅ **Mejor rendimiento**: Los estilos del footer se cargan una sola vez  
✅ **Escalabilidad**: Fácil de agregar a nuevas páginas  

## Ejemplo Completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JSON e-Invoicing</title>
  <style>
    :root {
      --generix-dark: #002333;
      --generix-orange: #F28A48;
      --white: #FFFFFF;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: var(--generix-dark);
    }

    main {
      min-height: calc(100vh - 200px);
      padding: 40px 32px;
    }
  </style>
</head>
<body>

  <header>
    <!-- Tu header aquí -->
  </header>

  <main>
    <!-- Tu contenido aquí -->
  </main>

  <!-- Contenedor del footer -->
  <div id="footer-container"></div>

  <!-- Script para cargar footer -->
  <script src="load-footer.js"></script>

</body>
</html>
```

## Notas Técnicas

- El script `load-footer.js` usa la API `fetch()` para cargar el contenido del footer
- Los estilos del footer están incluidos en `footer.html` para garantizar portabilidad
- El footer es responsive y se adapta a dispositivos móviles
- Requiere que todos los archivos estén en el mismo directorio

## Actualizar el Footer

Para cambiar el contenido o estilos del footer, edita **únicamente** el archivo `footer.html`. Los cambios aparecerán automáticamente en todas las páginas que lo usen.

## Soporte de Navegadores

Funciona en todos los navegadores modernos que soportan:
- `fetch()` API
- `DOMContentLoaded` event
- ES6+

Navegadores soportados: Chrome 42+, Firefox 39+, Safari 10.1+, Edge 14+

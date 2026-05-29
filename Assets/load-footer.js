/**
 * Script para cargar el footer reutilizable en múltiples páginas
 * 
 * Uso en HTML:
 * <div id="footer-container"></div>
 * <script src="load-footer.js"></script>
 */

(function() {
  // Detectar la ruta relativa del footer.html basada en la ubicación del script
  function getFooterPath() {
    // Si el script y footer.html están en el mismo directorio
    return '../footer.html';
  }

  // Cargar el footer cuando el DOM esté listo
  function loadFooter() {
    const footerContainer = document.getElementById('footer-container');
    
    if (!footerContainer) {
      console.warn('No se encontró elemento con id="footer-container"');
      return;
    }

    fetch(getFooterPath())
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al cargar footer: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        footerContainer.innerHTML = html;
      })
      .catch(error => {
        console.error('Error cargando footer:', error);
        footerContainer.innerHTML = '<footer><p>Error al cargar el pie de página</p></footer>';
      });
  }

  // Cargar cuando el documento está listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
  } else {
    loadFooter();
  }
})();

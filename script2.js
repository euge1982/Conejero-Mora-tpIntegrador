// Configuracion Tailwind
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      container: { center: true, padding: '1rem' },
    },
  },
};

// Aplicar tema guardado al cargar la pagina
(function () {
    const saved = localStorage.getItem('theme');   // 'light', 'dark', null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;   // true, false

    const root = document.documentElement;   // <html>
    const label = document.getElementById('theme-label');   // Etiqueta del boton de tema
    
    // Aplica el tema
    if (saved === 'dark' || (!saved && prefersDark)) {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }

    // Marca que el tema ya se aplico (evita parpadeo)
    root.setAttribute('data-theme-loaded', 'true');

    // Actualiza etiqueta del boton
    if (label) label.textContent = root.classList.contains('dark') ? 'Claro' : 'Oscuro';
})();
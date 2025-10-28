<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/**
 * Estilos globales para Notas Rápidas
 * Desarrollado por Jéraldyn Acevedo
 * Progressive Web App para gestión de notas
 */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #FFFFCC;
}

/* Estilos para mejorar la experiencia PWA */
html {
  height: 100%;
}

body {
  height: 100%;
  overflow-x: hidden;
}

/* Mejoras de accesibilidad */
:focus {
  outline: 2px solid #FFD700;
  outline-offset: 2px;
}

/* Estilos para modo standalone (PWA instalada) */
@media (display-mode: standalone) {
  body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

</style>

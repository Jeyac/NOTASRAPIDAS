<template>
    <ClientOnly>
      <template #fallback>
        <!-- Estado de carga mientras el SSR hidrata -->
        <div class="notes-app">
          <header class="header">
            <h1 class="title">Notas rápidas - JA</h1>
            <div class="header-buttons">
              <button class="add-button" disabled style="opacity: 0.5;">
                <span class="plus-icon">+</span>
                Nueva Nota
              </button>
            </div>
          </header>
        <div class="loading-state">
          <div class="empty-icon">Notas</div>
          <p class="empty-text">Cargando...</p>
        </div>
        </div>
      </template>
  
      <!-- Contenido completo del cliente -->
      <div class="notes-app">
        <header class="header">
          <div class="header-content">
            <h1 class="title">Notas rápidas - JA</h1>
            <p class="subtitle">Aplicación de notas simple y eficiente</p>
          </div>
          <div class="header-buttons">
            <button 
              id="install-btn" 
              class="install-button"
              @click="handleInstall"
            >
              Instalar App
            </button>
            <button @click="createNewNote" class="add-button">
              <span class="plus-icon">+</span>
              Nueva nota
            </button>
          </div>
        </header>
  
        <div v-if="!notes || notes.length === 0" class="empty-state">
          <div class="empty-icon">Notas</div>
          <p class="empty-text">No tienes notas aún</p>
          <p class="empty-subtitle">Crea tu primera nota usando el botón de arriba</p>
          <div class="description-box">
            <h3>Descripción</h3>
            <p>Notas Rápidas es una aplicación web progresiva (PWA) que te permite crear, editar y gestionar notas de forma local en tu navegador. Todas tus notas se guardan en tu dispositivo y funcionan sin conexión a internet.</p>
            <h3>Características</h3>
            <ul>
              <li>Funciona completamente offline</li>
              <li>Se puede instalar como aplicación nativa</li>
              <li>Datos privados y seguros en tu dispositivo</li>
              <li>Interfaz simple y rápida</li>
            </ul>
          </div>
        </div>
  
        <div v-else class="notes-grid">
          <div 
            v-for="note in notes" 
            :key="note.id"
            @click="goToNote(note.id)"
            class="note-card"
          >
            <h3 class="note-title">{{ getNoteDisplayTitle(note) }}</h3>
            <p class="note-preview">{{ getPreview(note.content) }}</p>
            <span class="note-date">{{ formatDate(note.updatedAt) }}</span>
            <button 
              @click.stop="confirmDelete(note.id)"
              class="delete-button"
              title="Eliminar nota"
            >
              Eliminar
            </button>
          </div>
        </div>
        
        <!-- Modal de confirmación -->
        <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
          <div class="modal-content" @click.stop>
            <h3>¿Eliminar esta nota?</h3>
            <p>Esta acción no se puede deshacer. La nota será eliminada permanentemente de tu dispositivo.</p>
            <div class="modal-actions">
              <button @click="showDeleteModal = false" class="cancel-btn">Cancelar</button>
              <button @click="performDelete" class="delete-btn">Eliminar</button>
            </div>
          </div>
        </div>
        
        <!-- Créditos -->
        <footer class="credits">
          <p>Desarrollado por Jéraldyn Acevedo</p>
          <p>Aplicación de Notas Rápidas - Progressive Web App</p>
        </footer>
      </div>
    </ClientOnly>
  </template>
  
  <script setup lang="ts">
  import { useNotes } from '../../composables/useNotes'
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const { notes, createNote, deleteNote, formatDate } = useNotes()
  const router = useRouter()
  
  const showDeleteModal = ref(false)
  const noteToDelete = ref<string | null>(null)
  
  // 👉 Manejador de instalación PWA
  const handleInstall = async () => {
    if (typeof window === 'undefined') return
    
    const win = window as any
    
    if (win.deferredPrompt) {
      try {
        const deferredPrompt = win.deferredPrompt
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        console.log('Install result:', outcome)
        win.deferredPrompt = null
        
        const button = document.getElementById('install-btn')
        if (button) {
          button.style.display = 'none'
        }
      } catch (error) {
        console.error('Error durante la instalación:', error)
      }
    } else {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (isMobile) {
        alert('Para instalar:\n\nAndroid: Menú del navegador → "Agregar a pantalla de inicio"\niPhone: Compartir → "Agregar a pantalla de inicio"')
      } else {
        alert('En Chrome/Edge: Usa el ícono de instalación en la barra de direcciones\nO ve a menú → "Instalar Notas Rápidas"')
      }
    }
  }
  
  // Eventos para detectar disponibilidad de instalación
  onMounted(() => {
    const win = window as any
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      if (!win.deferredPrompt) {
        win.deferredPrompt = e
      }
  
      const button = document.getElementById('install-btn')
      if (button) {
        button.classList.add('available')
        button.textContent = 'Instalar'
      }
    })
  
    window.addEventListener('appinstalled', () => {
      if (win.deferredPrompt) {
        win.deferredPrompt = null
      }
      const button = document.getElementById('install-btn')
      if (button) {
        button.style.display = 'none'
      }
    })
  })
  
  const createNewNote = () => {
    const newNote = createNote()
    router.push(`/note/${newNote.id}`)
  }
  
  const goToNote = (id: string) => {
    router.push(`/note/${id}`)
  }
  
  const getPreview = (content: string) => {
    if (!content || content.trim() === '') return 'Sin contenido'
    return content.length > 100 ? content.substring(0, 100) + '...' : content
  }
  
  const getNoteDisplayTitle = (note: any) => {
    if (note.title && note.title !== 'Sin título' && note.title.trim() !== '') {
      return note.title
    }
    if (note.content && note.content.trim() !== '') {
      return note.content.substring(0, 50) + (note.content.length > 50 ? '...' : '')
    }
    return 'Nota sin título'
  }
  
  const confirmDelete = (id: string) => {
    noteToDelete.value = id
    showDeleteModal.value = true
  }
  
  const performDelete = () => {
    if (noteToDelete.value) {
      deleteNote(noteToDelete.value)
      showDeleteModal.value = false
      noteToDelete.value = null
    }
  }
  </script>
  
  <style scoped>
  .notes-app {
    min-height: 100vh;
    background: #FFFFCC;
    padding: 20px;
    font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    background: #FFD700;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .header-buttons {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .header-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }
  
  .subtitle {
    margin: 0;
    font-size: 14px;
    color: #666;
    font-weight: 400;
  }
  
  .install-button {
    padding: 10px 20px;
    background: #FFF;
    border: 2px solid #FFA500;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    opacity: 0.7;
    position: relative;
  }
  
  .install-button.available {
    opacity: 1;
    background: #FFD700;
    border-color: #FFA500;
    font-weight: 600;
  }
  
  .install-button:hover {
    background: #FFFACD;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    opacity: 1;
  }
  
  .install-button.available:hover {
    background: #FFA500;
    color: #FFF;
  }
  
  .add-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #FFF;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .add-button:hover {
    background: #FFFACD;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
  
  .plus-icon {
    font-size: 24px;
    line-height: 1;
  }
  
  .empty-state {
    text-align: center;
    padding: 80px 20px;
  }
  
  .empty-icon {
    font-size: 48px;
    font-weight: 600;
    color: #FFD700;
    margin-bottom: 20px;
  }
  
  .empty-text {
    font-size: 20px;
    font-weight: 600;
    color: #666;
    margin-bottom: 10px;
  }
  
  .empty-subtitle {
    font-size: 16px;
    color: #999;
    margin-bottom: 30px;
  }
  
  .description-box {
    background: #FFFFFF;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
    text-align: left;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .description-box h3 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 16px;
  }
  
  .description-box p {
    margin: 0 0 15px 0;
    color: #666;
    line-height: 1.5;
  }
  
  .description-box ul {
    margin: 0;
    padding-left: 20px;
    color: #666;
  }
  
  .description-box li {
    margin-bottom: 5px;
    line-height: 1.4;
  }
  
  .loading-state {
    text-align: center;
    padding: 100px 20px;
  }
  
  .loading-state .empty-text {
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .note-card {
    position: relative;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-left: 4px solid #FFD700;
  }
  
  .note-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .note-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 10px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .note-preview {
    font-size: 14px;
    color: #666;
    margin: 0 0 10px 0;
    line-height: 1.4;
    min-height: 40px;
  }
  
  .note-date {
    font-size: 12px;
    color: #999;
  }
  
  .delete-button {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #FF4D4D;
    border: none;
    color: #FFF;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    font-weight: 500;
  }
  
  .delete-button:hover {
    opacity: 1;
    background: #FF3333;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: #FFFFFF;
    padding: 30px;
    border-radius: 12px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  
  .modal-content h3 {
    margin: 0 0 10px 0;
    color: #333;
  }
  
  .modal-content p {
    margin: 0 0 20px 0;
    color: #666;
  }
  
  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  
  .modal-actions button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .cancel-btn {
    background: #F0F0F0;
    color: #333;
  }
  
  .cancel-btn:hover {
    background: #E0E0E0;
  }
  
  .delete-btn {
    background: #FF4D4D;
    color: #FFF;
  }
  
  .delete-btn:hover {
    background: #FF3333;
  }
  
  .credits {
    text-align: center;
    margin-top: 40px;
    padding: 20px;
    background: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .credits p {
    margin: 5px 0;
    color: #666;
    font-size: 14px;
  }
  
  .credits p:first-child {
    font-weight: 600;
    color: #333;
  }
  
  @media (max-width: 640px) {
    .notes-grid {
      grid-template-columns: 1fr;
    }
    
    .header {
      flex-direction: column;
      gap: 15px;
      align-items: stretch;
    }
    
    .header-content {
      text-align: center;
    }
    
    .header-buttons {
      flex-direction: column;
      gap: 10px;
    }
    
    .add-button,
    .install-button {
      justify-content: center;
      width: 100%;
    }
  }
  </style>
  
<template>
  <div class="note-editor">
    <header class="editor-header">
      <div class="header-content">
        <button @click="goBack" class="back-button">
          <span>←</span> Volver
        </button>
        <h2 class="page-title">Editar nota</h2>
      </div>
      <button @click="saveNote" class="save-button">
        Guardar
      </button>
    </header>

    <div class="editor-content">
      <div class="editor-info">
        <p class="info-text">Los cambios se guardan automáticamente mientras escribes</p>
      </div>
      
      <input 
        v-model="localTitle"
        @input="updateNote"
        class="title-input"
        placeholder="Título de la nota"
      />
      
      <textarea 
        v-model="localContent"
        @input="updateNote"
        class="content-textarea"
        placeholder="Escribe tu nota aquí..."
      />
      
      <div class="editor-footer">
        <p class="footer-text">Nota guardada localmente en tu dispositivo</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotes } from '../../../composables/useNotes'

const route = useRoute()
const router = useRouter()
const { getNote, updateNote: updateNoteInStore } = useNotes()

const id = computed(() => route.params.id as string)
const note = computed(() => getNote(id.value))

// Initialize with note values
const localTitle = ref('')
const localContent = ref('')

// Initialize once when note is loaded
onMounted(() => {
  if (note.value) {
    localTitle.value = note.value.title === 'Sin título' ? '' : note.value.title
    localContent.value = note.value.content
  }
})

const updateNote = () => {
  if (!note.value) return
  
  updateNoteInStore(id.value, {
    title: localTitle.value || 'Sin título',
    content: localContent.value
  })
}

const saveNote = () => {
  updateNote()
  router.push('/')
}

const goBack = () => {
  updateNote()
  router.push('/')
}

// Auto-save when typing stops
const debounceUpdate = debounce(() => {
  updateNote()
}, 500)

watch([localTitle, localContent], () => {
  debounceUpdate()
})

function debounce(fn: Function, delay: number) {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(null, args), delay)
  }
}
</script>

<style scoped>
.note-editor {
  min-height: 100vh;
  background: #FFFFCC;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #FFD700;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .page-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

.back-button, .save-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #FFF;
  color: #333;
}

.back-button:hover, .save-button:hover {
  background: #FFFACD;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

  .editor-content {
    padding: 30px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .editor-info {
    background: #F8F9FA;
    padding: 10px 15px;
    border-radius: 6px;
    margin-bottom: 20px;
    border-left: 4px solid #FFD700;
  }
  
  .info-text {
    margin: 0;
    font-size: 14px;
    color: #666;
    font-style: italic;
  }

.title-input {
  width: 100%;
  padding: 15px;
  font-size: 24px;
  font-weight: 600;
  border: 2px solid #FFD700;
  border-radius: 8px;
  background: #FFFFFF;
  color: #333;
  margin-bottom: 20px;
  outline: none;
  font-family: inherit;
}

.title-input:focus {
  border-color: #FFA500;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}

.content-textarea {
  width: 100%;
  min-height: 400px;
  padding: 20px;
  font-size: 16px;
  line-height: 1.6;
  border: 2px solid #FFD700;
  border-radius: 8px;
  background: #FFFFFF;
  color: #333;
  resize: vertical;
  outline: none;
  font-family: inherit;
}

  .content-textarea:focus {
    border-color: #FFA500;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }
  
  .editor-footer {
    margin-top: 20px;
    text-align: center;
  }
  
  .footer-text {
    margin: 0;
    font-size: 12px;
    color: #999;
    font-style: italic;
  }

@media (max-width: 640px) {
  .editor-content {
    padding: 20px;
  }
  
  .title-input {
    font-size: 20px;
  }
  
  .content-textarea {
    min-height: 300px;
    font-size: 16px;
  }
}
</style>


/**
 * Composable para gestión de notas
 * Desarrollado por Jéraldyn Acevedo
 * 
 * Este composable maneja todas las operaciones relacionadas con las notas:
 * - Creación, edición y eliminación de notas
 * - Almacenamiento local en localStorage
 * - Formateo de fechas
 * - Compatibilidad con SSR
 */

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'notas-rapidas'

export const useNotes = () => {
  const isClient = typeof window !== 'undefined'
  
  // Use useState for SSR compatibility
  const notes = useState('notes-rapidas', () => [] as Note[])

  /**
   * Carga las notas desde localStorage
   * Solo se ejecuta en el cliente para evitar errores de SSR
   */
  const loadNotes = () => {
    if (isClient) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          notes.value = parsed
        } catch (e) {
          console.error('Error parsing notes:', e)
        }
      }
    }
  }

  /**
   * Guarda las notas en localStorage
   * Solo se ejecuta en el cliente
   */
  const saveNotes = () => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
    }
  }

  /**
   * Crea una nueva nota
   * @returns La nota creada
   */
  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Sin título',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    notes.value.unshift(newNote)
    saveNotes()
    return newNote
  }

  /**
   * Actualiza una nota existente
   * @param id ID de la nota a actualizar
   * @param updates Objeto con los campos a actualizar (sin id)
   */
  const updateNote = (id: string, updates: Omit<Partial<Note>, 'id'>) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      const existingNote = notes.value[index]!
      notes.value[index] = {
        id: existingNote.id,
        title: existingNote.title,
        content: existingNote.content,
        createdAt: existingNote.createdAt,
        ...updates,
        updatedAt: Date.now()
      }
      saveNotes()
    }
  }

  /**
   * Elimina una nota
   * @param id ID de la nota a eliminar
   */
  const deleteNote = (id: string) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value.splice(index, 1)
      saveNotes()
    }
  }

  /**
   * Obtiene una nota por su ID
   * @param id ID de la nota
   * @returns La nota encontrada o undefined
   */
  const getNote = (id: string) => {
    return notes.value.find(note => note.id === id)
  }

  /**
   * Formatea una fecha timestamp a texto legible
   * @param timestamp Timestamp de la fecha
   * @returns String con la fecha formateada
   */
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'Hace un momento'
    if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} minutos`
    if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} horas`
    if (diff < 604800000) return `Hace ${Math.floor(diff / 86400000)} días`
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  // Initialize notes on client side
  if (isClient) {
    loadNotes()
  }

  return {
    notes: readonly(notes) as any,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    formatDate
  }
}


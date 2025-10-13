const messages = {
  timeline: {
    title: "Línea del tiempo",
    subtitle: "Administra tus registros cronológicos",
    filters: {
      title: "Filtros",
      from: "Desde",
      to: "Hasta",
      clearAll: "Limpiar todo",
      search: "Buscar",
      searchPlaceholder: "Busca en tus registros de la línea del tiempo...",
      searching: "Buscando..."
    },
    activity: {
      title: "Actividad Reciente",
      daysAgo: "Hace {count} días",
      addRecord: "Agregar Registro",
      timeDifference: {
        years: "{count, plural, 1 {# año} other {# años}}",
        months: "{count, plural, 1 {# mes} other {# meses}}",
        weeks: "{count, plural, 1 {# semana} other {# semanas}}",
        days: "{count, plural, 1 {# día} other {# días}}",
        sameDay: "Mismo día"
      }
    },
    form: {
      title: "Título",
      description: "Descripción",
      category: "Categoría",
      date: "Fecha",
      titlePlaceholder: "Ingresa el título del registro",
      descriptionPlaceholder: "Descripción breve",
      categoryPlaceholder: "Selecciona una categoría",
      addCategory: "Agregar categoría",
      newCategory: "Nueva categoría",
      color: "Color",
      saveCategory: "Guardar categoría",
      addRecord: "Agregar registro",
      confirmDeleteTitle: "¿Estás seguro?",
      confirmDeleteDescription: "Esta acción no se puede deshacer. Esto eliminará permanentemente tu registro.",
      errors: {
        invalidId: "Invalid ID",
        idRequired: "ID is required",
        titleRequired: "Title is required",
        categoryRequired: "Category is required",
        dateInvalid: "Invalid date",
        serverError: "Server error"
      }
    },
    categories: {
      Education: "Educación",
      Entertainment: "Entretenimiento",
      Finance: "Finanzas",
      Food: "Comida",
      Health: "Salud",
      Home: "Hogar",
      Personal: "Personal",
      Shopping: "Compras",
      Social: "Social",
      Transport: "Transporte",
      Work: "Trabajo"
    },
    emptyState:  {
      title: "Your timeline awaits",
      description: "Start documenting your journey! Create your first chronological record to begin building your personal timeline.",
      createFirstRecord: "Create First Record",
      tip: "💡 Tip: Records can include meetings, milestones, learnings, or any moment worth remembering",
      ctaText: "Create First Record"
    }
  },
  forms: {
    add: {
      header: "Agregar Nuevo {item}",
      subheader: "Completa los detalles abajo para agregar un nuevo {item}.",
      ctaText: "Agregar {item}",
      ctaLoadingText: "Agregando {item}...",
    },
    edit: {
      header: "Editar {item}",
      subheader: "Haz cambios en los detalles de tu {item} y guarda.",
      ctaText: "Guardar cambios",
      ctaLoadingText: "Guardando cambios..."
    },
    delete: {
      header: "¿Estás absolutamente seguro?",
      subheader: "Esta acción no se puede deshacer. Esto eliminará permanentemente tu {item}.",
      ctaText: "Sí, eliminar {item}",
      ctaLoadingText: "Eliminando {item}...",
      ctaLoadingTextNoItem: "Eliminando..."
    },
    search: {
      placeholder: "Buscar"
    },
    loading: "Cargando...",
    error: "Ocurrió un error. Por favor intenta de nuevo.",
    noData: "No hay datos disponibles."
  },
  common: {
    yes: "Sí",
    no: "No",
    edit: "Editar",
    delete: "Eliminar",
    confirm: "Confirmar",
    cancel: "Cancelar",
    close: "Cerrar",
    record: "Registro",
    continue: "Continuar"
  },
  datepicker: {
    pickDate: "Selecciona una fecha",
  }
}

export default messages;
const messages = {
  timeline: {
    title: "Timeline",
    subtitle: "Manage your chronological records",
    filters: {
      title: "Filters",
      from: "From",
      to: "To",
      clearAll: "Clear all",
      search: "Search",
      searchPlaceholder: "Search your timeline records...",
      searching: "Searching..."
    },
    activity: {
      title: "Recent Activity",
      daysAgo: "{count} days",
      addRecord: "Add Record",
      timeDifference: {
        years: "{count, plural, =1 {# year} other {# years}}",
        months: "{count, plural, =1 {# month} other {# months}}",
        weeks: "{count, plural, =1 {# week} other {# weeks}}",
        days: "{count, plural, =1 {# day} other {# days}}",
        sameDay: "Same day"
      }
    },
    form: {
      title: "Title",
      description: "Description",
      category: "Category",
      date: "Date",
      titlePlaceholder: "Enter record title",
      descriptionPlaceholder: "Brief description",
      categoryPlaceholder: "Select a category",
      addCategory: "Add Category",
      newCategory: "New Category",
      color: "Color",
      saveCategory: "Save Category",
      addRecord: "Add Record",
      confirmDeleteTitle: "Are you sure?",
      confirmDeleteDescription: "This action cannot be undone. This will permanently delete your record.",
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
      Education: "Education",
      Entertainment: "Entertainment",
      Finance: "Finance",
      Food: "Food",
      Health: "Health",
      Home: "Home",
      Personal: "Personal",
      Shopping: "Shopping",
      Social: "Social",
      Transport: "Transport",
      Work: "Work"
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
      header: "Add New {item}",
      subheader: "Fill in the details below to add a new {item}.",
      ctaText: "Add {item}",
      ctaLoadingText: "Adding {item}..."
    },
    edit: {
      header: "Edit {item}",
      subheader: "Make changes to your {item} details and save.",
      ctaText: "Update Changes",
      ctaLoadingText: "Updating {item} ..."
    },
    delete: {
      header: "Are you absolutely sure?",
      subheader: "This action cannot be undone. This will permanently delete your {item}.",
      ctaText: "Yes, delete {item}",
      ctaLoadingText: "Deleting {item}...",
      ctaLoadingTextNoItem: "Deleting..."
    },
    search: {
      placeholder: "Search..."
    },
    loading: "Loading...",
    error: "An error occurred. Please try again.",
    noData: "No data available."
  },
  common: {
    yes: "Yes",
    no: "No",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    cancel: "Cancel",
    close: "Close",
    record: "Record",
    continue: "Continue"
  },
  datepicker: {
    pickDate: "Pick a date",
  }
}

export default messages;
function formatDate(date){
  return date.toLocaleDateString('id', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second:'numeric'})
}

module.exports = formatDate
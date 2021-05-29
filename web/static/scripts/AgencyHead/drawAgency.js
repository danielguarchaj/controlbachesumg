const generatedLoansTable = document.getElementById('draw-agency')


const fetchAgencies = async () => {
    try {
      const { data } = await http.get('agencies/')
      drawTable(data)
    } catch (error) {
      console.error(error)
    }
  } 

  const drawTable = agencies => {
    generatedLoansTable.innerHTML = agencies.reduce((html, agency) => {
        return html += `
        <option>Seleccione una opcion...</option>
        <option value="${agency.id}">${agency.name}</option>
        `
    }, '')
  }
  

  document.addEventListener('DOMContentLoaded', () => {
    fetchAgencies()
  })
const generatedLoansTable = document.getElementById('client-single')


const fetchClients = async () => {
    try {
      const { data } = await http.get('clients/')
      drawTable(data)
    } catch (error) {
      console.error(error)
    }
  } 

  const drawTable = clients => {
    generatedLoansTable.innerHTML = clients.reduce((html, client) => {
        return html += `
        <option value="${client.id}">${client.first_name} ${client.last_name}</option>
        `
    }, '')
  }
  
const Calculating = () => {
  let x = document.getElementById("monto")
  let interes = x.value * 0.155;
  let total = Number(x.value) + Number(interes)
  document.getElementById("interes").innerHTML = `
  <div class="col-md-6">
    <div class="form-group row">
      <label class="col-sm-3 col-form-label">Interes</label>
      <div class="col-sm-9" id="interes">
      <input value="${interes}" type="number" step="0.01" min="0" max="10" class="form-control" disabled/> 
      </div>
    </div>
  </div>
  <div class="col-md-6">
    <div class="form-group row">
      <label class="col-sm-3 col-form-label">Monto a Cobrar</label>
      <div class="col-sm-9">
        <input value="${total}" type="number" step="0.01" min="0" max="10" class="form-control" disabled/>
      </div>
    </div>
  </div>
  `
}

  document.addEventListener('DOMContentLoaded', () => {
    fetchClients()
    $('#client-single').select2()
  })
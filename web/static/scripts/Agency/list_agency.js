const fetchAgencies = async () => {
    try {
      const { data } = await http.get('agencies/')
      drawTable(data)
    } catch (error) {
      console.error(error)
    }
}

  const drawTable = (data) => {
    var caso = ''
    for (const d of data) {
        caso += `
        <tr class="text-center">
            <td data-label="No.">${d.id}</td>
            <td data-label="Nombre">${d.name}</td>
            <td data-label="Direccion">${d.address ? d.address : ''}</td>
            <td data-label="Ciudad">${d.city ? d.city : ''}</td>
            <td data-label="Telefono">${d.phone_number ? d.phone_number : ''}</td>
            <td data-label="Correo">${d.email ? d.email : ''}</td>
            <td data-label="Acciones">
            <a class="btn btn-outline-success btn-sm" data-toggle="tooltip" data-placement="top" title="Editar" href="/agency-edit/${d.id}/"><i class="mdi mdi-pencil"></i></a>
            <button class="btn btn-outline-danger btn-sm" data-toggle="tooltip" data-placement="top" title="Eliminar" onclick="deleteAgency(${d.id})"><i class="mdi mdi-delete"></i></button>
            </td>
        </tr>
        `
    }
    document.getElementById('agenciesTableBody').innerHTML = caso
    $('#agenciesTable').DataTable()
 
}  
 
  document.addEventListener('DOMContentLoaded', () => {
    fetchAgencies()
  })
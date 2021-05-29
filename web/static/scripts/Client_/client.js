const fetchClient = async () => {
    try {
      const { data } = await http.get('clients/')
      drawTable(data)
    } catch (error) {
      console.error(error)
    }
}


  const drawTable = (data) => {
    var datos = ''
    for (const client of data) {
        let deleteButton = '<button class="btn btn-outline-danger btn-sm" data-toggle="tooltip" data-placement="top" title="Eliminar" onclick="deleteCustomer(${client.id})"><i class="mdi mdi-delete"></i></button>'
        userType === 3 ? deleteButton = '' : false
        datos += `
            <tr class="text-center">
                <td data-label="Foto" class="py-1">
                    <img src=${client.picture} />
                </td>
                <td data-label="Nombres">${client.first_name ? client.first_name : ''}</td>
                <td data-label="Apellidos">${client.last_name ? client.last_name : ''}</td>
                <td data-label="Domicilio">${client.living_municipality ? client.living_municipality : ''}</td>
                <td data-label="Telefono">${client.phone_number ? client.phone_number : ''}</td>
                <td data-label="Negocio">${client.business_name ? client.business_name : ''}</td>
                <td data-label="Acciones">
                <a class="btn btn-outline-info btn-sm" data-toggle="tooltip" data-placement="top" title="Ver" href="/customer-view/${client.id}/"><i class="mdi mdi-eye"></i></a>
                <a class="btn btn-outline-success btn-sm" data-toggle="tooltip" data-placement="top" title="Editar" href="/customer-edit/${client.id}/"><i class="mdi mdi-pencil"></i></a>
                ${deleteButton}
                </td>
            </tr>
        `
    }
    document.getElementById('clientsTableBody').innerHTML = datos
    $('#clientsTable').DataTable()
 
}  

  document.addEventListener('DOMContentLoaded', () => {
    fetchClient()
  })
const addCustomer = () => {
  showAlert ('warning-message-and-cancel', {title: 'Confirmacion', text: 'Esta seguro de agregar este cliente?'})
  $('.swal-button--confirm').click(async () => {
      const data = buildRequestFormData('customer-data')
      try {
          const {status} = await request({url: `clients/`, method: 'post', data})
          if( status == 201){
              showAlert('success-message', {title: 'Correcto!', text: 'Tus datos han sido guardados correctamente!'})
              location.href='/customer-list'
          }else {
            showAlert('error-message', {title: 'Error!', text: 'No se han guardado los datos!'})
          }

      } catch (error) {
          console.error(error)
          showAlert('error-message', {title: 'Error!', text: 'No se han guardado los datos!'})
      }
  })

}


const editCustomer = () => {
  showAlert ('warning-message-and-cancel', {title: 'Confirmacion', text: 'Esta seguro de editar esta agencia'})
  $('.swal-button--confirm').click(async () => {
      const customerPk = getUrlParameter()
      const data = buildRequestFormData('customer-edit-data')
      try {
          const {status} = await request({url: `clients/${customerPk}/`, method: 'patch', data})
          if( status == 200){
              showAlert('success-message', {title: 'Correcto!', text: 'Tus datos han sido editados correctamente!'})
              location.href='/customer-list'
          }

      } catch (error) {
          console.error(error)
          showAlert('error-message', {title: 'Error!', text: 'No se han guardado los datos!'})
      }
  })
}

const deleteCustomer = customerPk => {
  showAlert ('warning-message-and-cancel', {title: 'Confirmacion', text: 'Esta seguro de eliminar este cliente'})
  $('.swal-button--confirm').click(async () => {
      try {
          const {status} = await request({url: `clients/${customerPk}/`, method: 'patch', data: {deleted: true}})
          if( status == 200){
              showAlert('success-message', {title: 'Correcto!', text: 'Cliente eliminado correctamente!'})
              location.href='/customer-list'
          }

      } catch (error) {
          console.error(error)
          showAlert('error-message', {title: 'Error!', text: 'No se ha eliminado el cliente!'})
      }
  })
}
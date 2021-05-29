const addCredit = () => {
    showAlert ('warning-message-and-cancel', {title: 'Confirmacion', text: 'Desea agregar la solicitud de credito?'})
    $('.swal-button--confirm').click(async () => {
        const data = buildRequestData('credit-data')
        try {
            const {status} = await request({url: `loans/`, method: 'post', data})
            if( status == 201){
                showAlert('success-message', {title: 'Correcto!', text: 'Tus datos han sido guardados correctamente!'})
                location.href='/unapproved-credits-list/'
            }
  
        } catch (error) {
            console.error(error)
            showAlert('error-message', {title: 'Error!', text: 'No se han guardado los datos!'})
        }
    })
  
  }
  
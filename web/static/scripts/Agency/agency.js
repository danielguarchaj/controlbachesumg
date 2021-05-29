const addAgency = () => {
    showAlert ('warning-message-and-cancel', {title: 'Confirmacion', text: 'Esta seguro de agregar esta agencia?'})
    $('.swal-button--confirm').click(async () => {
        const data = buildRequestData('agency-data')
        try {
            const {status} = await request({url: `agencies/`, method: 'post', data})
            if( status == 201){
                showAlert('success-message', {title: 'Correcto!', text: 'Tus datos han sido guardados correctamente!'})
                location.href='/agency-list'
            }

        } catch (error) {
            console.error(error)
            showAlert('error-message', {title: 'Error!', text: 'No se han guardado los datos!'})
        }
    })

}

const editAgency = () => {
    showAlert ('warning-message-and-cancel', {title: 'Confirmacion', text: 'Esta seguro de editar esta agencia'})
    $('.swal-button--confirm').click(async () => {
        const agencyPk = getUrlParameter()
        const data = buildRequestData('agency-edit-data')
        try {
            const {status} = await request({url: `agencies/${agencyPk}/`, method: 'patch', data})
            if( status == 200){
                showAlert('success-message', {title: 'Correcto!', text: 'Tus datos han sido editados correctamente!'})
                location.href='/agency-list'
            }

        } catch (error) {
            console.error(error)
            showAlert('error-message', {title: 'Error!', text: 'No se han guardado los datos!'})
        }
    })
}

const deleteAgency = agencyPk => {
    showAlert ('warning-message-and-cancel', {title: 'Confirmacion', text: 'Esta seguro de eliminar esta agencia'})
    $('.swal-button--confirm').click(async () => {
        try {
            const {status} = await request({url: `agencies/${agencyPk}/`, method: 'patch', data: {deleted: true}})
            if( status == 200){
                showAlert('success-message', {title: 'Correcto!', text: 'Agencia eliminada correctamente!'})
                location.href='/agency-list'
            }

        } catch (error) {
            console.error(error)
            showAlert('error-message', {title: 'Error!', text: 'No se ha eliminado la agencia!'})
        }
    })
}
const amount = document.getElementById('amount')

const updateLoan = status => {
    const messages = getMessages(status)
    if (amount.value == '' && !status) {
        showAlert('error-message', {title: 'Error', text: 'Ingrese un monto valido'})
        return
    }
    showAlert('warning-message-and-cancel', {title: messages.title, text: messages.confirm})
    $('.swal-button--confirm').click( async () => {
        let data = {}
        let url = ''
        let method = ''
        let status2 = status
        if (status && status != 0) {
            if (status == 4) status = 2
            data['status'] = status
            data['pk'] = getUrlParameter()
            url = `update-loan/`
            method = 'post'
        }
        else {
            if (status == 0) data = {deleted: true}
            else data = buildRequestData('loan-data')
            url = `loans/${getUrlParameter()}/`
            method = 'patch'
        }
        try {
            const {status} = await request({url, data, method})
            if (status === 200) {
                showAlert('success-message', {title: 'Correcto', text: messages.success})
                redirect(status2)
            }
        } catch (error) {
            showAlert('error-message', {title: 'Error', text: messages.error})
            console.log(error)
        }
    })
}

const getMessages = status => {
    const messages = {}
    switch (status) {
        case 0:
            messages['confirm'] = 'Esta seguro que desea eliminar este credito?'
            messages['error'] = 'No se ha podido eliminar este credito, intente nuevamente'
            messages['success'] = 'Credito eliminado con exito'
            messages['title'] = 'Eliminar credito'
            break
        case 2:
            messages['confirm'] = 'Esta seguro que desea aprobar este credito?'
            messages['error'] = 'No se ha podido aprobar este credito, intente nuevamente'
            messages['success'] = 'Credito aprobado con exito'
            messages['title'] = 'Aprobar credito'
            break
        case 3:
            messages['confirm'] = 'Esta seguro que desea rechazar este credito?'
            messages['error'] = 'No se ha podido rechazar este credito, intente nuevamente'
            messages['success'] = 'Credito rechazado con exito'
            messages['title'] = 'Rechazar credito'
            break
        case 4:
            messages['confirm'] = 'Esta seguro que desea desbloquear este credito?'
            messages['error'] = 'No se ha podido desbloquear este credito, intente nuevamente'
            messages['success'] = 'Credito desbloqueado con exito'
            messages['title'] = 'Desbloquear credito'
            break
        default:
            messages['confirm'] = 'Esta seguro que desea modificar el monto de este credito?'
            messages['error'] = 'No se ha podido modificar el monto del credito, intente nuevamente'
            messages['success'] = 'Monto modificado con exito'
            messages['title'] = 'Modificar monto'
            break
    }
    return messages
}

const redirect = status => {
    switch (status) {
        case 0:
            location.href = `/unapproved-credits-list/`
            break
        case 2:
            location.href = `/approved-credit-list/`
            break
        case 3:
            location.href = `/rejected-credit-list/`
            break
        case 4:
            location.href = `/blocked-credit-list/`
            break
        default:
            break
    }
}
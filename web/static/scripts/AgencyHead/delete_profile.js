const deleteProfile =  (profilePk, userType)  => {
    showAlert ('warning-message-and-cancel', {title: 'Confirmacion', text: 'Esta seguro de eliminar este usuario'})
    $('.swal-button--confirm').click(async () => {
        try {
            const {status} = await request({url: `profiles/${profilePk}/`, method: 'patch', data: {deleted: true}})

            if( status == 200){
                showAlert('success-message', {title: 'Correcto!', text: 'Usuario eliminada correctamente!'})
                if (userType == 2) 
                    location.href = '/agency-head-list/'
                else if (userType == 3)
                    location.href = '/adviser-list/'
            }

        } catch (error) {
            console.error(error)
            showAlert('error-message', {title: 'Error!', text: 'No se ha eliminado la agencia!'})
        }
    })
}


const addProfile = userType => {
    showAlert ('warning-message-and-cancel', {title: 'Confirmacion', text: 'Esta seguro de agregar este usuario?'})
    $('.swal-button--confirm').click(async () => {
        const data = buildRequestData('user-data')
        try {
            const {data: new_user} = await request({url: `users/`, method: 'post', data})
            const {data: newUserProfile} = await http('users/' + new_user.id)

            const data_profile = buildRequestFormData('profile-data')
            data_profile.append('position', userType)
            const {status} = await request({url: `profiles/${newUserProfile.profile.id}/`, method: 'patch', data: data_profile})
            if( status == 200){
                showAlert('success-message', {title: 'Correcto!', text: 'Tus datos han sido guardados correctamente!'})
                if (userType == 2) 
                    location.href = '/agency-head-list/'
                else if (userType == 3)
                    location.href = '/adviser-list/'
            }
  
        } catch (error) {
            console.error(error)
            showAlert('error-message', {title: 'Error!', text: 'No se han guardado los datos!'})
        }
    })
  
  }
  
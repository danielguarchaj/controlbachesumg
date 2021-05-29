const editProfile = (profileId, userType) => {
    showAlert ('warning-message-and-cancel', {title: 'Confirmacion', text: 'Esta seguro de editar este usuario?'})
    $('.swal-button--confirm').click(async () => {
        const data = buildRequestData('user-data')
        try {
            
            const data_profile = buildRequestFormData('profile-data')
            for (var pair of data_profile.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }
            const responseProfile = await request({url: `profiles/${profileId}/`, method: 'patch', data: data_profile})
            const responseUser = await request({url: `users/${getUrlParameter()}/`, method: 'patch', data})
            if( responseUser.status == 200){
                showAlert('success-message', {title: 'Correcto!', text: 'Tus datos han sido editados correctamente!'})
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
  
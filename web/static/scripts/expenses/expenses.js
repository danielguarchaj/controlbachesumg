const amount = document.getElementById('amount')
const description = document.getElementById('description')

const addExpense = expenseId => {
    let text = ''
    if (amount.value == '') {
        text += `* Ingrese un monto valido \n`
    }
    if (description.value == '') {
        text += `* Ingrese una descripcion valida \n`
    }

    if (text !== '') {
        showAlert('error-message', {title: 'Error', text})
        return
    }

    const data = {
        amount: amount.value,
        description: description.value
    }

    let url = `expenses/${expenseId ? expenseId + '/' : ''}`
    let method = `${expenseId ? 'patch': 'post'}`

    showAlert('warning-message-and-cancel', {title: `${expenseId ? 'Editar' : 'Agregar'} Gasto`, text: `Esta seguro que desea ${expenseId ? 'editar' : 'agregar'} este gasto?`})
    $('.swal-button--confirm').click( async () => {
        try {
            const {status} = await request({method, url, data})
            if (status == 200 || status == 201) {
                showAlert('success-message', {title: 'Correcto', text: `Gasto ${expenseId ? 'editado' : 'agregado'} con exito`})
                location.reload()
            }
        } catch (error) {
            console.log(error)
            showAlert('error-message', {title: 'Error', text: `No se pudo ${expenseId ? 'editar' : 'agregar'} el gasto, intente nuevamente.`})
        }
    })

}

const deleteExpense = expenseId => {
    showAlert('warning-message-and-cancel', {title: `Eliminar Gasto`, text: `Esta seguro que desea eliminar este gasto?`})
    $('.swal-button--confirm').click( async () => {
        try {
            const data = {deleted: true}
            const {status} = await request({method: 'patch', url: `expenses/${expenseId}/`, data})
            if (status == 200) {
                showAlert('success-message', {title: 'Correcto', text: `Gasto eliminado con exito`})
                location.reload()
            }
        } catch (error) {
            console.log(error)
            showAlert('error-message', {title: 'Error', text: `No se pudo eliminar el gasto, intente nuevamente.`})
        }
    })
}
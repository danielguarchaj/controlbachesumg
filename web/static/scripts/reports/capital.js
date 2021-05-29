const capitalTable = document.getElementById('capitalTable')
const after = document.getElementById('after')
const before = document.getElementById('before')

const fetchCapital = async exportExcel => {
    if (after.value == '') {
        showAlert('error-message', {title: 'Error', text: 'Ingresa la fecha de inicio'})
        return
    }
    if (before.value == '') {
        showAlert('error-message', {title: 'Error', text: 'Ingresa la fecha de fin'})
        return
    }
    const queryParams = buildQueryParams('query-params')
    if (exportExcel) {
        window.open('/api/reports/capital' + buildQueryParams('query-params'), '_blank');
        return
    }
    try {
        const {data} = await http.get('capital/' + queryParams)
        renderCapital(data)
    } catch (error) {
        console.log(error)
        showAlert('error-message', {title: 'Error', text: 'No se ha podido generar el reporte, intente nuevamente'})
    }
}

const renderCapital = agencies => {
    capitalTable.innerHTML = agencies.reduce((html, data) => {
        return html += `
        <tr>
            <td data-label="Agencia">${data.agency.name}</td>
            <td data-label="Ganancia">${formatCurrency(data.total_invested)}</td>
        </tr>
        `
    }, '')
}

document.addEventListener('DOMContentLoaded', () => {
    $('.datepicker').datepicker({
        enableOnReadonly: true,
        todayHighlight: true,
        format: 'yyyy-mm-dd'
    });
})
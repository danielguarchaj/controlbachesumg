const dailyEarningsTable = document.getElementById('dailyEarningsTable')
const after = document.getElementById('after')
const before = document.getElementById('before')

const fetchEarnings = async exportExcel => {
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
        window.open('/api/reports/earnings' + buildQueryParams('query-params'), '_blank');
        return
    }
    try {
        const {data} = await http.get('earnings/' + queryParams)
        renderEarnings(data)
    } catch (error) {
        console.log(error)
        showAlert('error-message', {title: 'Error', text: 'No se ha podido generar el reporte, intente nuevamente'})
    }
}

const renderEarnings = balance => {
    document.getElementById('totalEarnings').innerHTML = `Total ganancias: ${formatCurrency(balance.total_earnings)}`
    document.getElementById('totalExpenses').innerHTML = `Total gastos: ${formatCurrency(balance.total_expenses)}`
    dailyEarningsTable.innerHTML = balance.dayli_balance.reduce((html, day) => {
        return html += `
        <tr>
            <td data-label="Fecha">${day.date}</td>
            <td data-label="Ganancia bruta">${formatCurrency(day.day_balance.earnings)}</td>
            <td data-label="Gastos">${formatCurrency(day.day_balance.expenses)}</td>
            <td data-label="Ganancia neta">${formatCurrency(day.day_balance.earnings)}</td>
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
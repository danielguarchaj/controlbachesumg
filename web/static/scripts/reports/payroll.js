const getQuincenaRango = quincena => {
    // var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    const mes = Number(quincena.mes) - 1

    var lastDayDate = new Date(Number(quincena.ano), mes + 1, 0);

    const lastDay = lastDayDate.getDate()

    const finQuincena = Math.floor(lastDay / 2)

    if (quincena.quincena == '1') {
        return {
            after: `${quincena.ano}-${quincena.mes}-1`,
            before: `${quincena.ano}-${quincena.mes}-${finQuincena}`
        }
    } else if (quincena.quincena == '2') {
        return {
            after: `${quincena.ano}-${quincena.mes}-${finQuincena + 1}`,
            before: `${quincena.ano}-${quincena.mes}-${lastDay}`
        }
    }
    
}

const fetchAdvisers = async exportExcel => {
    const quincenaData = {}
    let error = false
    for (const campo of document.getElementsByClassName('filtro')) {
        if (campo.value == '') error = true
        else quincenaData[campo.name] = campo.value
    }
    if (error) {
        showAlert('error-message', {title: 'Error', text: 'Ingrese todos los datos para generar el reporte'})
        return
    }
    const rangeDate = getQuincenaRango(quincenaData)
    if (exportExcel) {
        window.open(`/api/reports/payroll?after=${rangeDate.after}&before=${rangeDate.before}`, '_blank');
        return
    }
    try {
        const {data: advisers} = await http.get(`user-installments/?after=${rangeDate.after}&before=${rangeDate.before}`)
        renderAdvisers(advisers, rangeDate)
    } catch (error) {
        console.error(error)
    }
}

const renderAdvisers = (advisers, rangeDate) => {
    document.getElementById('rangoQuincena').innerHTML = `
        ${moment(rangeDate.after).format('DD/MM/YYYY')} -
        ${moment(rangeDate.before).format('DD/MM/YYYY')}
    `
    document.getElementById('advisersTable').innerHTML = advisers.reduce( (html, adviser) => {
        return html += `
        <tr>
            <td data-label="Asesor" class="py-1">
                ${adviser.first_name} ${adviser.last_name}
            </td>
            <td data-label="Progreso">
                <div class="progress">
                    <div class="progress-bar bg-danger" role="progressbar" style="width: ${adviser.summary.progress}%" aria-valuenow="${adviser.summary.progress}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </td>
            <td data-label="Comision">
                ${formatCurrency(adviser.summary.comission)} (%${adviser.summary.adviser_comission})
            </td>
            <td data-label="Monto Recuperado">
                ${formatCurrency(adviser.summary.total_collected)}
            </td>
            <td data-label="Monto Invertido">
                ${formatCurrency(adviser.summary.approved_amount)}
            </td>
        </tr>
        `
    }, '')
} 

document.addEventListener('DOMContentLoaded', () => {
//     fetchAdvisers()
})
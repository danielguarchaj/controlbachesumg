const generatedLoansTable = document.getElementById('generatedLoansTable')

const fetchGeneratedLoans = async () => {
    const queryParams = buildQueryParams('query-params')
    try {
        const {data} = await http.get('loans/' + queryParams)
        renderGeneratedLoans(data)
    } catch (error) {
        console.log(error)
        showAlert('error-message', {title: 'Error', text: 'No se ha podido generar el reporte, intente nuevamente'})
    }
}

const exportExcel = async () => window.open('/api/reports/generated-loans' + buildQueryParams('query-params'), '_blank');


const renderGeneratedLoans = loans => {
    generatedLoansTable.innerHTML = loans.reduce((html, loan) => {
        return html += `
        <tr>
            <td data-label="Cliente">${loan.client.first_name} ${loan.client.last_name}</td>
            <td data-label="Asesor">${loan.client.adviser.first_name} ${loan.client.adviser.last_name}</td>
            <td data-label="Agencia">${loan.client.adviser.profile.agency.name}</td>
            <td data-label="Fecha de generacion">${moment(loan.created).format('DD/MM/YYYY')}</td>
            <td data-label="Estado">${getLoanStatus(loan.status)}</td>
            <td class="text-center" data-label="Acciones">
                <a class="btn btn-outline-info btn-sm" data-toggle="tooltip" data-placement="top" title="Ver" href="${getLoanRedirectUrl(loan.status)}${loan.id}"><i class="mdi mdi-eye"></i></a>
            </td>
        </tr>
        `
    }, '')
}

const getLoanStatus = status => {
    switch (status) {
        case 1:
            return `<div class="badge badge-primary badge-pill">Solicitado</div>`
        case 2:
            return `<div class="badge badge-info badge-pill">Aprobado</div>`
        case 3:
            return `<div class="badge badge-danger badge-pill">Rechazado</div>`
        case 4:
            return `<div class="badge badge-warning badge-pill">Bloqueado</div>`
        case 5:
            return `<div class="badge badge-success badge-pill">Pagado</div>`
        default:
            break;
    }
}

const getLoanRedirectUrl = status => {
    switch (status) {
        case 1:
            return `/unapproved-credit/`
        case 2:
            return `/credit-view/`
        case 3:
            return `/rejected-credit-view/`
        case 4:
            return `/blocked-credit-view/`
        case 5:
            return `/payed-credit-view/`
        default:
            break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    $('.datepicker').datepicker({
        enableOnReadonly: true,
        todayHighlight: true,
        format: 'yyyy-mm-dd'
    });
})
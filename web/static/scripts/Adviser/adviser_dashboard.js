const tobdyAlDia = document.getElementById('tobdyAlDia')
const tobdyAtrasados = document.getElementById('tobdyAtrasados')
const tbodyAbonados = document.getElementById('tbodyAbonados')
const tbodyCobradosHoy = document.getElementById('tbodyCobradosHoy')

const fetchDashboardData = async () => {
  const today = new Date()
  let url = `dashboard/?query_date=${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  const isDashboard = getCurrentPage('dashboard')
  !isDashboard ? url += `&user_pk=${getUrlParameter()}` : ''
  try {
    const { data } = await http.get(url)
    renderDashboardData(data)
  } catch (error) {
    console.error(error)
  }
}

const renderDashboardData = data => {
  tobdyAlDia.innerHTML = data.pending_today.reduce( (html, i) => {
    return html += renderAlDiaRow(i)
  }, '' )
  tobdyAtrasados.innerHTML = data.delayed.reduce( (html, i) => {
    return html += renderAtrasadoRow(i)
  }, '' )
  tbodyAbonados.innerHTML = data.partial_payed.reduce( (html, i) => {
    return html += renderAbonadoRow(i)
  }, '' )
  tbodyCobradosHoy.innerHTML = data.collected_today.reduce( (html, i) => {
    return html += renderCobradoHoyRow(i)
  }, '' )
  renderStatistics(data.statistics)
  $('.datatable').DataTable()
}

const renderAlDiaRow = data => {
  return `
  <tr>
    <td scope="col">${data.client.first_name} ${data.client.last_name}</td>
    <td scope="col">${data.client.living_detail ? data.client.living_detail : ''}</td>
    <td scope="col">${data.client.phone_number ? data.client.phone_number: ''}</td>
    <td scope="col">${formatCurrency(data.installment.amount)}</td>
    <td scope="col">${formatCurrency(data.loan.amount)}</td>
    <td scope="col">
      <a class="btn btn-outline-info w-100" data-toggle="tooltip" data-placement="top" title="Ver" href="/adviser-collection/${data.installment.id}/"><i class="mdi mdi-eye"></i></a>                
    </td>
  </tr>
  `
}

const renderAtrasadoRow = data => {
  return `
  <tr>
    <td scope="col">${data.client.first_name} ${data.client.last_name}</td>
    <td scope="col">${data.client.living_detail ? data.client.living_detail : ''}</td>
    <td scope="col">${data.client.phone_number ? data.client.phone_number: ''}</td>
    <td scope="col">${moment(data.installment.paydate).format('DD/MM/YYYY')}</td>
    <td scope="col">${formatCurrency(data.installment.amount)}</td>
    <td scope="col">${formatCurrency(data.loan.amount)}</td>
    <td scope="col">
      <a class="btn btn-outline-info w-100" data-toggle="tooltip" data-placement="top" title="Ver" href="/adviser-collection/${data.installment.id}/"><i class="mdi mdi-eye"></i></a>                
    </td>
  </tr>
  `
}

const renderAbonadoRow = data => {
  return `
  <tr>
    <td scope="col">${data.client.first_name} ${data.client.last_name}</td>
    <td scope="col">${data.client.living_detail ? data.client.living_detail : ''}</td>
    <td scope="col">${data.client.phone_number ? data.client.phone_number: ''}</td>
    <td scope="col">${moment(data.installment.paydate).format('DD/MM/YYYY')}</td>
    <td scope="col">${formatCurrency(data.total_payment)}</td>
    <td scope="col">${formatCurrency(data.installment.amount - data.total_payment)}</td>
    <td scope="col">${formatCurrency(data.installment.amount)}</td>
    <td scope="col">
      <a class="btn btn-outline-info w-100" data-toggle="tooltip" data-placement="top" title="Ver" href="/adviser-collection/${data.installment.id}/"><i class="mdi mdi-eye"></i></a>                
    </td>
  </tr>
  `
}

const renderCobradoHoyRow = data => {
  return `
  <tr>
    <td scope="col">${data.client.first_name} ${data.client.last_name}</td>
    <td scope="col">${data.client.living_detail ? data.client.living_detail : ''}</td>
    <td scope="col">${data.client.phone_number ? data.client.phone_number: ''}</td>
    <td scope="col">${formatCurrency(data.total_payment)}</td>
    <td scope="col">${formatCurrency(data.installment.amount - data.total_payment)}</td>
    <td scope="col">${formatCurrency(data.installment.amount)}</td>
    <td scope="col">
      <a class="btn btn-outline-info w-100" data-toggle="tooltip" data-placement="top" title="Ver" href="/adviser-collection/${data.installment.id}/"><i class="mdi mdi-eye"></i></a>                
    </td>
  </tr>
  `
}

const renderStatistics = data => {
  $('.generatedPenaltyCard').html(`${formatCurrency(data.generated_penalty)}`)
  $('.collectedPenaltyCard').html(`${formatCurrency(data.collected_penalty)}`)
  $('.comissionCard').html(`${formatCurrency(data.comission)}`)
  $('.collectedCard').html(`${formatCurrency(data.collected)}`)
  $('.pendingToCollectCard').html(`${data.pending_to_collect.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
  $('.progressCard').html(`%${formatCurrency(data.progress)}`)
}

document.addEventListener('DOMContentLoaded', () => {
  fetchDashboardData()
})
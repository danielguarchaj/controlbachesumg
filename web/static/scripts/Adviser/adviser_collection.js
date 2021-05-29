const btnPayment = document.getElementById('btnPayment')
const maximumPaymentErrorLabel = document.getElementById('maximumPaymentErrorLabel')
const maximumLoanErrorLabel = document.getElementById('maximumLoanErrorLabel')
const penaltyWarningBadge = document.getElementById('penaltyWarningBadge')
const coveredInstallments = document.getElementById('coveredInstallments')
const negativeErrorLabel = document.getElementById('negativeErrorLabel')
const payment = document.getElementById('payment')

let errors = false
let applyPenalty = false
let maximumAmountError = false
let coverFuturePayments = false
let error = false

const fetchInstallment = async () => {
  try {
    const { data } = await http.get('installments/' + getUrlParameter())
    return data;
  } catch (error) {
    console.log(error)
  }
}

const fetchLoan = async loanPk => {
  try {
    const { data } = await http.get(`loans/${loanPk}/`)
    return data;
  } catch (error) {
    console.log(error)
  }
}

const validateAmounts = (e, payment, input) => {
  if (!validateMaximumAmount(payment)) return
  validatePenalty(payment)
}

const validatePenalty = payment => {
  payment = Number(payment)
  if (payment < installment.pending_payment * 0.8) {
    applyPenalty = true
    penaltyWarningBadge.classList.remove('hidden')
    penaltyWarningBadge.innerHTML = `Aplica mora de ${formatCurrency(setLoanAmountToPay())}`
  } else {
    applyPenalty = false
    penaltyWarningBadge.classList.add('hidden')
  }
}

const validateMaximumAmount = payment => {
  negativeErrorLabel.classList.add('hidden')
  payment = Number(payment)
  if (payment < 0) {
    negativeErrorLabel.classList.remove('hidden')
    error = true
    return false
  }
  error = false
  maximumLoanErrorLabel.classList.add('hidden')
  maximumAmountError = false
  coverFuturePayments = false
  coveredPaymentsHtml = ''
  paymentsPayload = []
  penaltiesPayload = []
  coveredInstallments.innerHTML = coveredPaymentsHtml
  if (payment > loan.pending_payment) {
    maximumLoanErrorLabel.classList.remove('hidden')
    maximumAmountError = true
    return false
  } else if ((payment > installment.pending_payment && payment <= loan.pending_payment)) {
    structureFuturePayments(payment)
    coverFuturePayments = true
    coveredInstallments.innerHTML = coveredPaymentsHtml
    return true
  }
  return true
}

let paymentsPayload = []
let penaltiesPayload = []
let coveredPaymentsHtml = ''

const structureFuturePayments = (payment) => {
  payment = Number(payment)
  for (const pi of pendingInstallments) {
    const installmentStatusStyle = { class: '', text: 'Esta cuota' } // CONTIENE ESTILOS SEGUN ESTADO DE CUOTA
    let checkbox = '' // Contendra checkbox para cuotas atrasadas y al dia
    let checkedAndDisabled = '' // Contendra propiedades checked y disabled para cuotas atrasadas y al dia menores de 80% (pago)


    // verifica si el pago disponible es menor al 80% de lo pendiente de pagar de la cuota    
    if (payment > 0 && payment < pi.pending_payment * 0.8 && pi.id <= installment.id) {
      penaltiesPayload.push({
        amount: loanAmountToPay,
        installment: pi.id
      })
      checkedAndDisabled = `checked disabled`
    }

    if (pi.id < installment.id) { // Si es pago atrasado
      installmentStatusStyle.class = 'text-danger' // Aplciar estilos
      installmentStatusStyle.text = '* Cuota atrasada'
      checkbox = `
        <div class="form-check">
          <label class="form-check-label">
            <input type="checkbox" class="form-check-input" ${checkedAndDisabled} onclick="togglePenalty(this, ${pi.id})">
            Aplicar mora
          <i class="input-helper"></i></label>
        </div> 
      ` // Agregar checkbox
    } else if (pi.id > installment.id) {
      installmentStatusStyle.class = 'text-success'
      installmentStatusStyle.text = '* Cuota adelantada'
    } else if (pi.id == installment.id) { // Si es cuota al dia
      payment < pi.pending_payment * 0.8 ? checkbox = `
        <div class="form-check">
          <label class="form-check-label">
            <input type="checkbox" class="form-check-input" checked disabled>
            Aplicar mora
          <i class="input-helper"></i></label>
        </div>
      ` : false // Verificar si aplica mora
    }
    if (payment > 0 && pi.pending_payment <= payment) { // Pago a realizar es mayor a cero y puede cubrir la totalidad de la cuota iterada
      paymentsPayload.push({
        amount: pi.pending_payment,
        payment_type: 1,
        installment: pi.id
      })
      coveredPaymentsHtml += `<li class="list-group-item py-1 ${installmentStatusStyle.class}" > ${checkbox} Pago correspondiente al <strong>${moment(pi.paydate).format('DD/MM/YYYY')}</strong> completo ${installmentStatusStyle.text}</li>`
      payment -= pi.pending_payment
    } else if (payment > 0 && pi.pending_payment > payment) {
      paymentsPayload.push({
        amount: payment,
        payment_type: 1,
        installment: pi.id
      })
      coveredPaymentsHtml += `<li class="list-group-item py-1 ${installmentStatusStyle.class}"> ${checkbox} Pago correspondiente al <strong>${moment(pi.paydate).format('DD/MM/YYYY')}</strong> abonado con <strong>${formatCurrency(payment)}</strong> ${installmentStatusStyle.text}</li>`
      payment = 0
    }
  }
}

const togglePenalty = (checkbox, installmentId) => {
  checkbox.checked ? penaltiesPayload.push({
    amount: loanAmountToPay,
    installment: installmentId
  }) : removePenalty(installmentId)
}

const removePenalty = installmentId => {
  for (let i = 0; i < penaltiesPayload.length; i++) {
    if (penaltiesPayload[i].installment == installmentId) penaltiesPayload.splice(i, 1)
  }
}

const savePayment = id => {
  if (payment.value == '' || payment.value == '0' || maximumAmountError || error) {
    showAlert('error-message', { title: 'Error', text: 'Ingrese un monto valido' })
    return
  }

  showAlert('warning-message-and-cancel', { title: 'Abonar', text: 'Esta seguro que desea abonar a este pago?' })
  $('.swal-button--confirm').click(async () => {
    try {
      const url = `payments/`
      if (!coverFuturePayments) {
        const data = {
          amount: payment.value,
          payment_type: 1,
          installment: getUrlParameter(),
        }
        const responsePayment = await request({ method: 'post', url, data })
        if (applyPenalty) {
          const { status } = await request({ method: 'post', url: 'penalties/', data: { installment: getUrlParameter() } })
        }
        if (responsePayment.status == 201) {
          showAlert('success-message', { title: 'Guardado', text: 'Abono realizado con exito' })
          location.reload()
        }
      } else {
        for (const data of paymentsPayload) {
          await request({ method: 'post', url, data })
        }
        for (const data of penaltiesPayload) {
          await request({ method: 'post', url: 'penalties/', data })          
        }
        showAlert('success-message', { title: 'Guardado', text: 'Abono realizado con exito' })
        if (Number(payment.value) == loan.pending_payment) {
          location.href = '/payed-credit-view/' + loan.id
        } else {
          location.reload()
        }
      }
    } catch (error) {
      console.error(error)
      showAlert('error-message', { title: 'Error', text: 'No se pudo realizar el abono al pago' })
    }
  })
}

const openPenaltyPaymentModal = () => {
  ShowModal(
    'Pagar mora', `
    <div class="d-flex align-items-start profile-feed-item">
      <div class="row w-100">
        <div class="ml-4 col-xsm-12 w-100">
          <h6>
            Abonar
          </h6>
          <div class="input-group">
            <div class="input-group-prepend">
              <button class="btn btn-sm btn-outline-primary" type="button">Mora</button>
            </div>
            <input type="number" class="form-control" placeholder="0" aria-label="0" onkeyup="return validateMaxPenaltyAmount(event, this.value)" id="penalty">
            <div class="input-group-append">
              <button class="btn btn-sm btn-success" type="button" onclick="savePenalty()">Guardar</button>
            </div>
          </div>
          <p class="error-label hidden" id="maximumPenaltyErrorLabel">* El monto que se quiere ingresar es mayor a la mora pendiente de pago</p>
        </div>
      </div>
    </div>
  `, `
    <button type="button" class="btn btn-light" data-dismiss="modal">Cerrar</button>
  `)
}

let errorMaxPenalty = 0
const validateMaxPenaltyAmount = (e, payment) => {
  payment = Number(payment)
  if (payment > loan.pending_penalty) {
    document.getElementById('maximumPenaltyErrorLabel').classList.remove('hidden')
    errorMaxPenalty = true
  } else {
    document.getElementById('maximumPenaltyErrorLabel').classList.add('hidden')
    errorMaxPenalty = false
  }
}

const savePenalty = () => {
  const penalty = document.getElementById('penalty')
  if (penalty.value == '' || penalty.value == '0' || errorMaxPenalty) {
    showAlert('error-message', { title: 'Error', text: 'Ingrese un monto valido para la mora' })
    return
  }
  const data = {
    amount: penalty.value,
    payment_type: 2,
    installment: getUrlParameter(),
  }
  showAlert('warning-message-and-cancel', { title: 'Pagar Mora', text: 'Esta seguro que desea pagar esta cantidad a la mora pendiente?' })
  $('.swal-button--confirm').click(async () => {
    try {
      const url = `payments/`
      const responsePayment = await request({ method: 'post', url, data })
      if (responsePayment.status == 201) {
        showAlert('success-message', { title: 'Guardado', text: 'Pago de mora realizado con exito' })
        location.reload()
      }
    } catch (error) {
      console.error(error)
      showAlert('error-message', { title: 'Error', text: 'No se pudo realizar el pago de la mora' })
    }
  })
}

const setLoanAmountToPay = () => {
  if (loan.total_to_collect > 0 && loan.total_to_collect <= 1000) {
    return 10
  } else if (loan.total_to_collect > 1000 && loan.total_to_collect <= 3000) {
    return 15
  } else if (loan.total_to_collect > 3000 && loan.total_to_collect <= 6000) {
    return 20
  } else if (loan.total_to_collect > 6000) {
    return 25
  } 
}

let installment = null
let loan = null
let pendingInstallments = null
let loanAmountToPay = null

document.addEventListener('DOMContentLoaded', async () => {
  installment = await fetchInstallment()
  loan = await fetchLoan(installment.loan.id)
  loanAmountToPay = setLoanAmountToPay()
  const { data: pendingInst } = await http.get('installments/?status=1&loan=' + loan.id)
  pendingInstallments = pendingInst
})


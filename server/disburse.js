/* Disbursement process:
 * get all payments
 * –> filter out undisburseable payments
 * –> batch payments by buyer into a request
 * –> format request for processor
 * –> submit request to processor
 */

/* Verification process:
 * appropraite authorities (manual or automatic) change payments be disburseable before disbursements are executed.
 * therefore at disbursement time, all payments have been vetted are ready to disburse
 */

/* Atomicity:
 * programmatically payments ought to be atomic–each one is for one thing only
 * but we want to group payments together to avoid processing fees
 * and buyers/beneficiarys don't want to see more than one charge on their statement.
 * so definitely want to be able to charge(payment) and disburse(payment).
 */

var R = require('ramda');
var stripe = require('./stripe.js');
module.exports = {
  disburse: disburse
};

// with Ramda:
// var specificPaymentsToDisburse = request.data.paymentsToDisburse;
// var payments = specificPaymentsToDisburse ? specificPaymentsToDisburse : payments;
function disburse(payments){
  return R.pipe(
    R.filter( isDisburseable ),
    R.reduce( groupPaymentsByBeneficiary, {} ),
    R.mapObj( createDisbursementRequest ),
    R.mapObj( stripe.processDisbursementRequest ),
    reduceObj( combineDisbursementResponses, [] )
  )(payments);
};
// var disbursementRecord = disburse(payments);
// console.log('disbursementRecord',disbursementRecord);

function isDisburseable(payment){
  return payment.status === 'received';
};

function reduceObj(func, accumulator){
  return function(obj){
    var result = accumulator;
    for(var key in obj){
      result = func(result, obj[key]);
      // console.log('reducing', obj[key], result );
    }
    return result;
  };
};
// console.log(reduceObj(function(x, sum){ return sum+x; }, 0)({'a':1, 'b':10, 'c':100}));

function groupPaymentsByBeneficiary(paymentsByBeneficiary, payment){
  paymentsByBeneficiary[payment.beneficiary] = paymentsByBeneficiary[payment.beneficiary] || {};
  var thisBeneficiary = paymentsByBeneficiary[payment.beneficiary];
  thisBeneficiary.payments = thisBeneficiary.payments || [];
  thisBeneficiary.payments.push(payment);
  thisBeneficiary.beneficiary = payment.beneficiary;
  return paymentsByBeneficiary;
};

function createDisbursementRequest(beneficiaryWithPayments){
  var payments = beneficiaryWithPayments.payments;
  return {
    beneficiary: beneficiaryWithPayments.beneficiary,
    amount: beneficiaryWithPayments.payments.reduce( calculateBeneficaryAmount, 0 ),
  };
};

function calculateBeneficaryAmount(previousTotalsToBeneficiary, payment){
  return previousTotalsToBeneficiary + beneficiaryAmount(payment);
};

function beneficiaryAmount(payment){
  // payment.modifiers: [
  //   {label: 'transaction fee', amount: -30, percent: -0.029},
  //   {label: 'platform fee', amount: 0, percent: -0.05},
  //   {label: 'half-off platform fee discount from sales', amount: 0, percent: +0.02}
  // ];
  var total = payment.amount;
  for(var key in payment.modifiers){
    total += payment.amount*(payment.modifiers[key].percent) + payment.modifiers[key].amount;
  }
  return total;
};
// console.log('beneficiaryAmount', beneficiaryAmount({beneficiary: 'tom',   currency: 'USD', amount: 10000, status: 'received'})/100);

function combineDisbursementResponses(disbursementRecord, disbursementResponse){
  disbursementRecord.push(disbursementResponse);
  return disbursementRecord;
};

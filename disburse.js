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

/*
 * Amounts are always in cents. Any math that interacts with cents must ensure it remains cents (no floating-pointiness).
 */

/* Payments Status after the following:
 * 'uncaptured' buyer makes a failed payment to us
 * 'received' buyer makes a successful payment to us
 * 'frozen' we freeze a payment, perhaps because of suspected fraud
 * 'refunded' we refund a payment to the buyer
 * ''
 * 'chargeback won' same thing as 'received'
 * 'chargeback lost' buyer chargebacks a payment from us (or should it be 'frozen'?)
 * 'disbursed' we disburse a payment to the beneficiary
 *
 */

/* Atomicity:
 * programmatically payments ought to be atomic–each one is for one thing only
 * but we want to group payments together to avoid processing fees
 * and buyers/beneficiarys don't want to see more than one charge on their statement.
 * so definitely want to be able to charge(payment) and disburse(payment).
 */

/* Payment scope:
 * ¿do we care what the payment is for?
 * No, the system using payments can make that association.
 */

var R = require('ramda');
var stripe = require('./stripe.js');
var allPayments = [
  {beneficiary: 'ann',   currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'ann',   currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'ann',   currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'dan',   currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'dan',   currency: 'USD', amount: 10000, status: 'frozen',   modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'kat',   currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'kat',   currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'lea',   currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'sam',   currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'rob',   currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'tom',   currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}, {label: 'discount from sales', amount: 0, percent: +0.02}]},
];

// mocked server routing function:
// respondToPOST('/disburse', function(request, response){
//   var specificPaymentsToDisburse = request.data.paymentsToDisburse;
//   var payments = specificPaymentsToDisburse ? specificPaymentsToDisburse : allPayments;
//   var disburseablePayments = payments.filter( isDisburseable );
//   var paymentsByBeneficiary = disburseablePayments.reduce( groupPaymentsByBeneficiary, {});
//   obj = paymentsByBeneficiary;
//   paymentsByBeneficiary = [];
//   for(var key in obj){
//     paymentsByBeneficiary.push(obj[key])
//   }
//   var disbursementRequestsByBeneficiary = paymentsByBeneficiary.map( createDisbursementRequest )
//   var disbursementResponses = disbursementRequestsByBeneficiary.map( stripe.processDisbursementRequest );
//   // TODO mark payment 'disbursed'
//   var disbursementRecord = disbursementResponses.reduce( combineDisbursementResponses, [] );
//   console.log('disbursementRecord',disbursementRecord);
//   return disbursementRecord;
// });

respondToPOST('/disburse', function(request, response){
  // with Ramda:
  var specificPaymentsToDisburse = request.data.paymentsToDisburse;
  var payments = specificPaymentsToDisburse ? specificPaymentsToDisburse : allPayments;
  var disburse = R.pipe(
    R.filter( isDisburseable ),
    R.reduce( groupPaymentsByBeneficiary, {} ),
    R.mapObj( createDisbursementRequest ),
    R.mapObj( stripe.processDisbursementRequest ),
    reduceObj( combineDisbursementResponses, [] )
  );
  var disbursementRecord = disburse(payments);
  console.log('disbursementRecord',disbursementRecord);
  return disbursementRecord;
});

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

function respondToPOST(path, callback){
  var request = {data: {}};
  var response = {};
  callback(request, response);
};

/*
 * Notes
 */

// 'linked payments' connect tip, perk, etc?
// allow selection of multiple perks per charge?
// pledge: {
//   charges: [ // ...this is a shopping cart.
//     {perk1: $25},
//     {perk2: $50},
//     {shipping1: $10},
//     {tip: $5}
//   ]
// }
// another option is to have a flag that additional charges are incoming

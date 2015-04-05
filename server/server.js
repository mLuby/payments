var express = require('express');
var app = express();
var charge = require('./charge.js').charge;
var freeze = require('./freeze.js').freeze;
var unfreeze = require('./freeze.js').unfreeze;
var refund = require('./refund.js').refund;
var startChargeback = require('./chargeback.js').startChargeback;
var winChargeback = require('./chargeback.js').winChargeback;
var loseChargeback = require('./chargeback.js').loseChargeback;
var disburse = require('./disburse.js').disburse;
// var stripe = require('./modify.js'); // fees, discounts, promotions, etc.

/* Payment scope:
 * ¿do we care what the payment is for?
 * No, the system using payments can make that association.
 */

/*
 * Amounts are always in cents. Any math that interacts with cents must ensure it remains cents (no floating-pointiness).
 */

/* Payments Status after the following:
 * 'uncaptured' buyer makes a failed payment to us
 * 'received' buyer makes a successful payment to us
 * 'frozen' we freeze a payment, perhaps because of suspected fraud
 * 'refunded' we refund a payment to the buyer
 * 'chargeback won' same thing as 'received'
 * 'chargeback lost' buyer chargebacks a payment from us (or should it be 'frozen'?)
 * 'disbursed' we disburse a payment to the beneficiary
 */

/**
 *@return {array} payments - all payments ordered by id
 */
app.get('/payments', function (request, response) {
  response.send(payments);
});

app.get('/payments/disburse', function (request, response) {
  response.send(disburse(payments));
});

/**
 *@param {number} payment_id - a payment id
 *@return {array} payment - the payment associated with that id
 */
app.get('/payment/:id', function (request, response) {
  response.send(payments[request.params.id]);
});

// The following should be put || post.

// ¿Separate create and charge functionality?
app.get('/payment/:id/charge', function (request, response) {
  response.send(charge(request.params.id));
});

app.get('/payment/:id/freeze', function (request, response) {
  response.send(freeze(request.params.id));
});

app.get('/payment/:id/unfreeze', function (request, response) {
  response.send(unfreeze(request.params.id));
});

app.get('/payment/:id/refund', function (request, response) {
  response.send(refund(request.params.id));
});

// called by banks via webhook to initiate chargeback proceeding
app.get('/payment/:id/chargeback/start', function (request, response) {
  response.send(startChargeback(request.params.id));
});

// called by banks via webhook
app.get('/payment/:id/chargeback/win', function (request, response) {
  response.send(winChargeback(request.params.id));
});

// called by banks via webhook
app.get('/payment/:id/chargeback/lose', function (request, response) {
  response.send(loseChargeback(request.params.id));
});

/*
 * Account endpoints allow association of credit card tokens with accounts.
 */

app.put('/account/:id/creditcard/create', function (request, response) {
  response.send(request.params.id);
});
app.get('/account/:id/creditcard/', function (request, response) {
  response.send(request.params.id);
});
app.delete('/account/:id/creditcard/delete', function (request, response) {
  response.send(request.params.id);
});

var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

// Seed data:
var payments = [
  {beneficiary: 'ann',   history: [], currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'ann',   history: [], currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'ann',   history: [], currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'dan',   history: [], currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'dan',   history: [], currency: 'USD', amount: 10000, status: 'frozen',   modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'kat',   history: [], currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'kat',   history: [], currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'lea',   history: [], currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'sam',   history: [], currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'rob',   history: [], currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}]},
  {beneficiary: 'tom',   history: [], currency: 'USD', amount: 10000, status: 'received', modifiers: [
    {label: 'transaction fee', amount: -30, percent: -0.029}, {label: 'platform fee', amount: 0, percent: -0.05}, {label: 'discount from sales', amount: 0, percent: +0.02}]},
];

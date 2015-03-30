var StripeAPI = require('stripe')('sk_test_BQokikJOvBiI2HlWgH4olfQ2');

module.exports = {
  processChargeRequest: processChargeRequestWithStripe,
  processDisbursementRequest: processDisbursementRequestWithStripe
}

/**
 * Charge
 */

/**
 * Call Stripe's API to make a charge.
 * @param {object} chargeRequest - generic charge request.
 * @return {object} genericizedResponse - response from a payment processor in generic format.
 */
function processChargeRequestWithStripe(chargeRequest){
  var genericRequest = chargeRequest;
  var stripeRequest = formatStripeChargeRequest(genericRequest);
  var stripeResponse = StripeAPI.POST(stripeRequest);
  var genericResponse = formatChargeResponseFromStripe(stripeResponse);
  return genericResponse;
}

/**
 * Create Stripe-specific request for a disbursement.
 * @param {object} disbursementRequest - generic disbursement request.
 * @return {object} formattedRequest - disbursement request formatted for Stripe.
 */
function formatStripeChargeRequest(chargeRequest){
  var formattedRequest = chargeRequest;
  return formattedRequest;
};

/**
 * Create Stripe-specific response for a charge.
 * @param {object} stripeResponse - Stripe-specific charge response.
 * @return {object} genericizedResponse - generic charge response.
 */
function formatStripeChargeResponse(stripeResponse){
  var genericizedResponse = stripeResponse;
  return genericizedResponse;
};

/**
 * Disbursement
 */

/**
 * Call Stripe's API to make a disbursement.
 * @param {object} disbursementRequest - generic disbursement request.
 * @return {object} genericizedResponse - response from a payment processor in generic format.
 */
function processDisbursementRequestWithStripe(disbursementRequest){
  var genericRequest = disbursementRequest;
  var stripeRequest = formatStripeDisbursementRequest(genericRequest);
  console.log('making request to Stripe:', stripeRequest);
  var stripeResponse = stripeRequest;//StripeAPI.POST(stripeRequest);
  var genericResponse = formatDisbursementResponseFromStripe(stripeResponse);
  return genericResponse;
};

/**
 * Create Stripe-specific request for a disbursement.
 * @param {object} disbursementRequest - generic disbursement request.
 * @return {object} formattedRequest - disbursement request formatted for Stripe.
 */
function formatStripeDisbursementRequest(disbursementRequest){
  var formattedRequest = disbursementRequest;
  // TODO
  return formattedRequest;
};

/**
 * Create Stripe-specific response for a disbursement.
 * @param {object} stripeResponse - Stripe-specific disbursement response.
 * @return {object} genericizedResponse - generic disbursement response.
 */
function formatDisbursementResponseFromStripe(stripeResponse){
  var genericizedResponse = stripeResponse;
  // TODO
  return genericizedResponse;
};

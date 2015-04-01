module.exports = {
  refund: function(){ console.log('reeeefunnnnnd'); return 'refund!'+JSON.stringify(arguments); }
};

// Refunded payments can't be frozen or chargedback.
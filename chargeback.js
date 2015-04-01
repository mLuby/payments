/*
 * Chargeback path:
 * from 'received'/'frozen'/'disbursed' to 'chargedback'
 *    from 'chargedback' to 'refunded' (chargeback lost)
 * or from 'chargedback' to 'received' (chargeback won)
 */
module.exports = {
  startChargeback: function(){ return 'startChargeback!'+JSON.stringify(arguments); },
  winChargeback: function(){ return 'winChargeback!'+JSON.stringify(arguments); },
  loseChargeback: function(){ return 'loseChargeback!'+JSON.stringify(arguments); }
};

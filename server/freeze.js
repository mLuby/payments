module.exports = {
  freeze: function(){ return 'freeze!'+JSON.stringify(arguments); },
  unfreeze: function(){ return 'unfreeze!'+JSON.stringify(arguments); }
};

function freeze(payment){
  payment.history.push({status: 'frozen', created_at: new Date()})
  payment.status = 'frozen'
};

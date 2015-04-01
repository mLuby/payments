module.exports = {
  freeze: function(){ return 'freeze!'+JSON.stringify(arguments); },
  unfreeze: function(){ return 'unfreeze!'+JSON.stringify(arguments); }
};

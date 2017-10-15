'use strict';

const orderCoffee = require('./orderCoffee');

module.exports = function(intentRequest, callback){
  console.log(`Dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
  const intentName = intentRequest.currentIntent.name;
    if(intentName === 'CoffeeOrder'){
      console.log(intentName + ' is Running...');
      return orderCoffee(intentRequest, callback);
    }

    throw new Error(`Intent name: ${intentName} is not supported.`);
}

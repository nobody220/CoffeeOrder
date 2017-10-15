'use strict';

const lexResponse = require('./lexResponse');

module.exports = function(intentRequest, callback){
  var coffeeType = intentRequest.currentIntent.slots.coffee,
      coffeeSize = intentRequest.currentIntent.slots.size;

  console.log('Coffee: ' + coffeeType);
  console.log('Size: ' + coffeeSize);

  const source = intentRequest.invocationSource;
    if(source === 'DialogCodeHook'){
      const slots = intentRequest.currentIntent.slots;
      const validationResult = validateCoffeeOrder(coffeeType, coffeeSize);
        if(!validationResult.isValid){
          slots[`${validationResult.violatedSlot}`] = null;
          callback(lexResponse.elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message));
          return;
        }

        // IF SIZE IF NOT DEFINED (DEFAULT SIZE)
        // if(coffeeSize == null){
        //   intentRequest.currentIntent.slots.size = '';
        // }

      callback(lexResponse.delegate(intentRequest.sessionAttributes, intentRequest.currentIntent.slots));
      return;
    }
}



// VALIDATIONS

const types = ['great taste', 'kopiko', 'nescafe'];
const sizes = ['small', 'medium', 'large'];

function validateCoffeeOrder(coffeeType, coffeeSize){

  // COFFEE
  if(coffeeType && types.indexOf(coffeeType.toLowerCase()) === -1){
    return buildValidationResult(false, 'coffee', `${coffeeType} does not exist.`);
  }

  // SIZE
  if(coffeeSize && sizes.indexOf(coffeeSize.toLowerCase()) === -1){
    return buildValidationResult(false, 'size', `${coffeeSize} not available.`);
  }

  // CHECKING
  if(coffeeType && coffeeSize){

    // GREAT TASTE -> SMALL
    if(coffeeType.toLowerCase() === 'great taste' && !(coffeeSize.toLowerCase() === 'small')){
      return buildValidationResult(false, 'size', `${coffeeType} is for small size only.`);
    }

    // KOPIKO -> MEDIUM
    if(coffeeType.toLowerCase() === 'kopiko' && !(coffeeSize.toLowerCase() === 'medium')){
      return buildValidationResult(false, 'size', `${coffeeType} is for medium size only.`);
    }

    // NESCAFE -> LARGE
    if(coffeeType.toLowerCase() === 'nescafe' && !(coffeeSize.toLowerCase() === 'large')){
      return buildValidationResult(false, 'size', `${coffeeType} is for large size only.`);
    }

  }

  return buildValidationResult(true, null, null);
}


function buildValidationResult(isValid, violatedSlot, messageContent){
  if(messageContent == null){
    return{
      isValid,
      violatedSlot,
    };
  }
  else{
    return{
      isValid,
      violatedSlot,
      message: { contentType: 'PlainText', content: messageContent },
    };
  }
}

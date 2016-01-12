$( document ).ready(function() {

  $('#transaction-modal').on('show.bs.modal', function (event) {
    resetModal();
    var button = $(event.relatedTarget);
    // setting all the values from the button
    var id = button.data('id');
    var type = button.data('type');
    var titleType = toTitleCase(type);
    var name = button.data('name');
    var units = button.data('units');
    var price = button.data('price');
    // get the modal object
    var modal = $(this)
    // start populating it with values
    modal.find('#transaction-title').text(titleType + " " + name);
    // see what type of button to show/type
    hideAllBtns();
    var confirmButton = $('#transaction-confirm-' + type + '-btn');
    // make the button visible
    confirmButton.show();
    // get the cash from the button
    var cash = $('#transaction-modal').data('cash');
    // start populating the button with data
    confirmButton.data('id', id);
    confirmButton.data('price', price);
    $('#transaction-units').attr('max', units);
    $('#transaction-units').data('price', price);
    $('#transaction-units-label').html("How many units would you like to " + type + "? " + ((type == "buy") ? "They" : "You") + " have <strong>" + units + "</strong> in stock.");
    $('#transaction-confirm-message').html(titleType + "ing <strong id=\"transaction-units-msg\">0</strong> of this item will " + ((type == "buy") ? "cost" : "make") + " you <strong id=\"transaction-price-msg\">$0</strong>.<br>You have $<strong id=\"transaction-cash-msg\">" + cash + "</strong> on you.");
  });

  $('#transaction-units').on('input', function(e){
    var currentUnits = $(event.target).val();
    var currentPrice = ($(event.target).data('price') * currentUnits).toFixed(2);
    $('#transaction-units-msg').html(currentUnits);
    $('#transaction-price-msg').html("$" + currentPrice);
  });

  $('#transaction-confirm-buy-btn').on('click', function(e){
    var transaction = {
      id: $(e.target).data('life-id'),
      type: "buy",
      item: $(e.target).data('id'),
      units: $('#transaction-units').val()
    };
    submitTransaction(transaction, function(result){
      if (result.error === false){
        updateUnits(result.life);
        displayAlert("success", "You have successfully bought " + transaction.units + (transaction.units === 1 ? " unit" : " units"));
      }else{
        displayAlert("warning", "Oh no!  Something has gone wrong (" + result.error + ")");
      }
    });
  });

  $('#transaction-confirm-sell-btn').on('click', function(e){
    var transaction = {
      id: $(e.target).data('life-id'),
      type: "sell",
      item: $(e.target).data('id'),
      units: $('#transaction-units').val()
    };
    submitTransaction(transaction, function(result){
      if (result.error === false){
        updateUnits(result.life);
        displayAlert("success", "You have successfully sold " + transaction.units + (transaction.units === 1 ? " unit" : " units"));
      }else{
        displayAlert("warning", "Oh no!  Something has gone wrong (" + result.message + ")");
      }
    });
  });
});

function updateUnits(life){
  // this is what you should use for updating all market status after getting
  // a life object back from the request
  // update the hud
  $("#hud-cash").html(life.current.finance.cash);
  $('#transaction-modal').data('cash', life.current.finance.cash);
  // update units and prices for all item cards
  var i = 0;
  var listings = life.listings.market;
  var inventory = life.current.inventory;
  while (i < listings.length){
    var item = $('.transaction-listing:eq(' + i + ')');
    // update the amount on hand
    $(item).find('.transaction-listing-units').html(listings[i].units);
    $(item).find('.transaction-buy-btn').data('units', listings[i].units);
    // update the amount you have
    var inventoryObj = getObjFromArr(listings[i].id, inventory);
    $(item).find('.transaction-inventory-units').html(inventoryObj.units);
    $(item).find('.transaction-sell-btn').data('units', inventoryObj.units);
    i++;
  }
}

function getObjFromArr(id, haystack){
  var i = 0;
  while (i < haystack.length){
    if (haystack[i].id == id){
      return haystack[i];
    }
    i++;
  }
  return false;
}

function submitTransaction(transaction, callback){
  $.ajax({
    type: 'POST', // Use POST with X-HTTP-Method-Override or a straight PUT if appropriate.
    dataType: 'json', // Set datatype - affects Accept header
    url: "/game/market/transaction", // A valid URL
    data: transaction
  }).done(function(result) {
    callback(result);
    $('#transaction-modal').modal('hide');
  }).fail(function(result) {
    displayAlert("danger", "Oh no!  Something has gone terribly wrong (" + JSON.stringify(result, 2, null) + ")");
    $('#transaction-modal').modal('hide');
  });
}

function resetModal(){
  $('#transaction-units').val("0");
}

function hideAllBtns(){
  $('#transaction-confirm-buy-btn').hide();
  $('#transaction-confirm-sell-btn').hide();
}

function toTitleCase(str)
{
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function displayAlert(type, message){
  alert = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">';
  alert += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + message + '</div>';
  $("#alert-container").html(alert);
}

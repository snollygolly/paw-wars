$( document ).ready(function() {
  resizeCards();

  $(window).on('resize', function() {
    resizeCards();
  });

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
    var availableStorage = $('#transaction-modal').data('available-storage');
    // get the modal object
    var modal = $(this);
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
    $('#transaction-confirm-message').html(titleType + "ing <strong id=\"transaction-units-msg\">0</strong> of this item will " + ((type == "buy") ? "cost" : "make") + " you <strong id=\"transaction-price-msg\">$0</strong>.<br>You have $<strong id=\"transaction-cash-msg\">" + cash + "</strong> on you.<br>You have storage space for <strong id=\"transaction-storage-msg\">" + availableStorage + "</strong> more item" + (availableStorage !== 1 ? "s" : "") + ".");
    modal.on('keypress', function (e) {
      if (e.which == 13) {
        confirmButton.click();
        return false;
      }
    });
  });

  $('#transaction-modal').on('shown.bs.modal', function() {
    $('#transaction-units').trigger('focus');
  });

  $('#transaction-units').on('input', function(e){
    var currentUnits = $(e.target).val();
    var currentPrice = $(e.target).data('price') * currentUnits;
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
        updateUnits(result.result.life);
        displayAlert("success", "You have successfully bought " + transaction.units + (transaction.units === 1 ? " unit" : " units"));
      }else{
        displayAlert("warning", "Oh no!  Something has gone wrong (" + result.message + ")");
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
        updateUnits(result.result.life);
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
  updateHUD(life);
  $('#transaction-modal').data('cash', life.current.finance.cash);
  $('#transaction-modal').data('available-storage', life.current.storage.available);
  // update units and prices for all item cards
  var i = 0;
  var listings = life.listings.market;
  var inventory = life.current.inventory;
  while (i < listings.length){
    var item = $('.transaction-listing[data-id="' + listings[i].id + '"]');
    // update the amount on hand
    $(item).find('.transaction-listing-units').html(listings[i].units);
    $(item).find('.transaction-buy-btn').data('units', listings[i].units);
    // update the amount you have
    var inventoryObj = getObjFromArr(listings[i].id, inventory);
    $(item).find('.transaction-inventory-units').html(inventoryObj.units);
    $(item).find('.transaction-sell-btn').data('units', inventoryObj.units);
    if(typeof inventoryObj.sunkCost !== 'undefined') {
      $(item).find('.sunk-cost').html(inventoryObj.averagePrice);
    }
    i++;
  }
}

function submitTransaction(transaction, callback){
  $.ajax({
    type: 'POST', // Use POST with X-HTTP-Method-Override or a straight PUT if appropriate.
    dataType: 'json', // Set datatype - affects Accept header
    url: "/game/market/transaction", // A valid URL
    data: transaction
  }).done(function(result) {
    callback(result);
    var modal = $('#transaction-modal');
    modal.off('keypress');
    modal.modal('hide');
  }).fail(function(result) {
    displayAlert("danger", result.responseJSON.message);
    var modal = $('#transaction-modal');
    modal.off('keypress');
    modal.modal('hide');
  });
}

function resetModal(){
  $('#transaction-units').val("0");
}

function hideAllBtns(){
  $('#transaction-confirm-buy-btn').hide();
  $('#transaction-confirm-sell-btn').hide();
}

function resizeCards() {
  var maxHeight = -1;

  $('.card > .card-block').each(function(index, card) {
    $(card).height('');
    var currentHeight = $(card).height();

    if (currentHeight > maxHeight) {
      maxHeight = currentHeight;
    }
  });

  $('.card > .card-block').each(function(index, card) {
    $(card).height(maxHeight);
  });
}

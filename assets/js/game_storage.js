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
    $('#transaction-units').attr('max', units);
    $('#transaction-units-label').html("How many units would you like to " + type + "?");
    $('#transaction-confirm-message').html(titleType + "ing <strong id=\"transaction-units-msg\">0</strong> of this item will result in it being lost forever.  You will receive no money by doing this.");
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
    $('#transaction-units-msg').html(currentUnits);
  });

  $('#transaction-confirm-dump-btn').on('click', function(e){
    var transaction = {
      id: $(e.target).data('life-id'),
      type: "dump",
      item: $(e.target).data('id'),
      units: $('#transaction-units').val()
    };
    submitTransaction(transaction, function(result){
      if (result.error === false){
        updateUnits(result.result.life);
        displayAlert("success", "You have successfully dumped " + transaction.units + (transaction.units === 1 ? " unit" : " units"));
      }else{
        displayAlert("warning", "Oh no!  Something has gone wrong (" + result.message + ")");
      }
    });
  });
});

function updateUnits(life){
  // this is what you should use for updating all market status after getting
  // a life object back from the request
  updateHUD(life);
  $('#transaction-modal').data('available-storage', life.current.storage.available);
  // update units and prices for all item cards
  var i = 0;
  var inventory = life.current.inventory;
  while (i < inventory.length){
    var item = $('.transaction-listing[data-id="' + inventory[i].id + '"]');
    // update the amount on hand
    $(item).find('.transaction-listing-units').html(inventory[i].units);
    $(item).find('.transaction-dump-btn').data('units', inventory[i].units);
    i++;
  }
}

function submitTransaction(transaction, callback){
  $.ajax({
    type: 'DELETE',
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
  $('#transaction-confirm-dump-btn').hide();
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

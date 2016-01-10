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
    var confirmButton = null;
    if (type == "buy"){
      // they want to buy items
      confirmButton = $('#transaction-confirm-buy-btn');
    }else if (type == "sell"){
      // they want to sell items
      confirmButton = $('#transaction-confirm-sell-btn');
    }
    // make the button visible
    confirmButton.show();
    // start populating the button with data
    confirmButton.data('id', id);
    confirmButton.data('price', price);
    confirmButton.data('units', '0');
    $('#transaction-units').attr('max', units);
    $('#transaction-units').data('price', price);
    $('#transaction-units-label').html("How many units would you like to " + type + "? " + ((type == "buy") ? "They" : "You") + " have <strong>"
     + units + "</strong> in stock.");
    $('#transaction-confirm-message').html(titleType + "ing <strong id=\"transaction-units-msg\">0</strong> of this item will " + ((type == "buy") ? "cost" : "make") + " you <strong id=\"transaction-price-msg\">$0</strong>.");
  });

  $('#transaction-units').on('input', function(e){
    console.log("change");
    var currentUnits = $(event.target).val();
    var currentPrice = ($(event.target).data('price') * currentUnits).toFixed(2);
    $('#transaction-units-msg').html(currentUnits);
    $('#transaction-price-msg').html("$" + currentPrice);
  });
});

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

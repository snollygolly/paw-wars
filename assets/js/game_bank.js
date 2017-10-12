$( document ).ready(function() {

  $('#transaction-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    // setting all the values from the button
    var id = button.data('id');
    var type = button.data('type');
    var max = button.data('max');
    var friendlyType;
    var maxMessage;
    // get the modal object
    var modal = $(this);
    $('#transaction-amount').attr('max', Number(max));
    $('#transaction-all-btn').data('max', max);
    $('#transaction-amount').val(0);
    $('#transaction-amount-label').html("How much do you want to " + type + "?");
    switch (type){
      case "deposit":
        friendlyType = "Banking Transaction";
        maxMessage = "You currently have <strong>$" + max + "</strong> on you.";
        break;
      case "withdraw":
        friendlyType = "Banking Transaction";
        maxMessage = "You currently have <strong>$" + max + "</strong> in the bank.";
        break;
      case "repay":
        friendlyType = "Lending Transaction";
        maxMessage = "You currently have <strong>$" + max + "</strong> in the bank.";
        // the "max" here is actually the amount of the loan
        $('#transaction-all-btn').data('max', button.data('debt'));
        break;
      case "borrow":
        friendlyType = "Lending Transaction";
        maxMessage = "The bank will issue you a loan for up to  <strong>$" + max + "</strong>.";
        break;
    }
    // start populating it with values
    $('#transaction-title').html(friendlyType + ": " + type);
    // set the max and the message for it
    $('#transaction-confirm-message').html(maxMessage);
    var confirmButton = $('#transaction-confirm-btn');
    // start populating the button with data
    confirmButton.data('id', id);
    confirmButton.data('amount', 0);
    confirmButton.data('type', type);
    modal.on('keypress', function (e) {
      if (e.which == 13) {
        confirmButton.click();
        return false;
      }
    });
  });

  $('#transaction-all-btn').on('click', function(e) {
    var max = $(e.target).data('max');
    $('#transaction-amount').val(max);
  });

  $('#transaction-amount').on('input', function(e){
    var currentUnits = $(e.target).val();
    var currentPrice = ($(e.target).data('price') * currentUnits).toFixed(2);
  });

  $('#transaction-confirm-btn').on('click', function(e){
    var transaction = {
      id: $(e.target).data('id'),
      type: $(e.target).data('type'),
      amount: $('#transaction-amount').val()
    };
    var reqType;
    var endpoint;
    switch (transaction.type){
      case "deposit":
        reqType = "POST";
        endpoint = "/game/bank/savings";
        break;
      case "withdraw":
        reqType = "GET";
        endpoint = "/game/bank/savings";
        break;
      case "repay":
        reqType = "POST";
        endpoint = "/game/bank/loans";
        break;
      case "borrow":
        reqType = "GET";
        endpoint = "/game/bank/loans";
        break;
    }
    console.log("doing AJAX", reqType, endpoint);
    $.ajax({
      type: reqType, // Use POST with X-HTTP-Method-Override or a straight PUT if appropriate.
      dataType: 'json', // Set datatype - affects Accept header
      url: endpoint, // A valid URL
      data: transaction
    }).done(function(result) {
      if (result.error === false){
        updateDispay(result.life);
        displayAlert("success", "Your transaction was successful!");
      }else{
        displayAlert("warning", "Oh no!  Something has gone wrong (" + result.message + ")");
      }
      var modal = $('#transaction-modal');
      modal.off('keypress');
      modal.modal('hide');
    }).fail(function(result) {
      displayAlert("danger", "Oh no!  Something has gone terribly wrong (" + JSON.stringify(result, 2, null) + ")");
      var modal = $('#transaction-modal');
      modal.off('keypress');
      modal.modal('hide');
    });
  });
});

function updateDispay(life){
  // this is what you should use for updating all market status after getting
  // a life object back from the request
  // update the hud
  updateHUD(life);
  // update all the buttons with maxes
  $("#bank-deposit-btn").data("max",  life.current.finance.cash);
  $("#bank-withdraw-btn").data("max", life.current.finance.savings);
  $("#bank-repay-btn").data("max", life.current.finance.savings);
  $("#bank-savings-amount").html(life.current.finance.savings);
  $("#bank-debt-amount").html(life.current.finance.debt);
  $("#transaction-amount").val(0);
}

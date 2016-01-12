$( document ).ready(function() {

  $('#transport-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    // setting all the values from the button
    var id = button.data('id');
    var name = button.data('name');
    var city = button.data('city');
    var price = button.data('price');
    var flightNumber = button.data('flight-number');
    var flightTime = button.data('flight-time');
    var turnPlural = flightTime === "1" ? "turn" : "turns";
    // get the modal object
    var modal = $(this)
    // start populating it with values
    modal.find('#transport-title').text("Fly to " + city);
    var confirmButton = $('#transport-confirm-book-btn');
    // start populating the button with data
    confirmButton.data('id', id);
    confirmButton.data('price', price);
    $('#transport-confirm-destination').html(name);
    $('#transport-confirm-turns').html(flightTime + " " + turnPlural);
    $('#transport-confirm-price').html(price);
  });

  $('#transport-confirm-book-btn').on('click', function(e){
    var flight = {
      id: $(e.target).data('life-id'),
      destination: $(e.target).data('id')
    };
    $.ajax({
      type: 'POST', // Use POST with X-HTTP-Method-Override or a straight PUT if appropriate.
      dataType: 'json', // Set datatype - affects Accept header
      url: "/game/airport/fly", // A valid URL
      data: flight
    }).done(function(result) {
      if (result.error === false){
        // this should redirect
        window.location.replace("/game/hotel");
      }else{
        displayAlert("warning", "Oh no!  Something has gone wrong (" + result.message + ")");
      }
      $('#transaction-modal').modal('hide');
    }).fail(function(result) {
      displayAlert("danger", "Oh no!  Something has gone terribly wrong (" + JSON.stringify(result, 2, null) + ")");
      $('#transaction-modal').modal('hide');
    });
  });
});

function displayAlert(type, message){
  alert = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">';
  alert += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + message + '</div>';
  $("#alert-container").html(alert);
}

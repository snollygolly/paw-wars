$( document ).ready(function() {

	$('#vendor-modal').on('show.bs.modal', function (event) {
		console.log("vendor modal clicked");
		var button = $(event.relatedTarget);
		// setting all the values from the button
		var name = button.data('name');
		var index = button.data('index');
		var price = button.data('price');
		var vendor = button.data('vendor');
		// get the modal object
		var modal = $(this)
		// start populating it with values
		$('#vendor-title').text("Buy " + name);
		$('#vendor-confirm-message').html("Are you sure you want to buy <strong>" + name + "</strong> for <strong>$" + price + "</strong>?");
		var confirmButton = $('#vendor-confirm-buy-btn');
		// start populating the button with data
		confirmButton.data('name', name);
		confirmButton.data('index', index);
		confirmButton.data('price', price);
		confirmButton.data('vendor', vendor);
	});

	$('#vendor-confirm-buy-btn').on('click', function(e){
		var transaction = {
			id: $(e.target).data('life-id'),
			type: "buy",
			index: $(e.target).data('index'),
			vendor: $(e.target).data('vendor')
		};
		$.ajax({
			type: 'POST', // Use POST with X-HTTP-Method-Override or a straight PUT if appropriate.
			dataType: 'json', // Set datatype - affects Accept header
			url: "/game/vendors/transaction", // A valid URL
			data: transaction
		}).done(function(result) {
			if (result.error === false){
				updateHUD(result.result.life);
				updateListings(transaction);
				displayAlert("success", "You have successfully bought " + $(e.target).data('name'));
			}else{
				displayAlert("danger", result.responseJSON.message);
			}
			$('#vendor-modal').modal('hide');
		}).fail(function(result) {
			displayAlert("danger", result.responseJSON.message);
			$('#vendor-modal').modal('hide');
		});
	});
});

function updateListings(transaction) {
	var i = 0
	$(".list-group .vendor-" + transaction.vendor + "-listing").each(function(index) {
		if (i === transaction.index) {
			$(this).remove();
			// so the while doesn't trigger again
			transaction.index = -1;
		} else {
			$(this).data('index', i);
			i++;
		}
	});
}

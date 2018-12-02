$(document).ready(function() {
	var lifeID = $("#hud").data("id");
	var life;
	$.ajax({
		type: "GET",
		dataType: 'json',
		url: "/game/life",
		data: {id: lifeID}
	}).done(function(result) {
		if (result.error === true){
			return displayAlert("danger", result.responseJSON.message);
		}
		life = result.result.life;
		// when the document loads, first thing, refresh the encounter
		refreshEncounter(life);
	}).fail(function(result) {
		displayAlert("danger", result.responseJSON.message);
	});

  $(document).on("click", ".police-choice", function (e) {
    disableAll();
		console.log(life);
		var reason;
		if (life.current.police.encounter !== null) {
			reason = life.current.police.encounter.reason
		}
    if (life.alive === false || reason == "dead") {
      // they died
      window.location.replace("/game/over");
      return;
    }
    var selectedChoice = $(e.target).data("id");
    var action = {
      id: life.id,
      action: selectedChoice
    };
    $.ajax({
      type: 'POST', // Use POST with X-HTTP-Method-Override or a straight PUT if appropriate.
      dataType: 'json', // Set datatype - affects Accept header
      url: "/game/police/encounter", // A valid URL
      data: action
    }).done(function(result) {
      if (result.error === false){
        // this means everything worked out great
        life = result.result.life;
        if (life.current.police.encounter === null) {
          window.location.replace("/game/hotel");
        } else {
          refreshEncounter(life);
        }
      }else{
        displayAlert("danger", result.responseJSON.message);
        enableAll();
      }
    }).fail(function(result) {
      displayAlert("danger", result.responseJSON.message);
      enableAll();
    });
  });
});

function refreshEncounter(lifeObj) {
  updateHUD(lifeObj);
  emptyMessages();
  emptyChoices();
  populateMessage(lifeObj);
  populateChoices(lifeObj);
  enableAll();
}

function populateMessage(lifeObj) {
  var messageFull = "#police-messages-full";
  var messageSimple = "#police-messages-simple";
  // actually replace the messages
  $(messageFull).html(lifeObj.current.police.encounter.message.full);
  $(messageSimple).html(lifeObj.current.police.encounter.message.simple);
}

function populateChoices(lifeObj) {
  var choicesHTML = "";
  var i = 0;
  while (i < lifeObj.current.police.encounter.choices.length) {
    choicesHTML += "<button class='btn list-group-item police-choice' data-id='" + lifeObj.current.police.encounter.choices[i].id + "'>" + lifeObj.current.police.encounter.choices[i].full + "</button>";
    i++;
  }
  $("#police-choices-group").html(choicesHTML);
}

function emptyMessages() {
  $("#police-messages-full").html("");
  $("#police-messages-simple").html("");
}

function emptyChoices() {
  $("#police-choices-group").html("");
}

function disableAll() {
  $("#police-messages-full").addClass("text-muted");
  $("#police-messages-simple").addClass("text-muted");
  $(".police-choice").each(function() {
    $(this).prop("disabled", true);
  });
}

function enableAll() {
  $("#police-messages-full").removeClass("text-muted");
  $("#police-messages-simple").removeClass("text-muted");
  $(".police-choice").each(function() {
    $(this).prop("disabled", false);
  });
}

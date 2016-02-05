$( document ).ready(function() {
  try {
    life = JSON.parse(life);
  } catch (e) {
    console.err(e);
  }
  // when the document loads, first thing, grab all the parts

  populateMessage(life);
  populateChoices(life);
});

function populateMessage(lifeObj) {
  var messageFull = "#police-messages-full";
  var messageSimple = "#police-messages-simple";
  // actually replace the messages
  $(messageFull).html(lifeObj.current.police.encounter.message.full);
  $(messageSimple).html(lifeObj.current.police.encounter.message.simple);
}

function populateChoices(lifeObj) {
  emptyChoices();
  var choicesHTML = "";
  var choice = "<button class='list-group-item police-choice'></button>";
  var i = 0;
  while (i < lifeObj.current.police.encounter.choices.length) {
    choicesHTML += "<button class='list-group-item police-choice' data-id='" + lifeObj.current.police.encounter.choices[i].id + "'>" + lifeObj.current.police.encounter.choices[i].full + "</button>";
    i++;
  }
  $("#police-choices-group").html(choicesHTML);
}

function emptyChoices() {
  $("#police-choices-group").html("");
}

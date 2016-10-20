Template.instructionView.onCreated(function(){
  this.wordCount = new ReactiveVar(0);
  if(Router.current().params.query.spaceId){
    var spaceId = Router.current().params.query.spaceId
    Meteor.subscribe('ParkingSpacesByID', spaceId)
  }
});

Template.instructionView.onRendered(function(){
  if(Router.current().params.query.spaceId){
		var currentSpace = ParkingSpaces.findOne({_id: Router.current().params.query.spaceId});
		$('#instructionText').val(currentSpace.instructions);
    if(currentSpace.presetInstructions){
      _.forEach(currentSpace.presetInstructions, function(element, index, list){
        $('input[type="checkbox"][value=' + element + ']').prop('checked', true);
      })
    } else {
      $('input[type="checkbox"][value=0]').prop('checked', true);
    }
	} else {
    $('input[type="checkbox"][value=0]').prop('checked', true);
  }
});


Template.instructionView.events({
  'change input#notSetRadio': function(event, template){
    if(event.target.checked){
      _.forEach($('input.instructionRadio'), function(element, index, list){
        element.checked = false;
      });
    }
  },
  'change input.instructionRadio': function(event, template){
    // console.log('clicked');
    if($('input.instructionRadio:checked').length == 0){
      $('#notSetRadio')[0].checked = true;
    } else {
      $('#notSetRadio')[0].checked = false;
    }
    // console.log(event.target);
    if($('input.instructionRadio:checked').length > 3){
      event.target.checked = false;
    }
  },
  'keyup .textarea-input': function(event, template) {
    // console.log(event.target.value);
    if (event.target.value !== "") {
      // var words = event.target.value.match(/\S+/g).length;
      var chars = event.target.value.length;
      // console.log(words);

      // if (words > 50) {
      //   // event.preventDefault();
      //   if (event.which !== 8) event.preventDefault();
      //   // Split the string on first 200 words and rejoin on spaces
      //   // var trimmed = $('.textarea-input').val().split(/\s+/, 50).join(" ");
      //   // Add a space at the end to make sure more typing creates new words
      //   // $('.textarea-input').val(trimmed + " ");
      //   template.wordCount.set(50);
      // } else {
      //   template.wordCount.set(words);
      // }

      template.wordCount.set(chars);
    } else {
      template.wordCount.set(0);
    }

    // var instructionsStr = event.target.value.split(/(\b[\s,\.-:;]*)/, 50 * 2).join("");
    // var instructionsStr = event.target.value;
    // Session.set('instructions_value', event.target.value);
    // Session.set('instructions_value', instructionsStr);
  }
});

Template.instructionView.helpers({
  wordLeftCount: function() {
    var words = Template.instance().wordCount.get();
    return 200-words;
  },
  Next: function(){
    if(Router.current().params.query.edit){
      return 'Save';
    } else {
      return 'Next';
    }
  }

});

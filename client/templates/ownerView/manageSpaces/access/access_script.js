Template.access.helpers({
	});

Template.access.events({
	'click input#groupAccess': function(event, template){
		if(event.target.checked){
			$('#2parkGroup').addClass('checked');
		} else {
			$('#2parkGroup').removeClass('checked');
		}
	},
	'click .custom-groups-edit': function(event, template){
		var accessSelected = {};
    accessSelected.everyone = $('#everyoneAccess')[0].checked;
    accessSelected.groups = [false, false, false];
    if($('#groupAccess')[0].checked){
      if($('input#evOnly')[0].checked){
        accessSelected.groups[0] = true;
      }
      if($('input#disabledOnly')[0].checked){
        accessSelected.groups[1] = true;
      }
      if($('input#landRover')[0].checked){
        accessSelected.groups[2] = true;
      }
    }

    Session.set('accessSelected', accessSelected);
		Router.go('/customGroup/' + Router.current().params._id);
	}
});

Template.access.onRendered(function ( ){
	var accessSelected = Session.get('accessSelected');
	console.log(accessSelected);
	if(accessSelected){
		if(accessSelected.everyone){
			$('#everyoneAccess')[0].checked = true;
		}
		_.forEach(accessSelected.groups, function(element, index, list){
			console.log(element);
			if(element){
				$('#groupAccess')[0].checked = true;
				$('#2parkGroup').addClass('checked');
				if(index == 0){
					$('#evOnly')[0].checked = true;
				} else if(index == 1){
					$('#disabledOnly')[0].checked = true;
				} else if(index == 2){
					$('#landRover')[0].checked = true;
				}
			}
		})
	} else {
		var spaceId = Router.current().params._id;
		var currentSpace = ParkingSpaces.findOne({_id: spaceId});
		if(currentSpace.access){
			if(currentSpace.access.everyone){
				$('#everyoneAccess')[0].checked = true;
			}
			_.forEach(currentSpace.access.groups, function(element, index, list){
				if(element){
					$('#groupAccess')[0].checked = true;
					$('#2parkGroup').addClass('checked');
					if(index == 0){
						$('#evOnly')[0].checked = true;
					} else if(index == 0){
						$('#disabledOnly')[0].checked = true;
					} else if(index == 0){
						$('#landRover')[0].checked = true;
					}
				}
			})
		}
	}
})

//App Login Routes

Router.route('/', {
  name: 'loginMain',
  data: function() {
    //return {'venues': Venues.find({}) };
  },
  waitOn: function() {
    // return Meteor.subscribe('Venues');
  }
});

Router.route('/accountSignup', {
  name: 'accountSignup',
  subscriptions: function() {
    Meteor.subscribe("ownProfile");
  }
});

Router.route('/forgotPassword', {
  name: 'forgotPassword'
});

Router.route('/reset-password/:token', {
  name: 'resetPassword'
});

Router.route('/testing', {
  name: 'testing'
});

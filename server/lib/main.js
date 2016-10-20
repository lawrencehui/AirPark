Meteor.startup(function(){
  // try{
      brainTree = BrainTreeConnect({
        //If you set an ENV variable for PRODUCTION you can dynamically change out sandbox and production
        // environment: process.env.PRODUCTION && Braintree.Environment.Production || Braintree.Environment.Sandbox,
        environment: Braintree.Environment[Meteor.settings.private.BRAIN_TREE.ENVIRONMENT],
        merchantId: Meteor.settings.private.BRAIN_TREE.MERCHANT_ID,
        publicKey:  Meteor.settings.private.BRAIN_TREE.PUBLIC_KEY,
        privateKey: Meteor.settings.private.BRAIN_TREE.PRIVATE_KEY
      });
      // return bt.customer.create(config);
  // } catch(error){
      // throw new Meteor.Error(1001, error.message);
  // }
});

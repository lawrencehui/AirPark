payoutSchema = new SimpleSchema({
  requestedAt: {
    type: Number
  },
  paidAt: {
    type: Number,
    optional: true
  },
  account: {
    type: Object
  },
  "account.name": {
    type: String,
    // optional: true
  },
  "account.branchLocation": {
    type: String,
    optional: true
  },
  "account.payee": {
    type: String,
    // optional: true
  },
  "account.bankCode": {
    type: String,
    // optional: true
  },
  "account.accountNo": {
    type: String,
    // optional: true
  },
  userId: {
    type: String
  },
  amount: {
    type: Number
  }

})

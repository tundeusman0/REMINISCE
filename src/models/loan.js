const mongoose = require("mongoose")
let Schema = mongoose.Schema;

let LoanSchema = new Schema({
    email: {
        type: String,
    },
    request: {
        type: String
    },
    loanType: {
        type: String,
    },
    reason: {
        type: String,
    },
    amount: {
        type: Number,
    },
    street: {
        type: String,
    },
    state: {
        type: String,
    },
    town: {
        type: String,
    },
    lga: {
        type: String,
    },
    lived: {
        type: String,
    }, 
    bankName: {
        type: String,
    },
    bankAcc: {
        type: Number,
    }, 
    monthIncome: {
        type: Number,
    }, 
    loanId: {
        type: String,
    }, 
    givenLoan: {
        type: String,
    },
    userId: {
        type: String,
    },
    payment: {
        type: String,
    },
    loanName:{
        type: String
    },
    transferNumber: {
        type: String,
    },
    accepted: {
        type: String,
    },
    paymentDate:{
        type: String
    },
    status:{
        type: String
    }

})


let Loan = mongoose.model('Loan', LoanSchema);

module.exports = { Loan }

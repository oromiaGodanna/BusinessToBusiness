

const Payment = mongoose.model('Payment', new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
    orderId: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    amountPaid: {
        type: Number,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    buyerStripeId: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    sellerStripeId: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    stripeObject: {
        type: Object,
        required: true,
        minlength: 5,
        maxlength: 50
    }
    
    

}))

function validatePayment(){

}

exports.Order = Order;
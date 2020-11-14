

var PromotionSocket = function (io, socket) {
    this.io = io;
    this.socket = socket;

    // Expose handler methods for events
    this.handler = {
        promotion: promotion.bind(this), // use the bind function to access this.io   // and this.socket in events
    };
}

// Events

async function promotion(promotion) {

    // create a promotion
    // const newpromotion = await createPromotion(promotion);

    // newpromotion.recipients.forEach(recipientId => {
    //     this.io.to(recipientId).emit('new promotion', newpromotion);
    // });


};


module.exports = PromotionSocket;
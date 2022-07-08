const mongoose = require('mongoose')
const Schema = mongoose.Schema

const couponSchema = new Schema({
    offerName: { type: String },

    couponCode: { type: String, unique: true },

    startDate: { type: String },

    endDate: { type: String },

    discount: { type: Number },

    amount: { type: Number },

    status: { type: Boolean, default: false }

})


const coupon = mongoose.model('coupon', couponSchema)
module.exports = coupon
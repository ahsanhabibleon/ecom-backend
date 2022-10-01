import mongoose from "mongoose";

const PaymentModel = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: false },
        address: { type: String, required: true },
        price: { type: Number, required: true },
        country: { type: String, required: true },
    },
    {
        timestamps: true
    }
)

const Payment = mongoose.model('Payment', PaymentModel);

export default Payment


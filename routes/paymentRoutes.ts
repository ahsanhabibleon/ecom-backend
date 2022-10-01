import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Payment from '../models/paymentModel';
import uuid from 'uuid'

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-08-01',
    typescript: true,
});

const paymentRoutes = express.Router();

paymentRoutes.post('/', expressAsyncHandler(async (req, res) => {
    console.log({ body: req.body.order.shippingAddress })
    const newPayment = new Payment({
        id: req?.body?.order?._id,
        name: req?.body?.order?.shippingAddress?.name || '',
        phone: req?.body?.order?.shippingAddress?.phone || '',
        email: req?.body?.order?.shippingAddress?.email || '',
        address: req?.body?.order?.shippingAddress?.address || '',
        price: req?.body?.order?.totalPrice || '',
        country: req?.body?.order?.shippingAddress?.country_of_residence || '',
    })

    const payment = await newPayment.save();
    // res.status(201).send({ message: 'New payment created.', payment })
    return stripe.customers.create({
        email: payment.email,
        source: payment.id
    }).then((customer) => {
        stripe.charges.create({
            amount: payment.price,
            currency: 'usd',
            customer: payment.id,
            receipt_email: payment.email
        }, { idempotencyKey: uuid() })
    }).then((result) => res.status(201).send({ message: 'New payment created.', result }))

}))


export default paymentRoutes
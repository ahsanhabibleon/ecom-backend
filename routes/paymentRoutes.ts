import express from 'express';
// import expressAsyncHandler from 'express-async-handler';
import Payment from '../models/paymentModel';

import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51K57zmEftUPQhn8n7H2S9mfD1rc9A8NGyrA1tvtHMihIT3VDIW25JrwgIngEUd5rDgRPXyXOO3a2lL30u08FQleL00Ftm6ZH8e', {
    apiVersion: '2022-08-01',
    typescript: true,

});

const paymentRoutes = express.Router();

paymentRoutes.post('/', async (req, res) => {
    console.log({ body: req.body.order.shippingAddress })
    const newPayment = new Payment({
        id: req?.body?.order?.user,
        name: req?.body?.order?.shippingAddress?.name || '',
        phone: req?.body?.order?.shippingAddress?.phone || '',
        email: req?.body?.order?.shippingAddress?.email || '',
        address: req?.body?.order?.shippingAddress?.street || '',
        price: req?.body?.order?.totalPrice || '',
        country: req?.body?.order?.shippingAddress?.country_of_residence || '',
    })

    const payment = await newPayment.save();

    // Create a PaymentIntent with the order amount and currency

    await stripe.paymentIntents.create({
        amount: 5000,
        currency: "usd",
        // customer: req?.body?.order?.user,
        receipt_email: 'ahsan.h.86@gmail.com',
        shipping: {
            name: 'Gulu',
            address: {
                country: 'BD',
            }
        },
        automatic_payment_methods: {
            enabled: true,
        },
    },
        // { idempotencyKey: uuid() }
    ).then(result => {
        console.log('here')
        res.status(201).send({
            clientSecret: result.client_secret,
        });
    }).catch(error => {
        console.log({ error })
    }).finally(() => {
        console.log('final')
    })


})


export default paymentRoutes
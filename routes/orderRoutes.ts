import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel";
import { isAuth } from "../utils";

const orderRoutes = express.Router();

type ItemTypes = any;

orderRoutes.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderedItems: req.body.orderedItems.map((x: ItemTypes) => ({
        ...x,
        product: x._id,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      shippingPrice: req.body.shippingPrice,
      itemsPrice: req.body.itemsPrice,
      totalPrice: req.body.totalPrice,
      taxPrice: req.body.taxPrice,
      // @ts-ignore
      user: req?.user?._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: "New order created.", order });
  })
);

orderRoutes.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ messege: "Order not found!" });
    }
  })
);

orderRoutes.get("/", isAuth, async (req, res) => {
  const orders = await Order.find();
  res.send(orders);
});

export default orderRoutes;

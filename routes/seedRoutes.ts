import express from 'express';
import data from '../data2';
import Product from '../models/productModel';
import User from '../models/userModel';

const seedRouter = express.Router();
seedRouter.get('/', async (req, res) => {
    //products
    await Product.deleteMany({})
    const createdProducts = await Product.insertMany(data.products);

    //users
    await User.deleteMany({})
    const createdUsers = await User.insertMany(data.users);

    //send data
    res.send({ createdProducts, createdUsers })
})

export default seedRouter
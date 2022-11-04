import express, { Express, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes';
import productRouter from './routes/productRoutes';
import userRouter from './routes/userRoutes';
import orderRouter from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import cors from 'cors';

dotenv.config();
const port = process.env.PORT;

//create express server
const app: Express = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));


app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/payment', paymentRoutes)

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     res.status(500).send({ message: err.message })
// })

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }

    next();
});

app.get('/api/keys/paypal', (req, res) => {
    res.send(process?.env?.PAYPAL_CLIENT_ID || 'sb');
})


app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});



//connect to mongodb
const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI || '');
}

connectDB().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));

// process.once('SIGUSR2',
//     function () {
//         process.kill(process.pid, 'SIGUSR2');
//     }
// );
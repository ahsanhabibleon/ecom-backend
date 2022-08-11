import express, { Express, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes';
import productRouter from './routes/productRoutes';
import userRouter from './routes/userRoutes';

dotenv.config();
const port = process.env.PORT;

//create express server
const app: Express = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send({ message: err.message })
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
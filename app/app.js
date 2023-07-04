import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from '../routes/userRoute.js';
import dbConnect from "../config/dbConnect.js";
import Stripe from "stripe";
import { globalErrhandler,notFound } from '../middlewares/globalErrhandler.js';
import productRouter from '../routes/productRoute.js';
import categoriesRouter from '../routes/categoriesRouter.js';
import brandsRouter from '../routes/brandsRouter.js';
import colorRouter from '../routes/colorsRouter.js';
import orderRouter from '../routes/ordersRouter.js';
import Order from '../model/Order.js';
import couponsRouter from '../routes/couponsRouter.js';
import cors from 'cors';
dbConnect();
const app = express();
// stripe webhook
//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_c1c4fff9a03daa9ba57da2b7e0310c471dae7cd77d126482335768d85920df42";

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
    if (event.type === "checkout.session.completed") {
      //update the order
      // Handle the event
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      //find the order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        {
          new: true,
        }
      );
      //console.log(order);
    } else {
      return;
    }
  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
// Enable CORS and allow requests from all origins
app.use(cors({ origin: '*' }));
//pass incoming data
app.use(express.json());

// routes
app.use("/api/v1/users/",userRoutes)
app.use("/api/v1/products/",productRouter)
app.use("/api/v1/categories/",categoriesRouter)
app.use("/api/v1/brands/",brandsRouter)
app.use("/api/v1/colors/",colorRouter)
app.use("/api/v1/orders/",orderRouter)
app.use("/api/v1/coupons/",couponsRouter)



//error handler middleware
app.use(notFound);
app.use(globalErrhandler);
export default app;
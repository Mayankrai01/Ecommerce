import mongoose from "mongoose";
const Schema = mongoose.Schema;
//Generate random number for order
const randomTxt = Math.random().toString(36).substring(7).toLocaleLowerCase();
const randomNumbers = Math.floor(1000+Math.random()*90000);
const OrderSchema = new Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    orderItems:[
        {
            type:Object,
            required:true,
        }
    ],
    shippingAddress:{
        type:Object,
        required:true,
    },
    OrderNumber:{
        type:String,
        //required:true,
        default:randomNumbers+randomTxt
    },
    // for stripe payments
    paymentStatus:{
        type:String,
        //required:true,
        default:"Not Paid"
    },
    paymentMethod:{
        type:String,
        //required:true,
        default:"Not Specified"
    },
    totalPrice:{
        type:Number,
        default: 0.0
    },
    currency:{
        type:String,
        default:"Not Specified"
    },
    // to be used by admin
    status:{
        type:String,
        default:"pending",
        enum:['pending','processing','shipped','delivered'],
    },
    deliveredAt:{
        type:Date,
    },
},{
    timestamps:true,
}
);

// compile to form model
const Order = mongoose.model('Order',OrderSchema);
export default Order;
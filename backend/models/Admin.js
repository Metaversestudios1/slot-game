const mongoose =require('mongoose')

const AdminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String
    },
    contact: { type: String, required: true },

    status:{
        type:Number,
        default:1,
    },
} ,{ timestamps: true, collection: "admin" });

module.exports= mongoose.model("Admin",AdminSchema);
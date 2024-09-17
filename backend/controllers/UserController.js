const User = require('../models/User');
const bcrypt = require('bcrypt');
const insertuser = async (req, res) => {
    const { password, ...userData } = req.body;
    try {
      // Check for required fields
      if (!password || !userData.username) {
        return res.status(401).json({ success: false, message: "Please provide all fields" });
      }
  
      // Password length validation
      if (password.length < 4) {
        return res.status(401).json({
          success: false,
          message: "Password must contain a minimum of 4 digits",
        });
      }
  
      let u_id = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number
      const existingUser = await User.findOne({ u_id });
      while (existingUser) {
        u_id = Math.floor(1000 + Math.random() * 9000); // Regenerate if not unique
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        ...userData,
        u_id,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error inserting user", error: err.message });
    }
  };

  const updateuser = async(req,res)=>{
    const updatedata = req.body;
    const id = updatedata.id;
    try{
        const result = await User.updateOne(
            {_id:id},
            { $set :updatedata.oldData}
        );
        if(!result){
            res.status(404).json({success:false,message:"user not found"});
        }
        res.status(201).json({ success: true, result: result });
    }catch(err){
        res.status(500).json({success:false,message:"error in updating the user",error:err.message});

    }
  }

  const userlogin = async(req,res)=>{
    const {email, password}= req.body;
    try{

        if(!email|| !password){
            return res.status(404).json({sucess:false,message:"please provide all fields"});
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({sucess:false,message:"user not found"});
        }
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(404).json({sucess:false,message:"Password does not match"});
        }
        const token = jwt.sign(
            {id:user._id,username:user.email},
            process.env.JWT_SECRET,
            {expiresIn:"1h"},     
        )

        const options = {
            expires : new Date(Date.now() + 2592000000),
            httpOnly:true,
            sameSite: "None",
        }
        res.cookie("token",token,options).json({
            success:true,
            token,
            user
        });
    }catch(err){
        res.status(500).json({ success: false, message: "Server error: " + err.message });
    }

}

const getAlluser = async (req,res) => {
    try{
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const search = req.query.search;

        const query = {
            deleted_at: null,
        };
        if (search) {
            query.username = { $regex: search, $options: "i" };
        }

        const result = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await User.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    }catch(error){
        res.status(500).json({success:false,message:"error inserting user"});
     }
}
const getSingleuser = async(req, res) => {
    const { id } = req.body;
    try {

        const result = await User.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "user not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching user" });
    }
}

const deleteuser = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await User.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "user not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching user" });
    }
}
const userlogout= async(req,res)=>{
   
        res.clearCookie("connect.sid"); // Name of the session ID cookie
        res.clearCookie("token"); // Name of the session ID cookie
        res.status(200).json({ status: true, message: "Successfully logged out" });

}
  
module.exports= {
    insertuser,
    updateuser,
    userlogin,
    getAlluser,
    getSingleuser,
    deleteuser,
    userlogout
}
const Bet = require('../models/Bet');
const bcrypt = require('bcrypt');
const insertbet = async (req, res) => {    
    try {
        const newbet = new Bet(req.body);
        await newbet.save();
    } catch (err) {
      res.status(500).json({ success: false, message: "Error inserting bet", error: err.message });
    }
  };

  const updatebet = async(req,res)=>{
    const updatedata = req.body;
    const id = updatedata.id;
    try{
        const result = await Bet.updateOne(
            {_id:id},
            { $set :updatedata.oldData}
        );
        if(!result){
            res.status(404).json({success:false,message:"bet not found"});
        }
        res.status(201).json({ success: true, result: result });
    }catch(err){
        res.status(500).json({success:false,message:"error in updating the bet",error:err.message});

    }
  }



const getAllbet = async (req,res) => {
    try{
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const search = req.query.search;

        const query = {
            deleted_at: null,
        };
        if (search) {
            query.bet_level = { $regex: search, $options: "i" };
        }

        const result = await Bet.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await Bet.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    }catch(error){
        res.status(500).json({success:false,message:"error inserting bet"});
     }
}
const getSinglebet = async(req, res) => {
    const { id } = req.body;
    try {

        const result = await Bet.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "bet not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching bet" });
    }
}

const deletebet = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await Bet.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "bet not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching bet" });
    }
}  
module.exports= {
    insertbet,
    updatebet,
    getAllbet,
    getSinglebet,
    deletebet,
  
}
const Symbol = require('../models/Symbols');
const bcrypt = require('bcrypt');
const insertsymbol = async (req, res) => {    
    try {
        const newsymbol = new Symbol(req.body);
        await newsymbol.save();
    } catch (err) {
      res.status(500).json({ success: false, message: "Error inserting Symbol", error: err.message });
    }
  };

  const updatesymbol = async(req,res)=>{
    const updatedata = req.body;
    const id = updatedata.id;
    try{
        const result = await Symbol.updateOne(
            {_id:id},
            { $set :updatedata.oldData}
        );
        if(!result){
            res.status(404).json({success:false,message:"Symbol not found"});
        }
        res.status(201).json({ success: true, result: result });
    }catch(err){
        res.status(500).json({success:false,message:"error in updating the Symbol",error:err.message});

    }
  }



const getAllsymbol = async (req,res) => {
    try{
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const search = req.query.search;

        const query = {
            deleted_at: null,
        };
        if (search) {
            query.symbol_name = { $regex: search, $options: "i" };
        }

        const result = await Symbol.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await Symbol.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    }catch(error){
        res.status(500).json({success:false,message:"error inserting Symbol"});
     }
}
const getSinglesymbol = async(req, res) => {
    const { id } = req.body;
    try {

        const result = await Symbol.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "Symbol not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching Symbol" });
    }
}

const deletesymbol = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await Symbol.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "Symbol not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching symbol" });
    }
}  
module.exports= {
    insertsymbol,
    updatesymbol,
    getAllsymbol,
    getSinglesymbol,
    deletesymbol,
  
}
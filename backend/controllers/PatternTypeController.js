const PatternType = require('../models/PatternType');
const bcrypt = require('bcrypt');
const insertpatterntype = async (req, res) => {    
    try {
        const newpatterntype = new PatternType(req.body);
        await newpatterntype.save();
        res.status(201).json({ success: true })
    } catch (err) {
      res.status(500).json({ success: false, message: "Error inserting PatternType", error: err.message });
    }
  };

  const updatepatterntype = async(req,res)=>{
    const updatedata = req.body;
    const id = updatedata.id;
    try{
        const result = await PatternType.updateOne(
            {_id:id},
            { $set :updatedata.oldData}
        );
        if(!result){
            res.status(404).json({success:false,message:"PatternType not found"});
        }
        res.status(201).json({ success: true, result: result });
    }catch(err){
        res.status(500).json({success:false,message:"error in updating the PatternType",error:err.message});

    }
  }



const getAllpatterntype = async (req,res) => {
    try{
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const search = req.query.search;

        const query = {
            deleted_at: null,
        };
        if (search) {
            query.patterntype = { $regex: search, $options: "i" };
        }

        const result = await PatternType.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await PatternType.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    }catch(error){
        res.status(500).json({success:false,message:"error inserting PatternType"});
     }
}
const getSinglepatterntype = async(req, res) => {
    const { id } = req.body;
    try {

        const result = await PatternType.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "PatternType not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching PatternType" });
    }
}

const deletepatterntype = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await PatternType.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "PatternType not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching PatternType" });
    }
}  
module.exports= {
    insertpatterntype,
    updatepatterntype,
    getAllpatterntype,
    getSinglepatterntype,
    deletepatterntype,
  
}
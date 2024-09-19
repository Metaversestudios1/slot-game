const Pattern = require('../models/Pattern');
const Symbol = require('../models/Symbols');

const bcrypt = require('bcrypt');
const insertpattern = async (req, res) => {

    try {
        const symbolArrays = req.body.symbol; // Array of arrays, e.g. [ ['66ead1653ef9956473db406d'], ['66ec13fb793ba20e5d3a02ee'] ]
    
        const symbolIds = symbolArrays.flat();
        const symbols = await Symbol.find({ _id: { $in: symbolIds } });       
        if (!symbols || symbols.length === 0) {
            throw new Error('Symbols not found');
        }
        let totalWinAmount = 0;
        symbols.forEach(symbol => {
            totalWinAmount += symbol.win_amount;  // Add each win_amount to totalWinAmount
        });
        const newsymbol = new Pattern({ ...req.body, win_amount:totalWinAmount });
        await newsymbol.save();
        res.status(201).json({ success: true })
    } catch (err) {
        res.status(500).json({ success: false, message: "Error inserting Pattern", error: err.message });
    }
};

const updatepattern = async (req, res) => {
    const updatedata = req.body;
    const id = updatedata.id;
    try {
        const symbolArrays = updatedata.oldData.symbol; // Array of arrays, e.g. [ ['66ead1653ef9956473db406d'], ['66ec13fb793ba20e5d3a02ee'] ]
        const symbolIds = symbolArrays.flat();
        const symbols = await Symbol.find({ _id: { $in: symbolIds } });       
        if (!symbols || symbols.length === 0) {
            throw new Error('Symbols not found');
        }
        let totalWinAmount = 0;
        symbols.forEach(symbol => {
            totalWinAmount += symbol.win_amount;  // Add each win_amount to totalWinAmount
        });
        //const newsymbol = new Pattern({ ...req.body, win_amount:totalWinAmount });
        const result = await Pattern.updateOne(
            { _id: id },
            
            { $set: {
                ...updatedata.oldData ,
                win_amount:totalWinAmount
            }
            }
        );
        if (!result) {
            res.status(404).json({ success: false, message: "Pattern not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (err) {
        res.status(500).json({ success: false, message: "error in updating the Pattern", error: err.message });

    }
}



const getAllpattern = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const search = req.query.search;

        const query = {
            deleted_at: null,
        };
        if (search) {
            query.symbol_name = { $regex: search, $options: "i" };
        }

        const result = await Pattern.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await Pattern.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    } catch (error) {
        res.status(500).json({ success: false, message: "error inserting Pattern" });
    }
}
const getSinglepattern = async (req, res) => {
    const { id } = req.body;
    try {
        const result = await Pattern.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "Pattern not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching Pattern" });
    }
}

const deletepattern = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Pattern.findByIdAndUpdate(
            id,
            { deleted_at: new Date() },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ success: false, message: "Pattern not found" });
        }
        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching symbol" });
    }
}
module.exports = {
    insertpattern,
    updatepattern,
    getAllpattern,
    getSinglepattern,
    deletepattern,

}
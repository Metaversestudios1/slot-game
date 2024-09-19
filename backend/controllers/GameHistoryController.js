const GameHistory = require('../models/GameHistory');
const bcrypt = require('bcrypt');
const insertgamehistory = async (req, res) => {
    try {
        const newhistory = new GameHistory(req.body);
        await newhistory.save();
        res.status(201).json({ success: true })
    } catch (err) {
        res.status(500).json({ success: false, message: "Error inserting game history", error: err.message });

    }
}

const updategamehistory = async (req, res) => {
    const updatedata = req.body;
    const id = updatedata.id;
    try {
        const result = await GameHistory.updateOne(
            { _id: id },
            { $set: updatedata.oldData }
        );
        if (!result) {
            res.status(4040).json({ success: false, message: "histroy not found related with game id" })
        }

        res.status(201).json({ success: true });

    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating game history", error: err.message });

    }
}

const getAllgamehistory = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const search = req.query.search;
        const query = {
            deleted_at: null,
        };
        if (search) {
            query.game_id = { $regex: search, option: "i" };
        }
        const result = await GameHistory.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await GameHistory.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });
    } catch (err) {
        res.status(500).json({ success: false, message: "error fetching game history" });

    }
}

const getSinglegamehistory = async (req, res) => {
    const { id } = req.body;
    try {
        const result = await GameHistory.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "game history not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching game history" });
    }
}

const deletegamehistory = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await GameHistory.findByIdAndUpdate(
            id,
            { deleted_at: new Date() },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ success: false, message: "game history not found" });
        }
        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching game history" });
    }
}
module.exports = {
    insertgamehistory,
    updategamehistory,
    getAllgamehistory,
    getSinglegamehistory,
    deletegamehistory,

}
const mongoose = require('mongoose');
const PatternTypeSchema = new mongoose.Schema({
    symbol_count: {
        type: Number,
        required: true,
    },
    pattern_id: {
        type: Number,
        unique:true //it is started from 1 to increment in every insert
    }, 
    patternType: {
        type: String,  
    },  
    combination_count: {
        type: String,
    },
    status: {
        type: String,
        enum: ['0', '1'],  
        default: '1',            
    },
    deleted_at: {
        type: Date,
        default: null,
      },
}, { timestamps: true, collection: "patterntype" });

module.exports = mongoose.model('PatternType', PatternTypeSchema);


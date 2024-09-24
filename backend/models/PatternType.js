const mongoose = require('mongoose');
const PatternTypeSchema = new mongoose.Schema({
    symbol_count: {
        type: Number,//symbol _id from symbol table
        required: true,
    },
    pattern_id: {
        type: String,//symbol _id from symbol table
        unique: true,
    },
    patterntype: {
        type: String,  // e.g., description about pattern 
    },  
    combination_count: {
        type: String,//e.g., 'horizontal', 'diagonal', 'both')
    },
    status: {
        type: String,
        enum: ['0', '1'],  // Field to track if the pattern is active or inactive
        default: '1',             // Default value
    },
    deleted_at: {
        type: Date,
        default: null,
      },
}, { timestamps: true, collection: "patterntype" });

module.exports = mongoose.model('PatternType', PatternTypeSchema);


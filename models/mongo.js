const mongoose = require('mongoose')
const ccSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        uppercase:true
    
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type:String,
        required: true,
        lowercase: true,
        enum: ['fashion','grocery','electronics']
    }

})

const mongoModel = mongoose.model('mongoModel', ccSchema)
module.exports = mongoModel;
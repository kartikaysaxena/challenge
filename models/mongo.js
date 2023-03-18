const mongoose = require('mongoose')
const ccSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        uppercase:true
    
    },
    annotation: {
        type: [String],

       uppercase:true
    },
    size: {
        type:[String],

        lowercase: true,
        enum: ['small','medium','large']
    },
    date: {
        type: [String]
    }

})

const mongoModel = mongoose.model('mongoModel', ccSchema)
module.exports = mongoModel;
const mongoose = require('mongoose')

const StorageScheme = new mongoose.Schema(
    {
        filename: {
            type: String
        },
        url: {
            type: String,   
            unique: true
        }
    },
    {
        timestamp: true,
        versionKey: false
    }
)

module.exports = mongoose.model('storage', StorageScheme) 
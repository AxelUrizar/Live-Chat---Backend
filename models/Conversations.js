const mongoose = require('mongoose')
const ConversationsSchema = new mongoose.Schema({
    users: {
        type:[String],
        required: true
    },
    messages: {
        type: [String]
    }
})

module.exports = mongoose.model('Conversation', ConversationsSchema)
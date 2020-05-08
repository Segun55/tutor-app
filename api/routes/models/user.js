const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: string, 
        required: true, 
        unique: true, },
        // regular expression for emails.. 
    password: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);
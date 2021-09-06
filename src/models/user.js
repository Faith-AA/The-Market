const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: String, // USER ID // UNIQUE IN DISCORD
    tag: String,
    cash: String,
    stocks: Array,
    job: String,
    job_in_shift: String,
    job_shift_cooldown: String,
    job_find_cooldown: String,
    has_computer: Boolean,
    has_phone: Boolean,
    beg_cooldown: String,
});

module.exports = mongoose.model('user', userSchema);
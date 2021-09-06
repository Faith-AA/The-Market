const Discord = require('discord.js');
const { config } = require("dotenv");
const { Client } = require("iexjs");

// Schemas
const userSchema = require("./models/user")

// execute dotenv
config();

// start the IEX API client
const client = new Client({api_token: process.env.IEX_API_KEY, version: "v1"});

// check database function
async function userInDatabase(id, name) {
    // gather user data
    const userData = await userSchema.findOne({
        _id: id
    });

    // analyze data
    if (!userData) {
        return false;
    } else {
        // update name if changed
        if (userData.tag != name) {
            await updateDatabase(id, "tag", name)
        }
        return true;
    }
}

// get user from database
async function getUser(id) {
    // gather user data
    const userData = await userSchema.findOne({
        _id: id
    });

    // analyze data
    if (userData) {
        return userData;
    } else {
        return false;
    }
}

// function that adds a user to the database
async function addUser(id, name) {
    await new userSchema({
        _id: id,
        tag: name,
        cash: "5000",
        stocks: [],
        job: "",
        job_in_shift: "",
        job_shift_cooldown: "",
        job_find_cooldown: "",
        has_computer: true,
        has_phone: false,  
        beg_cooldown: ""
    }).save();
    return;
}

// function that retrieves all the IEX info
function IEX_API_DATA(symbol) {
    return client.quote(symbol, "1m");
}

// function that updats the database
async function updateDatabase(id, key, value) {
    await userSchema.findOneAndUpdate(
        {
            _id: id,
        },
        {
            [key]: value
        }
    );
    return;
}

async function leaderboardData() {
    return await userSchema.find({});
}

module.exports = {
    userInDatabase,
    addUser,
    IEX_API_DATA,
    getUser,
    updateDatabase,
    leaderboardData
}
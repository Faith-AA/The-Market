const { Listener } = require("discord-akairo");
const mongoose = require('mongoose');
const { config } = require("dotenv");

// execute dotenv
config();

class Ready extends Listener {
  constructor() {
    super("ready", {
      event: "ready",
      emitter: "client",
    });
  }

  async exec() {
    // Mongoose DataBase
    const mongoAtlasUri = `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/market`;
    try {
      // Connect to the MongoDB cluster
      await mongoose.connect(mongoAtlasUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (e) {
      console.log("could not connect to Mongo Database");
    }

    this.client.user.setActivity("@ Me To Get Started!", {
      type: "LISTENING",
    });
    console.log("The Market Started! Start Trading!");
  }
}

module.exports = Ready;

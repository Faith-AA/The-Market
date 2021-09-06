const { Command } = require("discord-akairo");
const Discord = require("discord.js");

const {
  userInDatabase,
  IEX_API_DATA,
  getUser,
  updateDatabase,
} = require("../database");

class BegCommand extends Command {
  constructor() {
    super("beg", {
      aliases: ["beg"],
      clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
      userPermissions: ["SEND_MESSAGES"],
    });
  }

  async exec(message) {
    // Message Embeds
    const notFound = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(
        `*You need to run the **#start** command before you can proceed with this command.*`
      )
      .setColor(0xff0000);
    const noDevice = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(
        `*You don't have a device to complete this command! You can buy one by executing **#shop**.*`
      )
      .setColor(0xff0000);
    const success = new Discord.MessageEmbed()
      .setAuthor(
        `The Market`,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setColor(0xaaff00);
    const waitWork = new Discord.MessageEmbed()
      .setAuthor(
        `The Market`,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setThumbnail(
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription("You can't beg while at work.")
      .setColor(0xff0000);
    const cooldownBeg = new Discord.MessageEmbed()
      .setAuthor(
        `The Market`,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setThumbnail(
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(
        "Chill. You've recently begged. Wait a moment before you beg again."
      )
      .setColor(0xff0000);

    // check if user is in the database
    if (
      (await userInDatabase(
        message.author.id,
        `${message.author.username}#${message.author.discriminator}`
      )) == false
    ) {
      return message.channel.send({ embeds: [notFound] });
    }

    // check if user can use this command
    const user = await getUser(message.author.id); // get the user array
    if (user.has_computer == false && user.has_phone == false) {
      return message.channel.send({ embeds: [noDevice] });
    }

    // check if user isn't already in work
    const now = new Date();
    const inShift = new Date(user.job_in_shift);
    if (now < inShift) {
      return message.channel.send({ embeds: [waitWork] });
    }

    // cooldown
    const begCooldown = new Date(user.beg_cooldown);
    if (now < begCooldown) {
      return message.channel.send({ embeds: [cooldownBeg] });
    }

    const prices = [
      {
        money: 50,
        description: "You mowed a homeowners lawn and received 50 dollars.",
        chance: 0.03,
      },
      {
        money: 20,
        description:
          "You found a 20 dollar bill while wandering through an alley.",
        chance: 0.06,
      },
      {
        money: 5,
        description: "You carried some heavy objects for 5 dollars.",
        chance: 0.08,
      },
      {
        money: 5,
        description:
          "You plowed the snow for a homeowner and got paid 5 dollars.",
        chance: 0.08,
      },
      {
        money: 7.5,
        description:
          "You sold lemonade for the past hour and made 7.5 dollars.",
        chance: 0.05,
      },
      {
        money: 10,
        description: "You won a battle of arm wrestle and got 10 dollars.",
        chance: 0.09,
      },
      {
        money: 25,
        description: "You got lucky in the casino and won 25 dollars.",
        chance: 0.07,
      },
      {
        money: 1000,
        description:
          "A company offered 1,000 dollars for you to participate in their AD campaign.",
        chance: 0.009,
      },
      {
        money: 0.5,
        description:
          "While sitting on the street. Someone dropped a coin for you.",
        chance: 0.12,
      },
      {
        money: 0,
        description: "Your luck was off this time. No money was made.",
        chance: 0.2,
      },
      {
        money: 1,
        description:
          "While sitting on the street. Someone dropped a coin for you.",
        chance: 0.11,
      },
      {
        money: 2,
        description:
          "While sitting on the street. Someone dropped a coin for you.",
        chance: 0.1,
      },
      {
        money: 1000000,
        description:
          "You found a loonie and bought a lottery. During the draw, you won 1 million dollars.",
        chance: 0.001,
      },
    ];

    // check total
    // let total = 0;
    // for (var i = 0; i < prices.length; i++) {
    //     total = total + prices[i].chance;
    // }
    // console.log(total)

    // get random one with probabiltiy in mind
    function randPick(data) {
      var winner = Math.random();
      var threshold = 0;
      for (let i = 0; i < data.length; i++) {
        threshold += parseFloat(data[i].chance);
        if (threshold > winner) {
          return data[i];
        }
      }
    }
    const final = randPick(prices);

    // create variables for the data received
    const reward = final.money;
    const description = final.description;
    const newCashAmount = parseFloat(reward) + parseFloat(user.cash);

    // create a date 1 minute from now.
    var nextweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes() + 1,
      now.getSeconds()
    );

    // Update database
    await updateDatabase(message.author.id, "cash", newCashAmount);
    await updateDatabase(message.author.id, "beg_cooldown", nextweek);

    // send embed
    return message.channel.send({
      embeds: [success.setDescription(description)],
    });
  }
}

module.exports = BegCommand;

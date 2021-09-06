const { Command } = require("discord-akairo");
const Discord = require("discord.js");

const {
  userInDatabase,
  IEX_API_DATA,
  getUser,
  updateDatabase,
} = require("../database");

class CashCommand extends Command {
  constructor() {
    super("cash", {
      aliases: ["cash", "rich", "money"],
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
    const commandUsage = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .addField("Command Usage", `**\`#cash [user (optional)]\`**`)
      .setColor(0xff0000);
    const noDevice = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(
        `*You don't have a device to complete this request! You can buy one by executing **#shop**.*`
      )
      .setColor(0xff0000);
    const userNotValid = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(
        `*The user either doesn't exist or has never used this bot.*`
      )
      .setColor(0xff0000);
    const success = new Discord.MessageEmbed()
      .setFooter(
        `The Market`,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setColor(0xaaff00);

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
    const userAuthor = await getUser(message.author.id); // get the user array
    if (userAuthor.has_computer == false && userAuthor.has_phone == false) {
      return message.channel.send({ embeds: [noDevice] });
    }

    // split the args into their own variables
    const split = message.content.trim().split(" ");

    // try to get the user id
    let userId;
    if (split.length == 2) {
      // user id or tagged user provided
      userId = message.mentions.members.first();
      if (!userId) {
        userId = split[1];
        if (!userId) {
          return message.channel.send({ embeds: [userNotValid] });
        }
      } else {
        userId = userId.id;
      }
    } else if (split.length == 1) {
      userId = message.author.id;
    } else {
      return message.channel.send({ embeds: [commandUsage] });
    }

    // find the user in the database
    const user = await getUser(userId);
    if (user == false) {
      return message.channel.send({ embeds: [userNotValid] });
    }

    // get portfolio worth
    const stocks = user.stocks;
    let total = 0;
    for (var i = 0; i < stocks.length; i++) {
      if (stocks[i].shares != 0) {
        const data = await IEX_API_DATA(stocks[i].symbol);
        const price = data.latestPrice;
        total = total + price;
      }
    }

    // calculate net worth
    let netWorth = total + parseFloat(user.cash);
    if (user.has_computer == true) {
      netWorth = netWorth + 2000;
    }
    if (user.has_phone == true) {
      netWorth = netWorth + 1000;
    }

    // Make currencies displayable
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    // success embed
    return message.channel.send({
      embeds: [
        success
          .setAuthor(`${user.tag}`)
          .setDescription(
            `Cash: \`${formatter.format(user.cash)}\`\n` +
              `Total Portfolio Value: \`${formatter.format(total)}\`\n` +
              `NET WORTH: \`${formatter.format(netWorth)}\`\n`
          )
          .setThumbnail(
            this.client.users.cache
              .get(userId)
              .displayAvatarURL({ dynamic: true, size: 256 })
          ),
      ],
    });
  }
}

module.exports = CashCommand;

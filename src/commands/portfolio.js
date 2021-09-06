const { Command } = require("discord-akairo");
const Discord = require("discord.js");

const {
  userInDatabase,
  IEX_API_DATA,
  getUser,
  updateDatabase,
} = require("../database");

class PortfolioCommand extends Command {
  constructor() {
    super("portfolio", {
      aliases: ["portfolio"],
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
      .setThumbnail(
        this.client.users.cache
          .get(message.author.id)
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(
        "This is your portfolio. (NOTE: It may not display all your stocks due to the text limit set by Discord.)"
      )
      .setColor(0xaaff00);
    const needPhoneWhileWork = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(`*You need a phone to trade while you're at work.*`)
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

    const now = new Date();
    const inShift = new Date(user.job_in_shift);
    if (now < inShift) {
      if (user.has_phone == false) {
        return message.channel.send({ embeds: [needPhoneWhileWork] });
      }
    }

    // Make currencies displayable
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    // create a message embed with all your stocks
    const stocks = user.stocks;
    let length = 9;
    if (stocks.length < 9) {
      length = stocks.length;
    }
    for (var i = 0; i < stocks.length; i++) {
      const data = await IEX_API_DATA(stocks[i].symbol);
      success.addField(
        `${data.primaryExchange}:${data.symbol}`,
        `# Of Shares: \`${stocks[i].shares}\`\n` +
          `Price: \`${formatter.format(data.latestPrice)}\`\n` +
          `Total Value: \`${formatter.format(
            stocks[i].shares * data.latestPrice
          )}\`\n`,
        true
      );
    }

    // send embed
    return message.channel.send({ embeds: [success] });
  }
}

module.exports = PortfolioCommand;

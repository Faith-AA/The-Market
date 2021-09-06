const { Command } = require("discord-akairo");
const Discord = require("discord.js");

const {
  userInDatabase,
  IEX_API_DATA,
  getUser,
  updateDatabase,
} = require("../database");

class BuyCommand extends Command {
  constructor() {
    super("buy", {
      aliases: ["buy"],
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
      .addField("Command Usage", `**\`#buy [symbol] [shares(amount)]\`**`)
      .setColor(0xff0000);
    const noSymbol = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(
        `*You need to provide a symbol for this command to function.*`
      )
      .addField("Command Usage", `**\`#buy [symbol] [shares(amount)]\`**`)
      .setColor(0xff0000);
    const noShares = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(
        `*You need to provide a positive integer for the amount of shares you want to buy.*`
      )
      .addField("Command Usage", `**\`#buy [symbol] [shares(amount)]\`**`)
      .setColor(0xff0000);
    const unknownSymbol = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(`*The symbol provided doesn't exist.*`)
      .setColor(0xff0000);
    const noDevice = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(
        `*You don't have a device to complete this transaction! You can buy one by executing **#shop**.*`
      )
      .setColor(0xff0000);
    const insufficientFunds = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(`*Insufficient funds to complete this transaction.*`)
      .setColor(0xff0000);
    const success = new Discord.MessageEmbed()
      .setAuthor(
        `The Market`,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription("The transaction has been successfully completed. Find more details regarding this in the fields below.")
      .setThumbnail(
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setColor(0xaaff00);
    const fired = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(`*Oh no. It was discovered that you were not paying attention to your job. Therefore, you've lost your job and need to wait a 1 week cooldown. :(*`)
      .setColor(0xff0000);
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
    if ((await userInDatabase(message.author.id, `${message.author.username}#${message.author.discriminator}`)) == false) {
      return message.channel.send({ embeds: [notFound] });
    }

    // check if user can use this command
    const user = await getUser(message.author.id); // get the user array
    if (user.has_computer == false && user.has_phone == false) {
      return message.channel.send({ embeds: [noDevice] });
    }

    // user needs phone if they are in work.
    const now = new Date();
    const inShift = new Date(user.job_in_shift);
    if (now < inShift) {
      if (user.has_phone == false) {
        return message.channel.send({ embeds: [needPhoneWhileWork] });
      }
    }

    // split the args into their own variables
    const split = message.content.trim().split(" ");
    let symbol = split[1];
    let shares = split[2];

    // Check if user input is valid
    if (!symbol) {
      return message.channel.send({ embeds: [noSymbol] });
    } else if (!shares || !/^\d+$/.test(shares)) {
      return message.channel.send({ embeds: [noShares] });
    } else if (parseFloat(shares) <= 0) {
      return message.channel.send({ embeds: [noShares] });
    } else if (split.length > 3) {
      return message.channel.send({ embeds: [commandUsage] });
    }

    // gather data for the symbol
    let IEX_Data;
    try {
      IEX_Data = await IEX_API_DATA(symbol);
    } catch {
      return message.channel.send({ embeds: [unknownSymbol] });
    }

    // put needed data in their own constants
    const price = IEX_Data.latestPrice; // current stock price
    const name = IEX_Data.companyName; // stock company name
    symbol = IEX_Data.symbol; // stock symbol
    shares = parseFloat(shares); // make shares an integer
    const total = (price * shares) + 5; // the total cost for this transaction
    const cash = parseFloat(user.cash); // get the sum of money of the user
    const stocks = user.stocks; // get all the current stock owned by the user

    // check if user has enough money
    if (total > cash) {
      return message.channel.send({ embeds: [insufficientFunds] });
    }
    const newCash = cash - total;

    // update array
    let identifier = false;
    let totalShares = shares;
    for (var i = 0; i < stocks.length; i++) {
      if (stocks[i].symbol == symbol) {
        stocks[i].shares = stocks[i].shares + shares;
        stocks[i].dateOfChange = Date.now();
        totalShares = stocks[i].shares;
        identifier = true;
      }
    }

    if (identifier == false) {
      // means a user bought a new stock
      stocks.push({
        symbol: symbol,
        name: name,
        shares: shares,
        dateOfChange: Date.now(),
      });
    }

    // Update database
    await updateDatabase(message.author.id, "stocks", stocks);
    await updateDatabase(message.author.id, "cash", newCash);

    // Make currencies displayable
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    // success embed
    message.channel.send({
      embeds: [
        success.addField(
          "\u200B",
          `**Transaction Details:**\n` +
            `\u3000 symbol: \`${symbol}\`\n` +
            `\u3000 company: \`${name}\`\n` +
            `\u3000 share(s) purchased: \`${shares}\`\n` +
            `\u3000 sum of **${symbol}** share(s) owned: \`${totalShares}\`\n` +
            `\u3000 total cost: \`${formatter.format(total)}\`\n` + 
            `\u3000 cash left over: \`${formatter.format(newCash)}\`\n`
        ),
      ],
    });

    // create a chance where the user can get fired from their job 
    if (Math.floor(Math.random() * 200) == 7) {
      var nextweek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 7,
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );
      await updateDatabase(message.author.id, "job", "");
      await updateDatabase(message.author.id, "job_in_shift", "");
      await updateDatabase(message.author.id, "job_shift_cooldown", "");
      await updateDatabase(message.author.id, "job_find_cooldown", nextweek);
      message.channel.send({ embeds: [fired] });
    }
    
    return;
  }
}

module.exports = BuyCommand;

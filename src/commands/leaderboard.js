const { Command } = require("discord-akairo");
const Discord = require("discord.js");

const {
  userInDatabase,
  IEX_API_DATA,
  getUser,
  updateDatabase,
  leaderboardData,
} = require("../database");

class LeaderboardCommand extends Command {
  constructor() {
    super("leaderboard", {
      aliases: ["leaderboard"],
      clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
      userPermissions: ["SEND_MESSAGES"],
    });
  }

  async exec(message) {
    // Message Embeds
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
        "This is the global leaderboard where you can find the top 10 players in **The Market**. It's based on the amount of cash you're holding. Grind **The Market** to get on the top!"
      )
      .setColor(0xaaff00);

    // get all the data and put the data so the cash value is in a descending order.
    let data = await leaderboardData();
    data.sort((a, b) => parseFloat(b.cash) - parseFloat(a.cash));

    // Make currencies displayable
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    // fill the embed with the top 10 and send it in the channel
    message.channel.send({
      embeds: [
        success.addField(
          "\u200B",
          `**Top 10 Richest Users In The Market:**\n` +
            `\u3000 1. ${data[0].tag}: \`${formatter.format(
              data[0].cash
            )}\`\n` +
            `\u3000 2. ${data[1].tag}: \`${formatter.format(
              data[1].cash
            )}\`\n` +
            `\u3000 3. ${data[2].tag}: \`${formatter.format(
              data[2].cash
            )}\`\n` +
            `\u3000 4. ${data[3].tag}: \`${formatter.format(
              data[3].cash
            )}\`\n` +
            `\u3000 5. ${data[4].tag}: \`${formatter.format(
              data[4].cash
            )}\`\n` +
            `\u3000 6. ${data[5].tag}: \`${formatter.format(
              data[5].cash
            )}\`\n` +
            `\u3000 7. ${data[6].tag}: \`${formatter.format(
              data[6].cash
            )}\`\n` +
            `\u3000 8. ${data[7].tag}: \`${formatter.format(
              data[7].cash
            )}\`\n` +
            `\u3000 9. ${data[8].tag}: \`${formatter.format(
              data[8].cash
            )}\`\n` +
            `\u3000 10. ${data[9].tag}: \`${formatter.format(data[9].cash)}\`\n`
        ),
      ],
    });
  }
}

module.exports = LeaderboardCommand;

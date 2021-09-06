const { Command } = require('discord-akairo');
const Discord = require('discord.js');

const { userInDatabase, addUser, IEX_API_DATA} = require('../database');

class helpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help'],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: ["SEND_MESSAGES"]
        });
    }

    async exec(message) {
        // message embeds
        const success = new Discord.MessageEmbed()
            .setAuthor(`Welcome To The Market`, this.client.users.cache.get('882815730486243359').displayAvatarURL({ dynamic: true, size: 256 }))
            .setColor(0xAAFF00)
            .setDescription(
                `***The Market** is a arcade game that simulates the stock market. In addition, there are commands which will enhance the player experience.*`
            )
            .addField(
                `Fees`,
                'There is a $5 fee for every transaction done while trading.'
            )
            .addField(
                `Currency`,
                'All the money in this arcade game is in USD.'
            )
            .addField('Background', `You start the game off with $5,000, and your goal is to accumulate as much money as you can. You can do this with the help of the stock market. In addition, you can get a job and make an income from there as well.`)
            .addField('Stock Related Commands', `**\`#buy\` \`#sell\` \`#gamble\`**`, true)
            .addField('Work Related Commands', `**\`#work\` \`#findjob\` \`#beg\`**`, true)
            .addField('User Related Commands', `**\`#cash\` \`#shares\` \`#shop\`**`, true)
            .addField(
                'Global Commands',
                `*\`#leaderboard\`*`,
                true
            )
            .addField(
                `Want The Market in Your Server?`,
                `Click [here](https://discord.com/oauth2/authorize?client_id=882815730486243359&scope=bot&permissions=8) to invite **The Market** to your Discord server!`,
                false
            )
            .setThumbnail(this.client.users.cache.get('882815730486243359').displayAvatarURL({ dynamic: true, size: 256 }))
            .setFooter(
                `Developer: ${this.client.users.cache.get('451760559055044608').username}#${this.client.users.cache.get('451760559055044608').discriminator}`,
                this.client.users.cache.get('451760559055044608').displayAvatarURL({ dynamic: true, size: 256 })
            );
            return message.channel.send({ embeds: [success] });
    }
}

module.exports = helpCommand;

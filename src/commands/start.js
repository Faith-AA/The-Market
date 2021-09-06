const { Command } = require('discord-akairo');
const Discord = require('discord.js');

const { userInDatabase, addUser, IEX_API_DATA} = require('../database');

class startCommand extends Command {
    constructor() {
        super('start', {
            aliases: ['start', "setup"],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: ["SEND_MESSAGES"]
        });
    }

    async exec(message) {
        // message embeds
        const notFound = new Discord.MessageEmbed()
            .setAuthor(`The Market Error `, this.client.users.cache.get('882815730486243359').displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`*You can't run this command more then once! Type **#help** to receive more information on this Discord bot.*`)
            .setColor(0xFF0000)
        const success = new Discord.MessageEmbed()
            .setAuthor(`Welcome To The Market`, this.client.users.cache.get('882815730486243359').displayAvatarURL({ dynamic: true, size: 256 }))
            .setColor(0xAAFF00)
            .setDescription(
                `*Thank you for showing interest in **The Market**. This message embed will contain a ton of information to get started with this bot.*`
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

        // check if user is in the database
        if (await userInDatabase(message.author.id, `${message.author.username}#${message.author.discriminator}`) == true) {
            return message.channel.send({ embeds: [notFound] });
        } 

        // create user data
        await addUser(message.author.id, `${message.author.username}#${message.author.discriminator}`).then(() => {
            return message.channel.send({ embeds: [success] });
        })
    }
}

module.exports = startCommand;

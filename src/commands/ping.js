const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping', "latency"],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: ["SEND_MESSAGES"]
        });
    }

    async exec(message) {
        // return embed with content
        const replay = new Discord.MessageEmbed()
            .setAuthor(`The Market's Latency`, this.client.users.cache.get('882815730486243359').displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`**\`${this.client.ws.ping}ms\`**`)
            .setColor(0xAAFF00)
        return message.channel.send({ embeds: [replay] });
        
    }
}

module.exports = PingCommand;   

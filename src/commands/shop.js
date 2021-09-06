const { Command } = require('discord-akairo');
const Discord = require('discord.js');

const { userInDatabase, getUser, updateDatabase} = require('../database');

class ShopCommand extends Command {
    constructor() {
        super('shop', {
            aliases: ['shop'],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: ["SEND_MESSAGES"]
        });
    }

    async exec(message) {
        // message embeds
        const notFound = new Discord.MessageEmbed()
            .setAuthor(`The Market Error `, this.client.users.cache.get('882815730486243359').displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`*You need to run the **#start** command before you can proceed with this command.*`)
            .setColor(0xFF0000)
        const commandUsage = new Discord.MessageEmbed()
            .setAuthor(
              `The Market Error `,
              this.client.users.cache
                .get("882815730486243359")
                .displayAvatarURL({ dynamic: true, size: 256 })
            )
            .addField("Command Usage", `**\`#shop [item]\`**`)
            .setColor(0xff0000);
        const itemNotFound = new Discord.MessageEmbed()
            .setAuthor(`The Market Error `, this.client.users.cache.get('882815730486243359').displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`*The item you've entered doesn't exist.*`)
            .setColor(0xFF0000)
        const ownedItem = new Discord.MessageEmbed()
            .setAuthor(`The Market Error `, this.client.users.cache.get('882815730486243359').displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`*The item you've entered is already found in your inventory.*`)
            .setColor(0xFF0000)
        const broke = new Discord.MessageEmbed()
            .setAuthor(`The Market Error `, this.client.users.cache.get('882815730486243359').displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`*Looks like you can't afford this item. Time to beg!*`)
            .setColor(0xFF0000)
        const robbed = new Discord.MessageEmbed()
            .setAuthor(`The Market Error`, this.client.users.cache.get('882815730486243359').displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`*Oh No! It seems like the clerk ran off with your money. Time to save up again. :(*`)
            .setColor(0xFF0000)
        const options = new Discord.MessageEmbed()
            .setAuthor(`The Shop`, this.client.users.cache.get('882815730486243359').displayAvatarURL({ dynamic: true, size: 256 }))
            .setColor(0xAAFF00)
            .setDescription(
                `*Welcome to the shop. Here you can buy special gadgets which will help you in the quest to get rich!*`
            )
            .setThumbnail(this.client.users.cache.get('882815730486243359').displayAvatarURL({ dynamic: true, size: 256 }))
            .setFooter(
                `Developer: ${this.client.users.cache.get('451760559055044608').username}#${this.client.users.cache.get('451760559055044608').discriminator}`,
                this.client.users.cache.get('451760559055044608').displayAvatarURL({ dynamic: true, size: 256 })
            );
        const success = new Discord.MessageEmbed()
            .setAuthor(`The Market`, this.client.users.cache.get('882815730486243359').displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`*The purchase went through successfully. Hopefully you'll enjoy your item.*`)
            .setColor(0xAAFF00)
        const atWork = new Discord.MessageEmbed()
            .setAuthor(
              `The Market Error `,
              this.client.users.cache
                .get("882815730486243359")
                .displayAvatarURL({ dynamic: true, size: 256 })
            )
            .setDescription(`*You cannot purchase items while at work.*`)
            .setColor(0xff0000);

        // check if user is in the database
        if (await userInDatabase(message.author.id, `${message.author.username}#${message.author.discriminator}`) == false) {
            return message.channel.send({ embeds: [notFound] });
        }  

        // split the messages
        const split = message.content.trim().split(" ");

        // show shop buying options
        if (split.length == 1) {
            return message.channel.send({ 
                embeds: [
                    options
                    .addField('Phone ($1,000)', `The phone allows you to use the **#buy** and **#sell** commands while you're at work. Don't get too comfortable since there is a small probability that it can get you fired.`, true)
                    .addField('Computer ($2,000)', `You own a computer by default. However, there is a chance for it to break.`, true)
                ] 
            });
        }

        // return if too many args
        if (split.length > 2) {
            return message.channel.send({ embeds: [commandUsage] });
        }

        // item bought
        const item = split[1];
        if (!["phone", "computer"].includes(item.toLowerCase())) {
            return message.channel.send({ embeds: [itemNotFound] });
        }

        // get the user array
        const user = await getUser(message.author.id); 

        // check if user doesn't already have it
        if (user.has_computer == true && item.toLowerCase() == "computer") {
            return message.channel.send({ embeds: [ownedItem] });
        } else if (user.has_phone == true && item.toLowerCase() == "phone") {
            return message.channel.send({ embeds: [ownedItem] });
        }

        // check if user is available to buy item
        const now = new Date();
        const inShift = new Date(user.job_in_shift);
        if (now < inShift) {
            return message.channel.send({ embeds: [atWork] });
        }  

        // check if user has sufficient funds
        if (parseFloat(user.cash) < 2000 && item.toLowerCase() == "computer") {
            return message.channel.send({ embeds: [broke] });
        } else if (parseFloat(user.cash) < 1000 && item.toLowerCase() == "phone") {
            return message.channel.send({ embeds: [broke] });
        }

        // give the user the item
        if (item.toLowerCase() == "computer") {
            await updateDatabase(message.author.id, "cash", parseFloat(user.cash) - 2000);
            // around a 1% chance to get robbed
            if (Math.floor(Math.random() * 100) == 7) {
                return message.channel.send({ embeds: [robbed] });
            }
            await updateDatabase(message.author.id, "has_computer", true);
            return message.channel.send({ 
                embeds: [
                    success.addField('Item Purchased', "Computer")
                ] 
            });
        } else if (item.toLowerCase() == "phone") {
            await updateDatabase(message.author.id, "cash", parseFloat(user.cash) - 1000);
            // around a 1% chance to get robbed
            if (Math.floor(Math.random() * 100) == 7) {
                return message.channel.send({ embeds: [robbed] });
            }
            await updateDatabase(message.author.id, "has_phone", true);
            return message.channel.send({ 
                embeds: [
                    success.addField('Item Purchased', "Phone")
                ] 
            });
        }
    }
}

module.exports = ShopCommand;

const {AkairoClient, CommandHandler, ListenerHandler } = require("discord-akairo")

const { config } = require("dotenv");
const { join } = require("path")
const { Intents } = require("discord.js");

// Execute dotenv
config();

class marketClient extends AkairoClient {
    constructor() {
        super(
            {
                ownerID: process.env.ownerID
            },
            {
                disableEveryone: true,
                intents: [
                    Intents.FLAGS.GUILD_MEMBERS, 
                    Intents.FLAGS.GUILDS, 
                    Intents.FLAGS.GUILD_MESSAGES,
                    Intents.FLAGS.DIRECT_MESSAGES
                ],
                partials: [
                    'CHANNEL'
                ]
            }
        );

        // Handlers
        this.commandHandler = new CommandHandler(this, {
            directory: join(__dirname, 'commands'),
            blockBots: true,
            blockClient: true,
            allowMention: true,
            defaultCooldown: 2000,
            fetchMembers: true,
            prefix: "#",   
        });
        
        this.listenerHandler = new ListenerHandler(this, {
            directory: join(__dirname, 'listeners')
        });

        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }
}

const client = new marketClient();
client.login(process.env.TOKEN)
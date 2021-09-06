const { Command } = require("discord-akairo");
const Discord = require("discord.js");

const {
  userInDatabase,
  IEX_API_DATA,
  getUser,
  updateDatabase,
} = require("../database");

class WorkCommand extends Command {
  constructor() {
    super("work", {
      aliases: ["work"],
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
    const firstTime = new Discord.MessageEmbed()
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
        "Since this is your first time running this command. We'll assign you a random job. Work shifts are 8 hours long, and you'll be put on a cooldown for 12 hours after that. During work, trading will just be limited through your phone. To start your daily shift, type **#work start**. To find a new job, type **#work find**. You get paid for your shift once you start another shift."
      )
      .setColor(0xaaff00);
    const commandUsage = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .addField("Command Usage", `**\`#work [action]\`**`)
      .setColor(0xff0000);
    const stillWork = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(`You are already working right now.`)
      .setColor(0xff0000);
    const workCooldown = new Discord.MessageEmbed()
      .setAuthor(
        `The Market Error `,
        this.client.users.cache
          .get("882815730486243359")
          .displayAvatarURL({ dynamic: true, size: 256 })
      )
      .setDescription(`Take a break. You've recently worked hard.`)
      .setColor(0xff0000);
    const shiftStarted = new Discord.MessageEmbed()
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
      .setDescription("Your shift has begun!")
      .setColor(0xaaff00);
    const findCooldown = new Discord.MessageEmbed()
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
        "You've to await your cooldown before you can find another job."
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
      .setDescription(
        "You've to complete your last shift before you can find another job."
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

    // get user data
    const user = await getUser(message.author.id);

    // all kinds of jobs
    const jobs = [
      {
        daily: 167,
        estimated_monthly: 5000,
        job: "Small Business Owner",
        chance: 0.03,
      },
      {
        daily: 67,
        estimated_monthly: 2000,
        job: "Uber Driver",
        chance: 0.06,
      },
      {
        daily: 50,
        estimated_monthly: 1500,
        job: "Restaurant Crew Member",
        chance: 0.08,
      },
      { daily: 50, estimated_monthly: 1500, job: "Cashier", chance: 0.08 },
      {
        daily: 133,
        estimated_monthly: 4000,
        job: "Professional Designer",
        chance: 0.05,
      },
      {
        daily: 117,
        estimated_monthly: 3500,
        job: "Graphic Designer",
        chance: 0.09,
      },
      { daily: 133, estimated_monthly: 4000, job: "Plumber", chance: 0.07 },
      { daily: 333, estimated_monthly: 10000, job: "Doctor", chance: 0.009 },
      {
        daily: 33,
        estimated_monthly: 1000,
        job: "Lemonade Stand Owner",
        chance: 0.12,
      },
      { daily: 0, estimated_monthly: 0, job: "Jobless", chance: 0.2 },
      {
        daily: 23,
        estimated_monthly: 700,
        job: "Street Artist",
        chance: 0.11,
      },
      {
        daily: 23,
        estimated_monthly: 700,
        job: "Street Entertainer",
        chance: 0.1,
      },
      {
        daily: 33333,
        estimated_monthly: 1000000,
        job: "Business Owner",
        chance: 0.001,
      },
    ];

    // if user has no work...
    if (user.job == "") {
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
      const jobData = randPick(jobs);

      // fill variables
      const job = jobData.job;
      const daily = jobData.daily;
      const monthly = jobData.estimated_monthly;

      // create a date one week from now
      var now = new Date();
      var nextweek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 7,
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );

      // update database
      await updateDatabase(message.author.id, "job", job);
      await updateDatabase(message.author.id, "job_find_cooldown", nextweek);

      // send a message embed to the user
      return message.channel.send({
        embeds: [
          firstTime
            .addField("Your job", job, true)
            .addField("Daily salary", `${daily}`, true)
            .addField("Estimated monthly salary", `${monthly}`, true),
        ],
      });
    }

    // split the command into args
    const split = message.content.trim().split(" ");
    if (split.length > 2 || split.length == 1) {
      return message.channel.send({ embeds: [commandUsage] });
    }
    let action = split[1].toLowerCase();

    // work start
    if (action == "start") {
      const now = new Date();

      // check if user isn't already in work
      const inShift = new Date(user.job_in_shift);
      if (now < inShift) {
        return message.channel.send({ embeds: [stillWork] });
      }

      // check if user isn't on cooldown
      const inCooldown = new Date(user.job_shift_cooldown);
      if (now < inCooldown) {
        return message.channel.send({ embeds: [workCooldown] });
      }

      // create times
      var shift = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 8,
        now.getMinutes(),
        now.getSeconds()
      );
      var cooldown = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 20,
        now.getMinutes(),
        now.getSeconds()
      );

      // pay the user for their last shift
      if (user.job_shift_cooldown != "") {
        let payAmount = 0;
        for (var i = 0; i < jobs.length; i++) {
          if (jobs[i].job == user.job) {
            payAmount = jobs[i].daily;
            break;
          }
        }
        await updateDatabase(
          message.author.id,
          "cash",
          parseFloat(user.cash) + payAmount
        );
      }

      // update the database since user started shift
      await updateDatabase(message.author.id, "job_in_shift", shift);
      await updateDatabase(message.author.id, "job_shift_cooldown", cooldown);

      // send embed
      return message.channel.send({
        embeds: [shiftStarted.addField("Shift End Time", `${shift}`, true)],
      });
      // update database
    } else if (action == "find") {
      const now = new Date();

      // check if user isn't already in work
      const inShift = new Date(user.job_in_shift);
      if (now < inShift) {
        return message.channel.send({ embeds: [waitWork] });
      }

      // check if user isn't on cooldown
      const cooldown = new Date(user.job_find_cooldown);
      if (now < cooldown) {
        return message.channel.send({ embeds: [findCooldown] });
      }

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
      const jobData = randPick(jobs);

      // fill variables
      const job = jobData.job;
      const daily = jobData.daily;
      const monthly = jobData.estimated_monthly;

      // create a date one week from now
      var nextweek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 7,
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );

      // pay user outstanding cash from last shift
      if (user.job_shift_cooldown != "") {
        let payAmount = 0;
        for (var i = 0; i < jobs.length; i++) {
          if (jobs[i].job == user.job) {
            payAmount = jobs[i].daily;
            break;
          }
        }
        await updateDatabase(
          message.author.id,
          "cash",
          parseFloat(user.cash) + payAmount
        );
      }

      // update database
      await updateDatabase(message.author.id, "job", job);
      await updateDatabase(message.author.id, "job_find_cooldown", nextweek);
      await updateDatabase(message.author.id, "job_in_shift", "");
      await updateDatabase(message.author.id, "job_shift_cooldown", "");

      // send a message embed to the user
      return message.channel.send({
        embeds: [
          success
            .addField("Your new job", job, true)
            .addField("Daily salary", `${daily}`, true)
            .addField("Estimated monthly salary", `${monthly}`, true),
        ],
      });
    } else {
      return message.channel.send({ embeds: [commandUsage] });
    }
  }
}

module.exports = WorkCommand;

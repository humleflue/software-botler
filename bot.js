// Dependencies
const Discord = require(`discord.js`);
global.bot    = new Discord.Client(); // Is saved in a global variable, so it's available throughout the modules
const fs      = require(`fs`);
// const path    = require(`path`);

// Models
const Yep               = require(`./Models/MsgContains/YEP/Yep`);
const AutoVoiceChannels = require(`./Models/Commands/AutoVoiceChannels/AutoVoiceChannels`);
const BirthdayBot       = require(`./Models/MsgSentBy/BirthdayBot`);

// Variables
const { token } = JSON.parse(fs.readFileSync(`token.json`));
const prefix = `;`;
global.prefix = prefix;

// Construct all models here for convenience later
function constructModels(msg, argv) {
  return {
    commands: {
      avc: new AutoVoiceChannels(msg, argv),
    },
    msgContains: {
      yep: new Yep(msg, argv),
    },
    msgSendBy: {
      "470673087671566366": new BirthdayBot(msg, argv),
    },
  };
}

// Connect to the discord api
global.bot.login(token);

// Ready check
global.bot.on(`ready`, () => {
  console.log(`Logged in as ${global.bot.user.tag}!`); // eslint-disable-line no-console
});

// Main method. When a message occurs in a chat this happens
global.bot.on(`message`, (msg) => {
  // Split the message into an array for easier access to components
  const argv = splitMsgContent(msg.content);
  const models = constructModels(msg, argv);

  if (msg.content[0] === prefix) {
    const commandRelatedModels = models.commands;
    // Provides easy access to the following functions through the msg-object
    msg.sendInvalidCommandReply = sendInvalidCommandReply;
    msg.sendHelpReply = sendHelpReply;
    // Checks if argv[0] corresponds to any of the models.
    const modelName = Object.keys(commandRelatedModels).find((model) => model === argv[0]);
    if (modelName !== undefined) {
      // Handles all requests to models in a uniform way
      commandRelatedModels[modelName.toLowerCase()].handle();
    }
    else {
      switch (argv[0]) {
        case `help`: case `h`: case `commands`:
          msg.sendHelpReply();                  break;
        default: msg.sendInvalidCommandReply(); break;
      }
    }
  }
  else if (msg.author.bot === false) {
    const msgContainsRelatedModels = models.msgContains;

    const stringsToContain = Object.keys(msgContainsRelatedModels);
    const stringsWhichAreContained = msgContains(stringsToContain, msg);
    stringsWhichAreContained.forEach((string) => {
      const modelName = string;
      msgContainsRelatedModels[modelName].handle();
    });
  }

  // Check if message was sent by a user in the MsgSendBy models
  const msgSendByRelatedModels = models.msgSendBy;
  const modelName = Object.keys(msgSendByRelatedModels).find((model) => model === msg.author.id);
  if (modelName !== undefined) {
    msgSendByRelatedModels[modelName].handle();
  }
});

// Posts announcement in #general when a user boosts the server
global.bot.on(`guildMemberUpdate`, async (oldMember, newMember) => {
  if (oldMember.premiumSince.toString() !== newMember.premiumSince.toString()) {
    const generalTextChannelID = `616659963594670091`;
    global.bot.channels.cache.get(generalTextChannelID).send(`<@${newMember.id}> just boosted the server!\n`);
  }
});

// Split the message into an array for easier access to components
function splitMsgContent(msgContent) {
  const argv = msgContent.split(` `).map((arg) => arg.toLowerCase());
  argv[0] = argv[0].substring(prefix.length); // Removes the prefix character
  return argv;
}

// Is connected to the msg-object
function sendInvalidCommandReply() {
  this.reply(`Invalid command. See ${prefix}help for a list of available commands.`);
}

// Is connected to the msg-object
// Reads the help.txt file and sends it's content as a reply to the user
function sendHelpReply() {
  fs.readFile(`help.txt`, `utf-8`, (err, data) => {
    if (err) {
      throw err;
    }
    this.reply(data);
  });
}

// Determines if a message contains any of the strings in the array.
// Returns all strings if any matches else it returns an empty array.
function msgContains(stringArr, msg) {
  const res = [];

  stringArr.forEach((string) => {
    const stringIsContained = msg.content.toLowerCase().includes(string);
    if (stringIsContained) {
      res.push(string);
    }
  });

  return res;
}

// https://www.reddit.com/r/discordapp/comments/8yfe5f/discordjs_bot_get_username_and_tag/

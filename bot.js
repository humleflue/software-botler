// Dependencies
const Discord = require(`discord.js`);
global.bot    = new Discord.Client(); // Is saved in a global variable, so it's available throughout the modules
const fs      = require(`fs`);
// const path    = require(`path`);

// Models
const Yep  = require(`./Models/YEP/Yep`);

// Variables
const { token } = JSON.parse(fs.readFileSync(`token.json`));
const prefix = `;`;
global.prefix = prefix;
// Construct all models here for convenience later
function constructModels(msg, argv) {
  return {
    // Put models here. Example:
    // sudo: new Sudo(msg, argv),
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
  if (msg.content[0] === prefix) {
    // Split the message into an array for easier access to components
    const argv = splitMsgContent(msg.content);

    const allModels = constructModels(msg, argv);
    const modelName = Object.keys(allModels).find((model) => model === argv[0]); // Checks if argv[0] corresponds to any of the models.
    if (modelName !== undefined) {
      allModels[modelName].handle(); // Handles all requests to models in a uniform way
    }
    else {
      switch (argv[0]) {
        case `help`: case `h`: case `commands`:
          sendHelpMsg(msg);              break;
        case `ping`: msg.reply(`Pong!`); break; // FIXME: Should be removed in the future
        default: sendErrorMsg(msg);      break;
      }
    }
  }
  else {
    const YEP = [`yep`, `Yep`, `YEP`];
    // If msg.content contains YEP
    if (YEP.some((yep) => msg.content.includes(yep))) {
      const argv = splitMsgContent(msg);
      const yep = new Yep(msg, argv);
      yep.handle();
    }
  }
});

// Split the message into an array for easier access to components
function splitMsgContent(msg) {
  const argv = msg.content.split(` `).map((arg) => arg.toLowerCase());
  argv[0] = argv[0].substring(prefix.length); // Removes the prefix character
  return argv;
}

function sendErrorMsg(msg) {
  msg.reply(`Invalid command. See ${prefix}help for a list of available commands.`);
}

// Reads the help.txt file and sends it's content as a reply to the user
function sendHelpMsg(msg) {
  fs.readFile(`help.txt`, `utf-8`, (err, data) => {
    if (err) {
      throw err;
    }
    msg.reply(data);
  });
}

// https://www.reddit.com/r/discordapp/comments/8yfe5f/discordjs_bot_get_username_and_tag/

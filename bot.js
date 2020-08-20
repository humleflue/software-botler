// Dependencies
const Discord = require(`discord.js`);
global.bot    = new Discord.Client(); // Is saved in a global variable, so it's available throughout the modules
const fs      = require(`fs`);
// const path    = require(`path`);

// Variables
const { token } = JSON.parse(fs.readFileSync(`token.json`));
const prefix = `;`;
global.prefix = prefix;
//                           Lasse                 Jacob                  Rasmus
const moderatorIds = [`187542518659809280`, `246647153865392138`, `251059000668323840`]; // Discord IDs (msg.member.id)

// Connect to the discord api
global.bot.login(token);

// Ready check
global.bot.on(`ready`, () => {
  console.log(`Logged in as ${global.bot.user.tag}!`); // eslint-disable-line no-console
});

// Main method. When a message occurs in a chat this happens
global.bot.on(`message`, (msg) => {
  if (msg.content[0] === prefix) {
    msg.content = msg.content.substring(prefix.length); // Removes the prefix character
    const argv = msg.content.split(` `).map((arg) => arg.toLowerCase());

    switch (argv[0]) {
      case `help`: case `h`: case `commands`:
        sendHelpMsg(msg);              break;
      case `ping`: msg.reply(`Pong!`); break; // FIXME: Should be removed in the future
      case `sudo`: sudo(msg, argv);    break;
      default: sendErrorMsg(msg);      break;
    }
  }
});

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

// This function handles commands which are only available to the moderators of the server
function sudo(msg, argv) {
  if (isModerator(msg.member.id)) {
    switch (argv[1]) {
      case `ping`: msg.reply(`Glorified pong!`); break; // FIXME: Should be removed in the future
      default: sendErrorMsg(msg);                break;
    }
  }
  else {
    msg.reply(`Unauthorized.`);
  }
}

// Returns boolean. Returns true if the user is a moderator.
function isModerator(userId) {
  return undefined !== moderatorIds.find((modId) => modId === userId);
}

// https://www.reddit.com/r/discordapp/comments/8yfe5f/discordjs_bot_get_username_and_tag/

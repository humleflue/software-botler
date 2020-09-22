const path = require(`path`);

const TextFile = require(`../../AbstractModels/TextFile`);

class AutoVoiceChannels extends TextFile {
  handle() {
    switch (this.argv[1]) {
      case `help`:  this.printFile(path.join(__dirname, `avcHelp.txt`));    break;
      case `delay`: this.printFile(path.join(__dirname, `./avcDelay.txt`)); break;
      default: this.msg.sendInvalidCommandReply();                          break;
    }
  }
}

module.exports = AutoVoiceChannels;

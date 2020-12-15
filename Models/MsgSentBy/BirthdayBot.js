const Model = require(`../AbstractModels/Model`);

const generalTextChannelID = `616659963594670091`;

class BirthdayBot extends Model {
  handle() {
    if (this.msg.channel.id === generalTextChannelID) {
      this.msg.react(`🎉`);
      this.msg.react(`🎂`);
      this.msg.react(`🥳`);
      this.msg.react(`🍰`);
      this.msg.react(`🎈`);
      this.msg.react(`🎁`);
      this.msg.react(`🎊`);
    }
  }
}

module.exports = BirthdayBot;

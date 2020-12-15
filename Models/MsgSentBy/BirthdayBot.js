const Model = require(`../AbstractModels/Model`);

class BirthdayBot extends Model {
  handle() {
    this.msg.react(`🎉`);
    this.msg.react(`🎂`);
    this.msg.react(`🥳`);
    this.msg.react(`🍰`);
    this.msg.react(`🎈`);
    this.msg.react(`🎁`);
    this.msg.react(`🧁`);
    this.msg.react(`🙌`);
    this.msg.react(`🎊`);
    this.msg.react(`💐`);
  }
}

module.exports = BirthdayBot;

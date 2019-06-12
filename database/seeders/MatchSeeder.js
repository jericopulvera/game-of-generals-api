const Factory = require("../Factory");
const _this = use("App/Controllers/BaseController").instance();

class MatchSeeder {
  async run() {
    await _this.Match.deleteMany({});

    const user = await _this.User.findOne({});
    const user2 = await _this.User.findOne({}).sort({ createdAt: -1 });

    await Factory.model("App/Models/Match").create({
      createdBy: user._id,
      white: { user: user._id },
      black: { user: user2._id }
    });
    // const whitePrivate = {
    //   type: '1',
    //   column: 'e',
    //   row: 3,
    //   positionHistory: []
    // }
    // const whiteGeneral = {
    //   type: '10',
    //   column: 'f',
    //   row: 3,
    //   positionHistory: []
    // }
    // const blackPrivate = {
    //   type: '1',
    //   column: 'e',
    //   row: 6,
    //   positionHistory: []
    // }
    // await _this.Match.create({
    //   createdBy: user._id,
    //   white: {
    //     user: 'white',
    //     pieces: [whitePrivate, whiteGeneral],
    //     deadPieces: [whitePrivate]
    //   },
    //   black: {
    //     user: 'black',
    //     pieces: [blackPrivate],
    //     deadPieces: [blackPrivate]
    //   }
    // })
  }
}

module.exports = MatchSeeder;

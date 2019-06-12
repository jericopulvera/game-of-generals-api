"use strict";
const BaseController = use("App/Controllers/BaseController");

class MatchJoinController extends BaseController {
  async update({ response, request, params }) {
    const { matchId } = params;
    const user = request.user;

    if (!this.ObjectId.isValid(matchId)) {
      throw this.ResourceNotFoundException.invoke();
    }

    // Find match that has not started
    let match = await this.Match.findOne({
      _id: matchId,
      endedAt: null,
      $or: [{ "white.readyAt": null }, { "black.readyAt": null }]
    });

    if (!match) {
      throw this.ResourceNotFoundException.invoke("Match not found!");
    }

    const blackOrWhite =
      String(match.white.user) === String(user._id) ? "white" : "black";
    const opponentColor = blackOrWhite !== "white" ? "white" : "black";

    // Join user
    match[blackOrWhite].user = user._id;
    await match.save();

    await match
      .populate("white.user")
      .populate("black.user")
      .execPopulate();

    // Update opponents data through socket
    const opponentMatchData = Object.assign({}, match.toJSON());

    // Hide authenticated user pieces to opponent player
    opponentMatchData[blackOrWhite].pieces.map(piece => {
      piece.strength = "777";
      return piece;
    });

    if (match[opponentColor].user) {
      this.SocketIo.in(match[opponentColor].user._id).emit(
        "player-joined",
        opponentMatchData
      );
    }

    // Response with match id to save bandwidth
    match = { _id: match._id };

    response.apiUpdated(match);
  }
}
module.exports = MatchJoinController;

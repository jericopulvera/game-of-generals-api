"use strict";
const BaseController = use("App/Controllers/BaseController");

class MatchSubmitPiecesController extends BaseController {
  async update({ request, response, params }) {
    const { playerPieces } = request.all();

    let match = await this.Match.findOne({ _id: params.matchId });

    if (!match) {
      throw this.ResourceNotFoundException.invoke("Match does not exist");
    }

    const playerPiecesColor = getPlayerPiecesColor(request.user._id, match);

    if (!playerPiecesColor) {
      throw this.UnauthorizeException.invoke("Action not allowed");
    }

    match[playerPiecesColor].pieces = playerPieces;
    match[playerPiecesColor].readyAt = Date.now();
    match = await match.save();

    await match
      .populate("white.user")
      .populate("black.user")
      .execPopulate();

    const opponentPiecesColor =
      playerPiecesColor === "white" ? "black" : "white";

    // Send new match data to opponent
    if (match[opponentPiecesColor].user) {
      this.SocketIo.in(match[opponentPiecesColor].user._id).emit(
        "player-ready",
        hidePieces({ ...match.toJSON() }, playerPiecesColor)
      );
    }

    // Hide opponent pieces to authenticated Player
    match = hidePieces({ ...match.toJSON() }, opponentPiecesColor);

    return response.apiUpdated(match);
  }
}

module.exports = MatchSubmitPiecesController;

function hidePieces(matchData, playerHidingPieces) {
  matchData[playerHidingPieces].pieces.map(piece => {
    piece.strength = "777";
    return piece;
  });
  return matchData;
}

function getPlayerPiecesColor(userId, match) {
  if (String(match.white.user) === String(userId)) {
    return "white";
  }

  if (String(match.black.user) === String(userId)) {
    return "black";
  }

  return null;
}

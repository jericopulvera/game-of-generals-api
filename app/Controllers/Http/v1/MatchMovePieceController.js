"use strict";
const BaseController = use("App/Controllers/BaseController");

class MatchMovePiceController extends BaseController {
  async update({ request, response, params }) {
    const { pieceId, targetColumn, targetRow } = request.all();
    const { matchId } = params;

    const user = request.user;

    // Validate if column and row exists and valid
    const validcolumn = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
    const validrow = [8, 7, 6, 5, 4, 3, 2, 1];
    if (!validcolumn.includes(targetColumn) || !validrow.includes(targetRow)) {
      throw Error("Invalid column");
    }

    // Validate if user who moving the piece is in the match
    let match = await this.Match.findOne({
      _id: matchId,
      "white.readyAt": { $ne: null },
      "black.readyAt": { $ne: null },
      $or: [
        { "white.user": user._id, "white.pieces._id": pieceId },
        { "black.user": user._id, "black.pieces._id": pieceId }
      ]
    });

    if (!match) {
      throw Error("Match not found or piece not found!");
    }

    // Validate if match has not ended
    if (match.endedAt) {
      throw Error("Match has ended!");
    }

    // Validate if targetColumn is valid

    // Validate if it is user turn
    const playerPiecesColor =
      String(match.white.user) === String(user._id) ? "white" : "black";
    const opponentPiecesColor =
      playerPiecesColor !== "white" ? "white" : "black";
    const blackMovesSum = match.black.pieces.reduce(
      (accumulator, piece) => accumulator + piece.positionHistory.length,
      0
    );

    const whiteMovesSum = match.white.pieces.reduce(
      (accumulator, piece) => accumulator + piece.positionHistory.length,
      0
    );

    const whiteCanMove = whiteMovesSum === blackMovesSum; // white can move if white moves is equals to black moves
    const blackCanMove = whiteMovesSum - blackMovesSum === 1; // black can move if black moves is less than -1 of white moves
    if (
      (playerPiecesColor === "white" && !whiteCanMove) ||
      (playerPiecesColor === "black" && !blackCanMove)
    ) {
      throw Error("Its not your turn yet");
    }

    // Update column In Match Document
    const movingPieceIndex = match[playerPiecesColor].pieces.findIndex(
      piece => String(piece._id) === pieceId
    );
    const movingPiece = match[playerPiecesColor].pieces[movingPieceIndex];

    const pieceInTargetCellIndex = match[opponentPiecesColor].pieces.findIndex(
      piece =>
        piece.column === targetColumn &&
        piece.row === targetRow &&
        piece.isAlive
    );

    const pieceInTargetCell =
      match[opponentPiecesColor].pieces[pieceInTargetCellIndex];

    // Piece Collide Logic
    if (pieceInTargetCell) {
      // If moving Piece can defeat target Piece
      if (canCapture(movingPiece, pieceInTargetCell)) {
        // Remove piece in target column
        match[opponentPiecesColor].pieces[
          pieceInTargetCellIndex
        ].isAlive = false;
      }
      // If Piece is same in strength
      else if (movingPiece.strength === pieceInTargetCell.strength) {
        match[playerPiecesColor].pieces[movingPieceIndex].isAlive = false;
        match[opponentPiecesColor].pieces[
          pieceInTargetCellIndex
        ].isAlive = false;
      }
      // Remove moving weakerMovingPiece
      else {
        match[playerPiecesColor].pieces[movingPieceIndex].isAlive = false;
      }
    }

    if (flagIsDefeated(match)) {
      match.endedAt = Date.now();
    }

    movingPiece.positionHistory.push({
      column: movingPiece.column,
      row: movingPiece.row
    });
    movingPiece.column = targetColumn;
    movingPiece.row = targetRow;

    match = await match.save();

    await match
      .populate("white.user")
      .populate("black.user")
      .execPopulate();

    // Send socket event to enemy player
    const opponentMatchData = Object.assign({}, match.toJSON());
    opponentMatchData[playerPiecesColor].pieces.map(piece => {
      piece.strength = "777";
      return piece;
    });

    if (match[opponentPiecesColor].user) {
      this.SocketIo.in(match[opponentPiecesColor].user._id).emit(
        "player-move",
        opponentMatchData
      );
    }

    // Hide opponent player Pieces
    match[opponentPiecesColor].pieces.map(piece => {
      piece.strength = "777";
      return piece;
    });

    // const moveData = {
    //   _id: match._id,
    //   playerPiecesColor,
    //   selectedPieceId: pieceId,
    //   targetColumn,
    //   targetRow
    // };

    // this.SocketIo.in(match[opponentPiecesColor].user).emit(
    //   "player-move",
    //   moveData
    // );

    return response.apiUpdated(match);
  }
}

function canCapture(movingPiece, pieceInTargetCell) {
  // Spy special battle logic
  if (movingPiece.strength === 0 && pieceInTargetCell.strength > 2) {
    return true;
  }
  if (pieceInTargetCell.strength === 0 && movingPiece.strength > 2) {
    return false;
  }

  // Flag capture logic
  if (movingPiece.strength === -1 && pieceInTargetCell.strength === -1) {
    return true;
  }

  return movingPiece.strength > pieceInTargetCell.strength;
}

function flagIsDefeated(match) {}

module.exports = MatchMovePiceController;

"use strict";
const BaseController = use("App/Controllers/BaseController");
const Factory = require("../../../../database/Factory");

class MatchController extends BaseController {
  async index({ request, response }) {
    let { limit } = request.all();
    limit = parseInt(limit);

    if (limit < 10 || limit < 0) {
      limit = 10;
    }

    const conditions = {
      endedAt: null
    };

    if (request.user) {
      conditions.$or = [
        {
          "white.user": { $ne: request.user._id }
        },
        {
          "black.user": { $ne: request.user._id }
        }
      ];
    } else {
      conditions.$or = [{ "white.user": null }, { "black.user": null }];
    }

    const matches = await this.Match.find(conditions)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("white.user")
      .populate("black.user")
      .populate("createdBy");

    response.apiSuccess(matches);
  }

  async show({ request, response, params }) {
    let { matchId } = params;
    const user = request.user;

    if (!this.ObjectId.isValid(matchId)) {
      throw this.ResourceNotFoundException.invoke();
    }

    const match = await this.Match.findOne({
      _id: matchId,
      $or: [{ "white.user": user._id }, { "black.user": user._id }]
    });

    if (!match) {
      throw this.ResourceNotFoundException.invoke("Match not found!");
    }

    // Hide opponent player Pieces
    const oppositePlayerPiecesColor =
      String(match.white.user) === String(user._id) ? "black" : "white";
    match[oppositePlayerPiecesColor].pieces.map(piece => {
      piece.strength = "777";
      return piece;
    });

    await match
      .populate("white.user")
      .populate("black.user")
      .populate("createdBy")
      .execPopulate();

    return response.apiSuccess(match);
  }

  async store({ response, request }) {
    const match = await Factory.model("App/Models/Match").create({
      createdBy: request.user._id,
      white: {
        user: request.user._id
      },
      black: {
        user: null
      }
    });

    await match
      .populate("white.user")
      .populate("black.user")
      .populate("createdBy")
      .populate("winner")
      .execPopulate();

    this.SocketIo.emit("new-match", match);

    response.apiCreated(match);
  }
}

module.exports = MatchController;

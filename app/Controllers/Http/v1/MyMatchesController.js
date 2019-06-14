"use strict";
const BaseController = use("App/Controllers/BaseController");

class MyMatchesController extends BaseController {
  async index({ request, response }) {
    let { limit } = request.all();
    limit = parseInt(limit);

    if (limit < 10 || limit < 0) {
      limit = 10;
    }

    const matches = await this.Match.find({
      $or: [
        { "white.user": request.user._id },
        { "black.user": request.user._id }
      ]
    })
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("white.user")
      .populate("black.user")
      .populate("createdBy")
      .populate("winner");

    response.apiSuccess(matches);
  }
}

module.exports = MyMatchesController;

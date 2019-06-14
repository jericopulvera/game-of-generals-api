"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const BaseController = use("App/Controllers/BaseController");

class Auth extends BaseController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request }, next) {
    const authorizationHeader = request.header("authorization");

    if (!authorizationHeader) {
      return await next();
    }

    const parts = authorizationHeader.split(" ");

    if (parts.length < 2) {
      return await next();
    }

    const token = parts[1];

    const data = await this.Jwt.verify(token);

    if (!data) {
      return await next();
    }

    const user = await this.User.findOne(
      { _id: this.ObjectId(data._id) },
      "-password"
    );

    if (!user) {
      return await next();
    }

    request.user = user;

    // call next to advance the request
    return await next();
  }
}

module.exports = Auth;

"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const BaseController = use("App/Controllers/BaseController");

class CustomAuth extends BaseController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request }, next) {
    const authorizationHeader = request.header("authorization");

    if (!authorizationHeader) {
      throw this.InvalidTokenException.invoke();
    }

    const parts = authorizationHeader.split(" ");

    if (parts.length < 2) {
      throw this.InvalidTokenException.invoke();
    }

    const token = parts[1];

    const data = await this.Jwt.verify(token);

    if (!data) {
      throw this.InvalidTokenException.invoke();
    }

    const user = await this.User.findOne(
      { _id: this.ObjectId(data._id) },
      "-password"
    );

    if (!user) {
      throw this.InvalidTokenException.invoke();
    }

    request.user = user;

    // call next to advance the request
    await next();
  }
}

module.exports = CustomAuth;

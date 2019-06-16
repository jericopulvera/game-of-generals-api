"use strict";

const BaseController = use("App/Controllers/BaseController");

class FacebookLoginController extends BaseController {
  async store({ request, response, mongoSession }) {
    try {
      const { data } = await this.axios.get(
        `https://graph.facebook.com/me?fields=id,email,name,gender,picture.type(large)&access_token=${request.input(
          "accessToken"
        )}`
      );

      let user = await this.User.findOne({ fbId: data.id });

      if (!user) {
        const name = {
          firstName: data.name
            .split(" ")
            .slice(0, -1)
            .join(" "),
          lastName: data.name
            .split(" ")
            .slice(-1)
            .join(" ")
        };

        user = await this.User.create({
          name: `${name.firstName} ${name.lastName}`,
          fbId: data.id,
          email: data.email ? data.email : null,
          password: this.ObjectId().toString() // generate unknown password
        });
      }

      if (user.deletedAt) throw this.UnauthorizeException.invoke();

      const token = await this.Jwt.generate({
        _id: user._id
      });

      response.apiSuccess({ token: token });
    } catch (error) {
      console.log(error);
      throw this.UnAuthorizeException.invoke();
    }
  }
}

module.exports = FacebookLoginController;

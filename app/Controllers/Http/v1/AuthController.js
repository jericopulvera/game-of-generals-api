'use strict'
const BaseController = use('App/Controllers/BaseController')

class AuthController extends BaseController {
  async login ({ request, response }) {
    const { email, password } = request.all()
    const userDocument = await this.User.findOne({ email: email })

    if (!userDocument) {
      throw this.LoginFailedException.invoke('Invalid email or password')
    }

    const isMatched = await this.Hash.verify(password, userDocument.password)
    if (!isMatched) {
      throw this.LoginFailedException.invoke('Invalid email or password')
    }

    const token = await this.Jwt.generate({
      _id: userDocument._id
    })

    return response.apiSuccess({ token: token, user: userDocument })
  }

  async me ({ request, response }) {
    let user = request.user

    return response.apiSuccess(user)
  }
}

module.exports = AuthController

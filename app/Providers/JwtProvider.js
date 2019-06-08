'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const jwt = require('jsonwebtoken')

class JwtProvider extends ServiceProvider {
  register () {
    this.app.singleton('Providers/Jwt', () => {
      const Config = this.app.use('Adonis/Src/Config')
      const secret = Config.get('app.appKey')
      return {
        generate: async (data) => {
          return jwt.sign({ data: data }, secret, { expiresIn: '5d' })
        },
        verify: async token => {
          try {
            const decodedToken = await jwt.verify(token, secret)
            return decodedToken.data
          } catch (error) {
            return false
          }
        }
      }
    })
  }
}

module.exports = JwtProvider

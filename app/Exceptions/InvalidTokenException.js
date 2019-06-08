'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class InvalidTokenException extends LogicalException {
  static invoke (message) {
    return new this(message || 'Invalid Token', 401, 'E_LOGIN_FAILED')
  }
  /**
     * Handle this exception by itself
     */
  // handle () {}

  async handle (error, { request, response }) {
    const json = {
      status: error.status,
      code: error.code,
      message: error.message,
      errors: error.errors
    }
    if (use('Env').get('NODE_ENV') === 'development') {
      json.traces = error.stack
    }
    return response.status(error.status).json(json)
  }
}

module.exports = InvalidTokenException

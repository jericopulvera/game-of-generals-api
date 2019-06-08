'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class UploadErorrException extends LogicalException {
  static invoke (errors) {
    const error = new this('Upload Error', 409, 'E_UPLOAD_ERROR')
    error.errors = errors
    return error
  }
  /**
     * Handle this exception by itself
     */
  async handle (error, { request, response, session }) {
    if (request.url().indexOf('/api/') === 0) {
      let json = {
        status: error.status,
        code: error.code,
        errors: error.errors,
        message: error.message
      }
      if (use('Env').get('NODE_ENV') === 'development') {
        json.traces = error.stack
      }
      return response.status(error.status).json(json)
    }
    session.withErrors({ error: error.message }).flashAll()
    await session.commit()
    response.redirect('/notfound')
  }
}

module.exports = UploadErorrException

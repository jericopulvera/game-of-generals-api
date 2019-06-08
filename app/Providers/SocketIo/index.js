'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class SocketIoProvider extends ServiceProvider {
  register () {
    this.app.singleton('Providers/SocketIo', (app) => {
      const io = app.use('socket.io')(app.use('Server').getInstance(), {
        path: '/socket.io',
        origins: '*:*'
      })

      return io
    })
  }
}

module.exports = SocketIoProvider

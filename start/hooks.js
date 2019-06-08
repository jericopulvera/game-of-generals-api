const { hooks } = require('@adonisjs/ignitor')

hooks.after.httpServer(() => {
  const io = use('SocketIo')
  const Jwt = use('Jwt')

  io.on('connection', async socket => {
    const token = socket.handshake.query.token

    // Guest user
    if (token) {
      // Admin
      const data = await Jwt.verify(token)
      if (!data) {
        return
      }

      socket.join(data._id.toString())
      // socket.join('admin')
    }

    socket.on('joinConversation', conversationId => {
      socket.join(conversationId)
    })

    socket.on('isTyping', async ({ conversationId, userId }) => {
      io.in(conversationId).emit('is-typing', userId)
    })

    socket.on('guestIsTyping', async conversationId => {
      io.in('admin').emit('guest-is-typing', conversationId)
    })
  })
})

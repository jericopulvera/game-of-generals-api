'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

// Auth
Route.post('/v1/auth/login', '/v1/AuthController.login')
Route.get('/v1/auth/me', '/v1/AuthController.me').middleware('customAuth')

// Admin Conversations
Route.get(
  '/v1/admin/conversations',
  '/v1/Admin/ConversationController.index'
).middleware('customAuth')
Route.get(
  '/v1/admin/conversations/:id/messages',
  '/v1/Admin/ConversationMessageController.index'
).middleware('customAuth')
Route.post(
  '/v1/admin/conversations/:id/messages',
  '/v1/Admin/ConversationMessageController.store'
).middleware('customAuth')
// .middleware(['customAuth', 'throttle:10,10'])

// Conversations
Route.post('/v1/conversations', '/v1/ConversationController.store')
// .middleware(['throttle:10,10'])
Route.get(
  '/v1/conversations/:id/messages',
  '/v1/ConversationMessageController.index'
)
Route.post(
  '/v1/conversations/:id/messages',
  '/v1/ConversationMessageController.store'
)
// .middleware(['throttle:10,10'])

Route.get('/v1/matches/:matchId', '/v1/MatchController.show').middleware(
  'customAuth'
)
Route.post('/v1/matches', '/v1/MatchController.store').middleware('customAuth')
Route.patch(
  '/v1/matches/:matchId/move-piece',
  '/v1/MatchController.movePiece'
).middleware('customAuth')

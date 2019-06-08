'use strict'

const { test, trait, afterEach } = use('Test/Suite')('Messages')
const _this = use('App/Controllers/BaseController').instance()
const Factory = use('MongooseFactory')

trait('Test/ApiClient')

test('Guest user message will return a conversation id', async ({
  client,
  assert
}) => {
  const messageData = {
    type: 'text',
    data: {
      text: 'test'
    }
  }

  const response = await client
    .post('/api/v1/conversations')
    .send({
      message: messageData
    })
    .end()

  response.assertStatus(201)
  assert.isString(response.body.data.conversationId)

  // Assert message and conversation is created
  const [messageDocuments, conversationDocument] = await Promise.all([
    _this.Message.find({
      conversation: _this.ObjectId(response.body.data.conversationId)
    }),
    _this.Conversation.findById(response.body.data.conversationId)
  ])

  assert.isNotEmpty(messageDocuments)
  messageDocuments.forEach(message => {
    assert.isDefined(message.data)
    assert.isDefined(message.type)
  })

  assert.isObject(conversationDocument)
})

test('Guest user can send a message to a conversation', async ({ client }) => {
  const conversation = await Factory.model('App/Models/Conversation').create({})
  const messageData = {
    type: 'text',
    data: {
      text: 'test'
    }
  }

  const response = await client
    .post(`/api/v1/conversations/${conversation._id}/messages`)
    .send({ message: messageData })
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    data: {
      _id: conversation._id.toString(),
      lastMessage: {
        ...messageData
      }
    }
  })
})

test('Guest user can get conversation messages using a message id', async ({
  client,
  assert
}) => {
  const conversation = await Factory.model('App/Models/Conversation').create({})
  const messages = await Factory.model('App/Models/Message').createMany({}, 5)

  const response = await client
    .get(`/api/v1/conversations/${conversation._id}/messages`)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    data: messages.map(message => message)
  })
})

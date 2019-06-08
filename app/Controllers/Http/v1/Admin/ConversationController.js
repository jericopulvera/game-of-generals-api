'use strict'

const BaseController = use('App/Controllers/BaseController')

class ConversationController extends BaseController {
  async index ({ request, response }) {
    const conversationDocuments = await this.Conversation.find({}).populate(
      'lastMessage'
    )

    return response.status(200).json({
      data: conversationDocuments
    })
  }
}

module.exports = ConversationController

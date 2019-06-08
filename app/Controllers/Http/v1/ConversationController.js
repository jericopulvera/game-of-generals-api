'use strict'

const BaseController = use('App/Controllers/BaseController')

class ConversationController extends BaseController {
  async store ({ request, response }) {
    const { message } = request.all()

    // Upload media
    const file = request.file('message.data.file', {
      size: '5mb'
    })

    if (file) {
      let cloudinaryMeta = await this.Cloudinary.v2.uploader.upload(
        file.tmpPath,
        { resource_type: 'auto', use_filename: true }
      )

      message.data.file = {
        url: cloudinaryMeta.secure_url,
        name: file.clientName
      }
    }

    const [messageDocument, adminUserDocument] = await Promise.all([
      this.Message.create({
        author: 'me',
        ...message
      }),
      this.User.findOne()
    ])

    let conversationDocument = await this.Conversation.create({
      participants: [this.ObjectId(adminUserDocument._id)],
      lastMessage: this.ObjectId(messageDocument._id)
    })
    messageDocument.set('conversation', this.ObjectId(conversationDocument._id))
    await messageDocument.save()

    conversationDocument = await this.Conversation.populate(
      conversationDocument,
      {
        path: 'lastMessage'
      }
    )

    this.SocketIo.in('admin').emit(
      'new-conversation',
      conversationDocument.toJSON()
    )

    return response.status(201).json({
      data: {
        conversationId: conversationDocument._id.toString(),
        data: messageDocument.data.toJSON()
      }
    })
  }
}

module.exports = ConversationController

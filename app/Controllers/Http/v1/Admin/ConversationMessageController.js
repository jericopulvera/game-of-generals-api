'use strict'

const BaseController = use('App/Controllers/BaseController')

class ConversationMessageController extends BaseController {
  async index ({ response, params }) {
    const messageDocuments = await this.Message.find({
      conversation: this.ObjectId(params.id)
    })

    return response.status(200).json({
      data: messageDocuments
    })
  }

  async store ({ request, response, params }) {
    const { message } = request.all()
    message.author = request.user._id.toString()

    // Upload media
    const file = request.file('message.data.file', {
      size: '5mb'
    })

    // if has file
    if (file) {
      let cloudinaryMeta = await this.Cloudinary.v2.uploader.upload(
        file.tmpPath,
        { resource_type: 'auto' }
      )

      message.data.file = {
        url: cloudinaryMeta.secure_url,
        name: file.clientName
      }
    }

    const conversationDocument = await this.Conversation.findById(params.id)
    const messageDocument = await this.Message.create({
      conversation: this.ObjectId(conversationDocument._id),
      ...message
    })
    conversationDocument.set('lastMessage', messageDocument._id)
    conversationDocument.save()
    conversationDocument.populate('lastMessage')

    this.SocketIo.in(conversationDocument._id).emit(
      'new-message',
      messageDocument.toJSON()
    )

    this.SocketIo.in('admin').emit(
      'new-message-for-admin',
      messageDocument.toJSON()
    )

    return response.status(201).json({
      data: {
        conversation: conversationDocument.toJSON(),
        message: messageDocument.toJSON()
      }
    })
  }
}

module.exports = ConversationMessageController

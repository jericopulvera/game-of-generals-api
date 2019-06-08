'use strict'

const BaseController = use('App/Controllers/BaseController')

class ConversationMessageController extends BaseController {
  async index ({ response, params }) {
    const [messageDocuments, conversationDocument] = await Promise.all([
      this.Message.find({
        conversation: this.ObjectId(params.id)
      }),
      this.Conversation.findById(params.id)
        .populate('lastMessage')
        .populate('participants', '-password')
    ])

    return response.status(200).json({
      data: messageDocuments,
      conversation: conversationDocument.toJSON()
    })
  }

  async store ({ request, response, params }) {
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
        conversation: conversationDocument,
        message: messageDocument
      }
    })
  }
}

module.exports = ConversationMessageController

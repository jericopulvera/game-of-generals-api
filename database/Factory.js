const Factory = use('MongooseFactory')
const _this = use('App/Controllers/BaseController').instance()

Factory.blueprint('App/Models/User', async (faker, i, data) => {
  const name = data.name ? data.name : `${faker.first()} ${faker.last()}`
  const role = data.role ? data.role : 'user'
  const email = data.email ? data.email : faker.email()
  const password = data.password ? data.password : '123123123'
  const imageUrl = data.imageUrl ? data.imageUrl : ''

  return {
    name,
    role,
    email,
    password,
    imageUrl
  }
})

Factory.blueprint('App/Models/Conversation', async (faker, i, data) => {
  const participants = data.participants
    ? data.participants
    : [await Factory.model('App/Models/User').create({ role: 'admin' })]
  const lastMessage = data.lastMessage
    ? data.lastMessage
    : await Factory.model('App/Models/Message').create()

  return {
    participants,
    lastMessage
  }
})

Factory.blueprint('App/Models/Message', async (faker, i, passedData) => {
  const conversation = passedData.conversation ? passedData.conversation : null
  const author = passedData.author ? passedData.author : null
  const type = passedData.type ? passedData.type : 'text'
  const data = passedData.data
    ? passedData.data
    : { type: 'text', text: 'test' }

  return {
    conversation,
    author,
    type,
    data
  }
})

const defaultPieces = whiteOrBlack => {
  const pieces = []
  const basePieces = [
    -1,
    -1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    7,
    8,
    9,
    10
  ]

  let positionNumberBoundary = []
  let positionBoundary = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']

  if (whiteOrBlack === 'white') {
    positionNumberBoundary = [1, 2, 3]
  } else {
    positionNumberBoundary = [6, 7, 8]
  }

  while (basePieces.length > 0) {
    const strength = basePieces.pop()

    const generatePiece = () => {
      const position =
        positionBoundary[Math.floor(Math.random() * positionBoundary.length)]
      const positionNumber =
        positionNumberBoundary[
          Math.floor(Math.random() * positionNumberBoundary.length)
        ]

      const pieceExistsInPosition = pieces.find(item => {
        return (
          item.position === position && item.positionNumber === positionNumber
        )
      })

      if (!pieceExistsInPosition) {
        pieces.push({
          strength: strength,
          position: position,
          positionNumber: positionNumber,
          positionHistory: []
        })
      } else {
        generatePiece()
      }
    }

    generatePiece()
  }

  return pieces
}

Factory.blueprint('App/Models/Match', async (faker, i, passedData) => {
  const white = passedData.white
    ? passedData.white
    : {
        user: (await Factory.model('App/Models/User').create())._id
      }

  white.pieces = defaultPieces('white')

  const black = passedData.black
    ? passedData.black
    : {
        user: (await Factory.model('App/Models/User').create('black'))._id
      }
  black.pieces = defaultPieces('black')

  const createdBy = passedData.createdBy
    ? passedData.createdBy
    : (await Factory.model('App/Models/User').create())._id

  return {
    white,
    black,
    createdBy
  }
})

module.exports = Factory
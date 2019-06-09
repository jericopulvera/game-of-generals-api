'use strict'
const BaseController = use('App/Controllers/BaseController')

class MatchController extends BaseController {
  async show({ request, response, params }) {
    let { matchId } = params
    const user = request.user

    if (!this.ObjectId.isValid(matchId)) {
      throw this.ResourceNotFoundException.invoke()
    }

    const match = await this.Match.findOne({
      // _id: matchId,
      $or: [{ 'white.user': user._id }, { 'black.user': user._id }]
    })

    if (!match) {
      throw this.ResourceNotFoundException.invoke('Match not found!')
    }

    // Hide opponent player Pieces
    const oppositePlayerPiecesColor =
      String(match.white.user) === String(user._id) ? 'black' : 'white'
    match[oppositePlayerPiecesColor].pieces.map(piece => {
      piece.strength = '777'
      return piece
    })

    return response.apiSuccess(match)
  }

  async store({ response, request }) {
    const match = await this.Match.create({
      createdBy: request.user._id
    })

    response.apiCreated(match)
  }

  async joinMatch({ response, request, params }) {
    const { matchId } = params

    if (!this.ObjectId.isValid(matchId)) {
      throw this.ResourceNotFoundException.invoke()
    }

    // Find match that has not started
    const match = await this.Match.findOne({ _id: matchId })

    response.apiUpdated(match)
  }

  async movePiece({ request, response, params }) {
    const {
      pieceId,
      position: targetPosition,
      positionNumber: targetPositionNumber
    } = request.all()
    const { matchId } = params

    const user = request.user

    // Validate if position and positionNumber exists and valid
    const validPosition = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
    const validPositionNumber = [8, 7, 6, 5, 4, 3, 2, 1]
    if (
      !validPosition.includes(targetPosition) ||
      !validPositionNumber.includes(targetPositionNumber)
    ) {
      throw Error('Invalid Position')
    }

    // Validate if user who moving the piece is in the match
    let match = await this.Match.findOne({
      _id: matchId,
      $or: [
        { 'white.user': user._id, 'white.pieces._id': pieceId },
        { 'black.user': user._id, 'black.pieces._id': pieceId }
      ]
    })

    if (!match) {
      throw Error('Match not found or piece not found!')
    }

    // Validate if match has not ended
    if (match.endedAt) {
      throw Error('Match has ended!')
    }

    // Validate if targetPosition is valid

    // Validate if it is user turn
    const blackOrWhite =
      String(match.white.user) === String(user._id) ? 'white' : 'black'
    const opponentColor = blackOrWhite !== 'white' ? 'white' : 'black'
    const blackMovesSum = match.black.pieces.reduce(
      (accumulator, piece) => accumulator + piece.positionHistory.length,
      0
    )

    const whiteMovesSum = match.white.pieces.reduce(
      (accumulator, piece) => accumulator + piece.positionHistory.length,
      0
    )

    const whiteCanMove = whiteMovesSum === blackMovesSum // white can move if white moves is equals to black moves
    const blackCanMove = whiteMovesSum - blackMovesSum === 1 // black can move if black moves is less than -1 of white moves
    if (
      (blackOrWhite === 'white' && !whiteCanMove) ||
      (blackOrWhite === 'black' && !blackCanMove)
    ) {
      throw Error('Its not your turn yet')
    }

    // Update Position In Match Document
    const movingPieceIndex = match[blackOrWhite].pieces.findIndex(
      piece => String(piece._id) === pieceId
    )
    const movingPiece = match[blackOrWhite].pieces[movingPieceIndex]

    const pieceInTargetPositionIndex = match[opponentColor].pieces.findIndex(
      piece =>
        piece.position === targetPosition && // FVCK!!!!!!! movingPiece.position to targetPosition is the fix and it took me hours to find it
        piece.positionNumber === targetPositionNumber && // FVCK!!!!!!! movingPiece.positionNumber to targetPositionNumber is the fix and it took me hours to find it
        piece.isAlive
    )

    const pieceInTargetPosition =
      match[opponentColor].pieces[pieceInTargetPositionIndex]

    // Piece Collide Logic
    if (pieceInTargetPosition) {
      // If Piece is same in strength
      if (movingPiece.strength === pieceInTargetPosition.strength) {
        match[blackOrWhite].pieces[movingPieceIndex].isAlive = false
        match[opponentColor].pieces[pieceInTargetPositionIndex].isAlive = false
      }
      // If moving Piece can defeat target Piece
      if (canDefeat(movingPiece, pieceInTargetPosition)) {
        // Remove piece in target position
        match[opponentColor].pieces[pieceInTargetPositionIndex].isAlive = false
      } else {
        // Remove moving weakerMovingPiece
        match[blackOrWhite].pieces[movingPieceIndex].isAlive = false
      }
    }

    if (flagIsDefeated(match)) {
      match.endedAt = Date.now()
    }

    movingPiece.positionHistory.push({
      position: movingPiece.position,
      positionNumber: movingPiece.positionNumber
    })
    movingPiece.position = targetPosition
    movingPiece.positionNumber = targetPositionNumber

    match = await match.save()

    // Send socket event to enemy player
    const opponentMatchData = Object.assign({}, match.toJSON())
    opponentMatchData[blackOrWhite].pieces.map(piece => {
      piece.strength = '777'
      return piece
    })
    this.SocketIo.in(match[opponentColor].user).emit(
      'player-move',
      opponentMatchData
    )

    // Hide opponent player Pieces
    match[opponentColor].pieces.map(piece => {
      piece.strength = '777'
      return piece
    })

    return response.apiUpdated(match)
  }
}

function canDefeat(movingPiece, pieceInTargetPosition) {
  // Spy special battle logic
  if (movingPiece.strength === 0 && pieceInTargetPosition.strength > 2) {
    return true
  }

  return movingPiece.strength > pieceInTargetPosition.strength
}

function flagIsDefeated(match) {}

module.exports = MatchController

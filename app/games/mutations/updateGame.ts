import { NotFoundError, resolver } from "blitz"
import db from "db"

import getActivePlayer from "app/games/utils/getActivePlayer"
import setCharAt from "app/core/utils/setCharAt"
import { UpdateGame } from "app/auth/validations"
import { FIRST_PLAYER, SECOND_PLAYER } from "../utils/constants"
import { computeGameStatus } from "../utils/computeGameStatus"

export default resolver.pipe(resolver.zod(UpdateGame), async ({ id, token, x, y }) => {
  const game = await db.game.findFirst({ where: { id } })

  // Check if game exists
  if (!game) throw new NotFoundError()

  // Check Game Status
  const status = computeGameStatus(game)
  if (status === "waiting") throw new Error("Game has not started yet")
  if (status === "over") throw new Error("Game is over")

  // Check if token is valid
  if (token !== game.player1 && token !== game.player2) throw new Error("Invalid token")

  // Check player turn
  const requesterPlayer = token === game.player1 ? FIRST_PLAYER : SECOND_PLAYER
  const activePlayer = getActivePlayer(game)
  if (requesterPlayer !== activePlayer) throw new Error("It's not your turn to play")

  // Check if move is valid
  if (game.state[x + y * 3] !== " ") throw new Error("Invalid move")

  return await db.game.update({
    where: { id },
    data: {
      turn: game.turn + 1,
      state: setCharAt(game.state, x + y * 3, activePlayer),
    },
  })
})

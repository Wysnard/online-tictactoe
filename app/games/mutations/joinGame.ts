import { NotFoundError, resolver } from "blitz"
import { v4 as uuidV4 } from "uuid"
import db from "db"

import { JoinGame } from "app/auth/validations"

export default resolver.pipe(resolver.zod(JoinGame), async ({ id }) => {
  const game = await db.game.findFirst({ where: { id } })

  if (!game) throw new NotFoundError()
  if (game.player2) throw new Error("Game is full")

  const player2 = uuidV4()

  await db.game.update({
    where: { id },
    data: {
      player2,
    },
  })

  return player2
})

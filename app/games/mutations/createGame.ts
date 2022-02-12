import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const GAME_EXPIRATION_IN_HOURS = 4

const CreateGame = z.object({})

export default resolver.pipe(resolver.zod(CreateGame), async (input) => {
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + GAME_EXPIRATION_IN_HOURS)

  const game = await db.game.create({
    data: {
      expiresAt,
      state: "         ",
    },
  })

  return game
})

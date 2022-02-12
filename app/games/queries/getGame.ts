import _ from "lodash"
import { resolver, NotFoundError } from "blitz"
import db, { Game } from "db"
import { z } from "zod"
import { computeGameStatus, TStatus } from "../utils/computeGameStatus"

// type GetGame = (arg: {
//   id: string
//   token: string
// }) => Promise<Game> | ((arg: { id: string }) => Promise<Omit<Game, "player1" | "player2">>)

const GetGame = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
  token: z.string().uuid().optional(),
})

interface GetGameResponse extends Omit<Game, "player1" | "player2"> {
  player1?: string
  player2?: string | null
  status: TStatus
}

export default resolver.pipe(
  resolver.zod(GetGame),
  async ({ id, token }): Promise<GetGameResponse> => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const game = await db.game.findFirst({ where: { id } })

    if (!game) throw new NotFoundError()

    return !token || token !== game.player1 || token !== game.player2
      ? { ..._.omit(game, ["player1", "player2"]), status: computeGameStatus(game) }
      : { ...game, status: computeGameStatus(game) }
  }
)

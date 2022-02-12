import { Game } from "db"
import whoWins from "./whoWins"

const STATUS = ["waiting", "playing", "over"] as const
export type TStatus = typeof STATUS[number]

export const computeGameStatus = (game: Game): TStatus => {
  if (!game.player2) return "waiting"

  const winner = whoWins(game)
  if (winner !== "nobody" || game.turn > 8) return "over"

  return "playing"
}

import { Game } from "db"
import { FIRST_PLAYER, SECOND_PLAYER } from "./constants"

const getActivePlayer = (game: Game) => {
  return game.turn % 2 === 0 ? FIRST_PLAYER : SECOND_PLAYER
}
export default getActivePlayer

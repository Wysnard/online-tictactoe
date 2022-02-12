import { Game } from "db"

const whoWins = (game: Game): string => {
  const { state } = game
  const board = state.split("")

  // Check horizontal wins
  for (let i = 0; i < 3; i++) {
    if (
      board[i * 3] !== " " &&
      board[i * 3] === board[i * 3 + 1] &&
      board[i * 3 + 1] === board[i * 3 + 2]
    ) {
      const cell = board[i * 3]
      if (cell) return cell
    }
  }

  //Check vertical wins
  for (let i = 0; i < 3; i++) {
    if (board[i] !== " " && board[i] === board[i + 3] && board[i + 3] === board[i + 6]) {
      const cell = board[i]
      if (cell) return cell
    }
  }

  //Check diagonal wins
  if (board[0] !== " " && board[0] === board[4] && board[4] === board[8]) {
    const cell = board[0]
    if (cell) return cell
  }
  if (board[2] !== " " && board[2] === board[4] && board[4] === board[6]) {
    const cell = board[2]
    if (cell) return cell
  }

  return "nobody"
}

export default whoWins

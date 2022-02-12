import { Suspense, useEffect, useState } from "react"
import { Head, Link, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getGame from "app/games/queries/getGame"
import updateGame from "app/games/mutations/updateGame"
import joinGame from "app/games/mutations/joinGame"
import whoWins from "app/games/utils/whoWins"

export const Game = () => {
  const gameId = useParam("gameId", "number") || 0
  const [token, setToken] = useState(localStorage.getItem(`${gameId}`) || undefined)
  const [joinGameMutation] = useMutation(joinGame, {
    onSuccess: (token) => {
      localStorage.setItem(`${gameId}`, token)
      setToken(token)
    },
  })
  const [game, { refetch }] = useQuery(
    getGame,
    { id: gameId, token },
    {
      refetchInterval: 1000,
    }
  )
  const [updateGameMutation] = useMutation(updateGame, {
    onSuccess: () => {
      refetch()
    },
  })
  useEffect(() => {
    if (!token && game.status === "waiting") {
      joinGameMutation({ id: gameId })
    }
  }, [joinGameMutation, token, gameId, game.status])

  return (
    <>
      <div>
        <h1>Game {game.id}</h1>
        <pre>{JSON.stringify(game, null, 2)}</pre>
        {token && <div>{token}</div>}
        {game.status === "waiting" && <div>Waiting for another player...</div>}
        {game.status === "playing" && (
          <div className="grid grid-cols-3 grid-rows-3 place-items-stretch h-60 w-60">
            {game.state.split("").map((cell, index) => (
              <div
                key={index}
                className="border border-solid border-black flex items-center justify-center"
                onClick={() => {
                  if (token)
                    updateGameMutation({
                      id: game.id,
                      token,
                      x: index % 3,
                      y: Math.floor(index / 3),
                    })
                }}
              >
                {cell}
              </div>
            ))}
          </div>
        )}
        {game.status === "over" && <div>{whoWins(game as any)} has won the match</div>}
      </div>
    </>
  )
}

const ShowGamePage: BlitzPage = () => {
  const gameId = useParam("gameId", "number")

  return (
    <div>
      <Head>
        <title>Game {gameId}</title>
      </Head>

      <p>
        <Link href={Routes.GamesPage()}>
          <a>Games</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Game />
      </Suspense>
    </div>
  )
}

ShowGamePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowGamePage

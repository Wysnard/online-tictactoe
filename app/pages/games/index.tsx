import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getGames from "app/games/queries/getGames"
import createGame from "app/games/mutations/createGame"
import { FORM_ERROR, GameForm } from "app/games/components/GameForm"

const ITEMS_PER_PAGE = 100

export const GamesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ games, hasMore }] = usePaginatedQuery(getGames, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link href={Routes.ShowGamePage({ gameId: game.id })}>
              <a>{game.id}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const GamesPage: BlitzPage = () => {
  const router = useRouter()
  const [createGameMutation] = useMutation(createGame)

  return (
    <>
      <Head>
        <title>Games</title>
      </Head>

      <div>
        <GameForm
          submitText="Create Game"
          initialValues={{}}
          onSubmit={async (values) => {
            try {
              const game = await createGameMutation(values)
              localStorage.setItem(`${game.id}`, game.player1)
              router.push(Routes.ShowGamePage({ gameId: game.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />

        <Suspense fallback={<div>Loading...</div>}>
          <GamesList />
        </Suspense>
      </div>
    </>
  )
}

GamesPage.getLayout = (page) => <Layout>{page}</Layout>

export default GamesPage

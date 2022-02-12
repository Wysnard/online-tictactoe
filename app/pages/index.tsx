import Layout from "app/core/layouts/Layout"
import { GameForm } from "app/games/components/GameForm"
import createGame from "app/games/mutations/createGame"
import { BlitzPage, Routes, useMutation, useRouter } from "blitz"
import { FORM_ERROR } from "final-form"

const Home: BlitzPage = () => {
  const router = useRouter()
  const [createGameMutation] = useMutation(createGame)

  return (
    <div>
      <div>Welcome to Tic Tac Toe Online</div>
      <div>Create a Game and Invite a friend to play</div>
      <GameForm
        submitText="Create Game"
        initialValues={{}}
        onSubmit={async (values) => {
          try {
            const game = await createGameMutation(values)
            router.push(Routes.ShowGamePage({ gameId: game.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home

import { AuthorLink } from "./components/author-link"
import { ZabolotekForm } from "./components/zabolotek-form"

function App() {
  return (
    <div className="flex flex-col items-center justify-start gap-6 w-full h-screen text-center bg-background py-4 px-4">
      <section className="bg-background-darker p-4 rounded-lg inline-flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Zasady loterii</h2>
        <ul className="inline-flex flex-col items-center gap-1 text-sm text-balance *:bg-background-lighter *:p-1 *:px-2 *:shadow-sm *:rounded-lg">
          <li>
            Każdy z wyselekcjonowanych zawodników jest upoważniony do wzięcia
            udziału w loterii raz dziennie.
          </li>
          <li>
            Należy w tym celu wypełnić poniższy formularz i kliknąć przycisk{" "}
            <b>Zatwierdź</b>.
          </li>
          <li>
            Po zatwierdzeniu zostanie ujawnione, które liczby zostały trafione.
          </li>
          <li>
            Aby otrzymać nagrodę, należy zrobić screenshot lub zdjęcie
            zatwierdzonego formularza po czym przesłać je do organizatora
            loterii - <AuthorLink>Żabosława</AuthorLink>
          </li>
        </ul>
      </section>
      <ZabolotekForm />
      <footer className="mt-auto text-xs text-foreground-lighter p-4">
        Sponsorem loterii jest <AuthorLink>Żabosław Krajewski</AuthorLink>
      </footer>
    </div>
  )
}

export default App

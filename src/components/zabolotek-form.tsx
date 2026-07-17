import { clamp, cn, shuffle } from "@/lib/utils"
import { useMemo, useState } from "react"
import { ResultIndicator } from "./results-indicator"

const NUMBERS_COUNT = 6
const MINIMUM_MATCHES = 1
const confirmButtonId = "apply-button"
const resultInfoId = "result-info"

export function ZabolotekForm() {
  const [touched, setTouched] = useState(false)
  const [inputValues, setInputValues] = useState<
    Array<string> & { length: typeof NUMBERS_COUNT }
  >(Array.from({ length: NUMBERS_COUNT }, () => "") as never)
  const [confirmed, setConfirmed] = useState(false)
  /** Determines which numbers were correctly guessed */
  const [results, setResults] = useState<
    Array<boolean> & { length: typeof NUMBERS_COUNT }
  >(Array.from({ length: NUMBERS_COUNT }, () => false) as never)

  const hasDuplicates = useMemo(
    () => inputValues.some((v, i) => inputValues.indexOf(v) !== i),
    [inputValues],
  )
  const ready = useMemo(
    () => !hasDuplicates && inputValues.every((v) => v.match(/^[0-9]{2}$/)),
    [hasDuplicates, inputValues],
  )

  const focusInput = (index: number) => {
    if (index < 0 || index > NUMBERS_COUNT - 1) {
      return
    }
    const nextInput = document.getElementById(`number-${index}`)
    if (nextInput) {
      nextInput.focus()
    }
  }

  const focusButton = () => {
    const button = document.getElementById(confirmButtonId)
    if (button) {
      button.focus()
      button.scrollIntoView({ behavior: "smooth" })
    }
  }

  const confirm = () => {
    if (confirmed) {
      console.error("Already confirmed")
      return
    }

    const matchesCount = clamp(
      Math.round(Math.random() * NUMBERS_COUNT),
      MINIMUM_MATCHES,
      NUMBERS_COUNT,
    )
    setResults(
      shuffle(
        Array.from(
          { length: NUMBERS_COUNT },
          (_, index) => index < matchesCount,
        ),
      ) as never,
    )
    setConfirmed(true)

    setTimeout(() => {
      const resultInfo = document.getElementById(resultInfoId)
      if (resultInfo) {
        resultInfo.scrollIntoView({ behavior: "smooth" })
      }
    }, 500)
  }

  const guessedCount = useMemo(() => results.filter((v) => v).length, [results])

  return (
    <>
      <div className="relative text-center">
        <img
          src="/zabolotek/zabolotek-form.png"
          alt="Żabolotek"
          className="w-164 max-w-full drop-shadow-2xl drop-shadow-black/50"
          onClick={() => {
            focusInput(0)
          }}
        />
        {/* Values calculated based on the image layout */}
        <div className="absolute inset-x-0 mx-auto top-[51.93370166%] h-[16.43646409%] w-[83.42541436%] flex flex-row items-stretch justify-stretch gap-[2.649006623%]">
          {Array.from({ length: NUMBERS_COUNT }).map((_, i) => {
            const isTwoDigitNumber = inputValues[i].length === 2
            const isDuplicate =
              isTwoDigitNumber &&
              inputValues.filter((v) => v === inputValues[i]).length > 1

            return (
              <div
                key={i}
                className={cn(
                  "relative h-[80%] w-full my-auto flex items-center justify-center @container fill-mode-both delay-1000 duration-2000",
                  touched ? "" : "animate-in fade-in",
                )}
              >
                <input
                  type="number"
                  inputMode="numeric"
                  id={`number-${i}`}
                  readOnly={confirmed}
                  className={cn(
                    "h-full min-w-0 max-w-[61.8%] text-center font-bold p-0 text-[50cqw] border-b-2 border-foreground-lighter duration-2000 transition-colors",
                    touched
                      ? "border-transparent duration-100"
                      : "animate-bounce",
                    !isTwoDigitNumber && "text-muted-foreground",
                    isDuplicate && "text-red-500",
                    confirmed && "pointer-events-none",
                  )}
                  style={{ animationDelay: `${(NUMBERS_COUNT - i) * 0.1}s` }}
                  value={inputValues[i] ?? ""}
                  onChange={(e) => {
                    const parsedValue = e.target.value
                      .replace(/[^0-9]/g, "")
                      .substr(-2)
                    setInputValues((prev) => {
                      const newValues = [...prev]
                      newValues[i] = parsedValue
                      return newValues as never
                    })
                    const selfInput = document.getElementById(
                      `number-${i}`,
                    ) as HTMLInputElement
                    if (selfInput) {
                      selfInput.value = parsedValue
                    }

                    if (e.target.value.length === 2) {
                      if (i === NUMBERS_COUNT - 1) {
                        focusButton()
                      } else {
                        focusInput(i + 1)
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      focusInput(i + 1)
                    }
                    if (e.key === "Backspace" && inputValues[i] === "") {
                      focusInput(i - 1)
                    }
                  }}
                  onFocus={() => setTouched(true)}
                />
                <ResultIndicator
                  index={i}
                  confirmed={confirmed}
                  success={results[i]}
                />
              </div>
            )
          })}
        </div>
      </div>
      {confirmed && (
        <div
          id={resultInfoId}
          className="animate-in fade-in fill-mode-both flex flex-col items-center gap-2 contain-inline-size w-full"
        >
          <img
            src="/zabolotek/zabolotek-logo.png"
            alt="Żabolotek logo"
            className="h-32"
          />
          <div className="text-center text-pretty font-medium w-lg max-w-full">
            Gratulacje!
            <br />
            Zgadłeś/aś <b>{guessedCount}</b> liczb
            {guessedCount === 1 ? "ę" : guessedCount < 5 ? "y" : ""}.
            <br />
            Zrób zdjęcie lub screenshot powyższego formularza po czym prześlij
            je do Żabosława!
          </div>
        </div>
      )}
      <button
        id={confirmButtonId}
        disabled={!ready || confirmed}
        onClick={confirm}
        className={cn(
          "text-2xl font-bold bg-foreground-lighter text-background p-4 px-8 rounded-2xl shadow-lg border-2 transition-[opacity,scale,background-color] hover:bg-foreground cursor-pointer",
          ready && !confirmed
            ? "opacity-100 scale-100"
            : "opacity-0 scale-golden-reverse",
        )}
      >
        Zatwierdź
      </button>
    </>
  )
}

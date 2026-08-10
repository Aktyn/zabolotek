import { useEffect, useState } from "react"

const memes = [
  "psamian cytat.jpg",
  "four.jpg",
  "david-joke.jpg",
  "9jR3G8S7qiFHRGJq.jpg",
  "7oYKEoU2PaMzYH9G.jpg",
  "national.png",
]

const musics = ["dziub.mp3"]

export function PostConfirmContent() {
  const [randomMeme, setRandomMeme] = useState<string | null>(null)
  const [randomMusic, setRandomMusic] = useState<string | null>(null)

  useEffect(() => {
    setRandomMeme(memes[Math.floor(Math.random() * memes.length)])
    setRandomMusic(musics[Math.floor(Math.random() * musics.length)])
  }, [])

  return (
    <div className="mt-8 flex flex-col gap-6">
      {randomMeme && (
        <a href={`/zabolotek/memes/${randomMeme}`} target="_blank">
          <img
            src={`/zabolotek/memes/${randomMeme}`}
            alt={randomMeme}
            className="w-full h-full object-cover max-h-128 transition-transform hover:scale-110"
          />
        </a>
      )}
      <hr />
      {randomMusic && (
        <div>
          <p className="font-bold text-red-700">Uwaga! Ostra muza!</p>
          <audio
            src={`/zabolotek/musics/${randomMusic}`}
            controls
            autoPlay={false}
          />
        </div>
      )}
    </div>
  )
}

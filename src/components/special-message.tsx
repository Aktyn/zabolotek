import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

export function SpecialMessage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const countdownRef = useRef<HTMLSpanElement>(null)

  const [countdown, setCountdown] = useState(90)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      return
    }

    console.info("Let the show begin!")

    const container = containerRef.current
    if (!container) {
      return
    }

    const countdownRect = countdownRef.current?.getBoundingClientRect()
    const centerX = countdownRect
      ? countdownRect.left + countdownRect.width / 2
      : 0
    const centerY = countdownRect
      ? countdownRect.top + countdownRect.height / 2
      : 0

    let players: Array<Player> = []

    const playerSpawnFrequency = 0.025 // 40 times per second
    let timeSinceLastPlayerSpawn = 0

    const deadPlayers = new Set<Player>()

    let prevTime = 0
    const step = (time: number) => {
      let delta = time - prevTime
      prevTime = time

      requestAnimationFrame(step)

      if (delta > 1000) {
        return
      }

      delta /= 1000.0

      timeSinceLastPlayerSpawn += delta
      if (timeSinceLastPlayerSpawn > playerSpawnFrequency) {
        timeSinceLastPlayerSpawn = 0
        players.push(new Player(container, centerX, centerY))
      }

      for (const player of players) {
        player.update(delta)

        if (player.dead) {
          deadPlayers.add(player)
        }
      }

      players = players.filter((player) => !deadPlayers.has(player))

      deadPlayers.clear()
    }
    requestAnimationFrame(step)
  }, [countdown])

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col items-center justify-start gap-6 w-full h-full max-h-full text-center bg-background py-4 px-4 animate-in fade-in",
        "**:[.player]:fixed **:[.player]:left-0 **:[.player]:top-0 **:[.player]:origin-center **:[.player]:size-24",
      )}
    >
      <section className="bg-background-darker p-4 rounded-lg inline-flex flex-col gap-4 max-w-full">
        <h2 className="text-xl font-semibold">Tajna wiadomość</h2>

        <div className="text-center text-pretty font-medium w-lg max-w-full">
          <span className="text-muted-foreground">
            Brak tajnych wiadomości na ten moment.
          </span>
        </div>

        <hr />

        <div className="text-xs text-muted-foreground">
          Ta wiadomość nie ulegnie samodestrukcji... chyba
          <br />
          <strong ref={countdownRef} className="text-sm">
            {countdown}
          </strong>
        </div>
      </section>
    </div>
  )
}

// function decode(str: string) {
//   return decodeURI(atob(str))
// }

class Player {
  public static readonly PLAYER_LIFETIME = 5
  public static readonly SPEED = 500

  private readonly imgElement: HTMLImageElement
  private readonly angle: number
  private x = 0
  private y = 0
  private scale = 0

  private lifetime = 0

  constructor(container: HTMLDivElement, startX: number, startY: number) {
    this.x = startX
    this.y = startY
    this.angle = Math.random() * 2 * Math.PI

    this.imgElement = document.createElement("img")
    this.imgElement.src = "/zabolotek/zaba-player.png"
    this.imgElement.className = "player"
    container.appendChild(this.imgElement)
  }

  public get dead() {
    return this.lifetime > Player.PLAYER_LIFETIME
  }

  private get translate() {
    return `translate(calc(${this.x}px - 50%), calc(${this.y}px - 50%)) rotate(${this.angle + Math.PI / 2}rad) scale(${this.scale})`
  }

  update(delta: number) {
    this.x += delta * Player.SPEED * Math.cos(this.angle)
    this.y += delta * Player.SPEED * Math.sin(this.angle)
    this.scale = Math.min(1, this.scale + delta * 4)
    this.imgElement.style.transform = this.translate

    this.lifetime += delta
  }
}

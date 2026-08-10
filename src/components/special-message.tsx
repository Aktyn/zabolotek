import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

export function SpecialMessage() {
  // const playerRef = useRef<HTMLImageElement>(null)
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

        <div className="text-left text-pretty font-medium w-lg max-w-full">
          {decode(
            "UHJ6ZXByYXN6YW0lMjBqZSVDNSU5QmxpJTIwZHp3b25pJUM1JTgyYSVDNSU5QiUyMHclMjB3YSVDNSVCQ25laiUyMHNwcmF3aWUq",
          )}
          <br />
          {decode(
            "UG9jeiVDNCU4NXRlayUyMG1vamVnbyUyMG9rcmVzdSUyMHpuaWtuaSVDNCU5OWNpYSUyMGplc3QlMjB6YXp3eWN6YWolMjBuYWpnb3Jzenku",
          )}
          <br />
          {decode(
            "UCVDMyVCM2tpJTIwY28lMjBqZXN0JTIwY2l1dCUyMGxlcGllaiUyMHdpJUM0JTk5YyUyMHBvc3RhcmFtJTIwc2klQzQlOTklMjBvZGJpZXJhJUM0JTg3JTIwb2QlMjBjaWViaWUuJTIwQiVDNCU5OWQlQzQlOTklMjB3JTIwZ290b3dvJUM1JTlCY2klMjBieSUyMHN0YXdpJUM0JTg3JUMyJUEwY3pvJUM1JTgyYSUyMHBpamFrb20lMjB3JTIwcGFya3UlMjBsdWIlMjBjbyUyMHRhbSUyMHBvdHJ6ZWJ1amVzei4=",
          )}
          <i className="text-muted-foreground block mt-2 text-sm whitespace-pre-wrap">
            &ensp;
            {decode(
              "KiUyMFByYXdkb3BvZG9ibmllJTIwZHp3b25pJUM1JTgyYSVDNSU5QiUyMHolMjBweXRhbmllbSUyMG8lMjBpbXByZXolQzQlOTksJUMyJUEwYWxibyUyMERhbWlhbiUyMHpub3d1JTIwbmFnYWRhJUM1JTgyJTIwY2klMjBqYWtpJUM1JTlCJTIwYnpkdXIlMjB3JTIwa3QlQzMlQjNyZSUyMCVDNSU5QmxlcG8lMjB1d2llcnp5JUM1JTgyYSVDNSU5Qi4lMEFTcG90a2FuaWElMjB0b3dhcnp5c3RraWUlMjBpJTIwZHJhbXklMjBuaWVzdGV0eSUyMG11c3olQzQlODUlMjBwb2N6ZWthJUM0JTg3LiUwQUplJUM1JTlCbGklMjBuYXRvbWlhc3QlMjBwb3RyemVidWplc3olMjBwb21vY3klMjAtJTIwbW8lQzUlQkNlc3olMjBuYSUyMG1uaWUlMjBsaWN6eSVDNCU4Ny4=",
            )}
          </i>
        </div>

        <hr />

        <div className="text-left text-pretty font-regular w-lg max-w-full text-sm whitespace-pre-wrap">
          {decode(
            "V2VkJUM1JTgydWclMjBtb2ljaCUyMG9ibGljemUlQzUlODQsJTIwdyUyMHRyYWtjaWUlMjBieWNpYSUyMHclMjB6d2klQzQlODV6a3UlMjB6JTIwRGFtaWFuZW0sJTIwcHJ6ZXByYWNvd2ElQzUlODJhJUM1JTlCJTIwd2klQzQlOTljZWolMjBnb2R6aW4lMjBuaSVDNSVCQyUyMERhbWlhbiUyMHByemV6JTIwY2ElQzUlODJlJTIwc3dvamUlMjAlQzUlQkN5Y2llLiUwQUNpZWthd2UlMjBqYWslMjBzaSVDNCU5OSVDMiVBMGN6dWplc3olMjB6JTIwdCVDNCU4NSUyMHdpZWR6JUM0JTg1LiUwQURvbXklQzUlOUJsYW0lMjBzaSVDNCU5OSVDMiVBMCVDNSVCQ2UlMjBuZXV0cmFsbmllJTIwc2tvcm8lMjB0d29qZSUyMHBsYW55JTIwcHJ6ZXByb3dhZHprb3dlJTIwaSUyMHJ6ZWN6eSUyMGt0JUMzJUIzcmUlMjBzb2JpZSUyMG9iaWVjdWplc3olMjBvZCUyMHBvY3olQzQlODV0a3UlMjByb2t1JTIwb2RjaG9keiVDNCU4NSUyMHclMjB6YXBvbW5pZW5pZS4=",
          )}
          <p>
            {decode(
              "RyVDNSU4Mm9zeSUyMHclMjBtb2plaiUyMGclQzUlODJvd2llJTIwbSVDMyVCM3dpJUM0JTg1LCUyMCVDNSVCQ2UlMjBtaWElQzUlODJlbSUyMHJhY2olQzQlOTklMjBpJTIwZGElQzUlODJhJUM1JTlCJTIwbXUlMjBzaSVDNCU5OSUyMHpub3d1JTIwemJhamVyb3dhJUM0JTg3LiUyME0lQzMlQjN3aSVDNCU4NSUyMHRlJUM1JUJDJUMyJUEwJUM1JUJDZSUyMG1hc3olMjB0ZXJheiUyMG9rcmVzJTIwZG9icmVnbyUyMHNhbW9wb2N6dWNpYSUyMGklMjBuaWUlMjBwcnplam11amVzeiUyMHNpJUM0JTk5JTIwdHltaSUyMHdzenlzdGtpbWklMjBwcm9ibGVtYW1pJTIwJUM1JUJDeWNpb3d5bWkuJTBBVG8lMjB3JTIwc3VtaWUlMjBkb2JyemUsJTIwenJlc3p0JUM0JTg1JTIwamElMjB0dSUyMHR5bGtvJTIwZyVDNSU4Mm8lQzUlOUJubw==",
            )}{" "}
            <s>myślę</s> piszę.
          </p>
          {decode(
            "SmVzdGVtJTIwdGFrJTIwc3RhcnklMjAlQzUlQkNlJTIwcGFtaSVDNCU5OXRhbSUyMGphayUyMGRhd2ElQzUlODJhJUM1JTlCJTIwbXUlMjBjemFzJTIwZG8lMjBrbyVDNSU4NGNhJTIwbWFyY2EuLi4lMjBhaCUyMHRvJTIwYnklQzUlODJ5JTIwY3phc3klMjBwZSVDNSU4Mm5lJTIwbmFkemllaSUyMGklMjBwcnp5c3olQzUlODJvJUM1JTlCY2lvd2VnbyUyMG15JUM1JTlCbGVuaWEu",
          )}
        </div>

        <hr />

        <div className="text-center text-sm text-pretty font-medium w-lg max-w-full">
          {decode(
            "SmFrJTIwY28lQzUlOUIlMjB0byUyMG9kY3p5dHVqJUM0JTk5JTIwU01TeQ==",
          )}
          <br />
          <p className="text-xs mt-2 text-blue-700">
            O której kończysz pracę w środę?
          </p>
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

      {/* <img */}
      {/*   ref={playerRef} */}
      {/*   src="/zabolotek/zaba-player.png" */}
      {/*   className={cn( */}
      {/*     "fixed left-0 top-0 origin-center size-24 transition-[opacity,scale] ease-bounce duration-bounce", */}
      {/*     countdown > 0 ? "opacity-0 scale-0" : "opacity-100 scale-100", */}
      {/*   )} */}
      {/* /> */}
    </div>
  )
}

function decode(str: string) {
  return decodeURI(atob(str))
}

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

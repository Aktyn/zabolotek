import type { ComponentProps } from "react"

export function AuthorLink(props: ComponentProps<"a">) {
  return (
    <a
      href="https://aktyn.github.io/"
      target="_blank"
      className="font-semibold"
      {...props}
    />
  )
}

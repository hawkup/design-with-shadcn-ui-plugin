import { Tabs, TabsOption, render } from "@create-figma-plugin/ui"
import { JSX, h } from "preact"
import { App } from "./app"
import { useState } from "preact/hooks"

function Plugin() {
  const [tab, setTab] = useState<string>("Apply to variables")

  const options: TabsOption[] = [
    {
      children: <App target="VARIABLES" />,
      value: "Apply to variables",
    },
    {
      children: <App target="SELECTION" />,
      value: "Apply to selection",
    },
  ]

  function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    setTab(event.currentTarget.value)
  }

  return <Tabs onChange={handleChange} options={options} value={tab} />
}

export default render(Plugin)

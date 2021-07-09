import React, { useState } from "react"
import { Memo } from "./Memo"
import { act, render, screen } from "@testing-library/react"

describe("Memo", () => {
  it("isolates components from re-renders", () => {
    let nestedRenders = 0
    let receivedNestedValue
    let receivedSetNestedValue
    let receivedIgnoredValue
    let receivedSetIgnoredValue
    let receivedObservedValue
    let receivedSetObservedValue

    const Nested = () => {
      nestedRenders++

      const [nestedValue, setNestedValue] = useState("a")
      receivedNestedValue = nestedValue
      receivedSetNestedValue = setNestedValue

      return <h2 data-testid="2">{nestedRenders}</h2>
    }

    let mainRenders = 0

    const Test = () => {
      mainRenders++
      const [ignoreValue, setIgnoreValue] = useState("a")
      receivedIgnoredValue = ignoreValue
      receivedSetIgnoredValue = setIgnoreValue
      const [observedValue, setObservedValue] = useState("a")
      receivedObservedValue = observedValue
      receivedSetObservedValue = setObservedValue

      return (
        <div>
          <h1 data-testid="1">{mainRenders}</h1>

          <Memo deps={[observedValue]}>
            <Nested />
          </Memo>
        </div>
      )
    }

    render(<Test/>)

    const target1 = screen.getByTestId("1")
    const target2 = screen.getByTestId("2")

    expect(target1).toHaveTextContent("1")
    expect(target2).toHaveTextContent("1")

    act(() => receivedSetIgnoredValue("b"))

    expect(target1).toHaveTextContent("2")
    expect(target2).toHaveTextContent("1")

    act(() => receivedSetObservedValue("b"))

    expect(target1).toHaveTextContent("3")
    expect(target2).toHaveTextContent("2")

    act(() => receivedSetNestedValue("b"))

    expect(target1).toHaveTextContent("3")
    expect(target2).toHaveTextContent("3")
  })
})

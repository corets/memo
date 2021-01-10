import React, { useState } from "react"
import { Isolate } from "./Isolate"
import { mount } from "enzyme"
import { act } from "react-dom/test-utils"

describe("Isolate", () => {
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

      return <h2>{nestedRenders}</h2>
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
          <h1>{mainRenders}</h1>

          <Isolate deps={[observedValue]}>
            <Nested />
          </Isolate>
        </div>
      )
    }

    const wrapper = mount(<Test />)
    const getMainRenders = () => wrapper.find("h1").text()
    const getNestedRenders = () => wrapper.find("h2").text()

    expect(getMainRenders()).toBe("1")
    expect(getNestedRenders()).toBe("1")

    act(() => receivedSetIgnoredValue("b"))

    expect(getMainRenders()).toBe("2")
    expect(getNestedRenders()).toBe("1")

    act(() => receivedSetObservedValue("b"))

    expect(getMainRenders()).toBe("3")
    expect(getNestedRenders()).toBe("2")

    act(() => receivedSetNestedValue("b"))

    expect(getMainRenders()).toBe("3")
    expect(getNestedRenders()).toBe("3")
  })
})

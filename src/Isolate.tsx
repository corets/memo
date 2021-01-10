import { ReactElement, ReactNode, useMemo, useRef } from "react"
import React from "react"

export type IsolateProps = {
  deps?: any[]
  children?: ReactNode | ReactNode[]
  showRenders?: boolean
}

export const Isolate = (props: IsolateProps): ReactElement => {
  const { deps = [], children, showRenders = false } = props
  const renders = useRef(0)

  return useMemo(() => {
    renders.current++

    return (
      <>
        {showRenders && (
          <span className="isolate-render-count">{renders.current}</span>
        )}
        {children}
      </>
    )
  }, [...deps, showRenders])
}

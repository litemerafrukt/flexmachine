import React from "react"
import { it } from "param.macro"
import { assign } from "xstate"
import { useMachine } from "@xstate/react"

import { workdayMachine } from "./machines/workday"

const Start = ({ onStart }) => (
  <div>
    <h3>Not started</h3>
    <button type="button" onClick={onStart}>
      Start
    </button>
  </div>
)

const Working = ({ onPause, onEnd }) => (
  <div>
    <h3>Working...</h3>
    <button type="button" onClick={onPause}>
      Pause
    </button>
    <button type="button" onClick={onEnd}>
      End
    </button>
  </div>
)

const Pausing = ({ onResume, onEnd }) => (
  <div>
    <h3>Pausing...</h3>
    <button type="button" onClick={onResume}>
      Resume
    </button>
    <button type="button" onClick={onEnd}>
      End
    </button>
  </div>
)

const totalPause = pauses =>
  pauses.reduce((sum, { start, end }) => sum + (end.valueOf() - start.valueOf()), 0)
  |> it / 1000
  |> it.toFixed(0)

const totalWork = (start, end) =>
  end.valueOf() - start.valueOf() |> it / 1000 |> it.toFixed(0)

const Done = ({ start, end, pauses }) => (
  <div>
    <h3>Summary</h3>
    <p>
      <strong>Started:</strong> {start.toLocaleString()}
    </p>
    <p>
      <strong>Ended:</strong> {end.toLocaleString()}
    </p>
    <p>
      <strong>Total pause:</strong> {totalPause(pauses)}s
    </p>
    <p>
      <strong>Total work:</strong> {totalWork(start, end)}s
    </p>
  </div>
)

const Workday = () => {
  const [current, send] = useMachine(workdayMachine, {
    actions: {
      setStart: assign({ start: (_, event) => event.time }),
      setEnd: assign({ end: (_, event) => event.time }),
      startPause: assign({
        pause: (_, event) => ({ start: event.time, end: null })
      }),
      endPause: assign({
        pauses: (context, event) => [
          ...context.pauses,
          { start: context.pause.start, end: event.time }
        ],
        pause: { start: null, end: null }
      })
    }
  })

  return (
    <div>
      <h2>Workday</h2>
      {current.matches("notStarted") ? (
        <Start onStart={() => send({ type: "START", time: new Date() })} />
      ) : current.matches("work") ? (
        <Working
          onPause={() => send({ type: "PAUSE", time: new Date() })}
          onEnd={() => send({ type: "DONE", time: new Date() })}
        />
      ) : current.matches("pause") ? (
        <Pausing
          onResume={() => send({ type: "RESUME", time: new Date() })}
          onEnd={() => send({ type: "DONE", time: new Date() })}
        />
      ) : current.matches("done") ? (
        <Done
          start={current.context.start}
          end={current.context.end}
          pauses={current.context.pauses}
        />
      ) : (
        <div>Fail...</div>
      )}
    </div>
  )
}

export default Workday

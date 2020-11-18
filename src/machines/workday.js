import { Machine } from "xstate"

export const createWorkday = workday => ({
  start: workday?.start ?? null, // Date
  end: workday?.end ?? null, // Date
  pause: { start: null /* Date */, end: null /* Date */ },
  pauses: workday?.pauses ?? [],
  schema: workday?.schema ?? { work: 28800000, pause: 3600000 } // std schema 8h work, 1h pause
})

export const workdayMachine = Machine({
  id: "workday",
  context: createWorkday({ schema: { work: 28800000, pause: 2400000 } }),
  initial: "notStarted",
  states: {
    notStarted: {
      on: {
        START: { target: "work", actions: "setStart" }
      }
    },
    work: {
      on: {
        PAUSE: { target: "pause", actions: "startPause" },
        DONE: { target: "done" }
      }
    },
    pause: {
      on: {
        RESUME: { target: "work", actions: "endPause" },
        DONE: { target: "done", actions: "endPause" }
      }
    },
    done: {
      type: "final",
      entry: "setEnd"
    }
  }
})

/*
const workDayService = interpret(workdayMachine)
  .onTransition(state => {
    console.log(state.context)
    console.log(state.value)
  })
  .start()

const delay = msec => new Promise(resolve => setTimeout(resolve, msec))

const run = async () => {
  workDayService.send({ type: "START", time: new Date() })
  await delay(2000)
  workDayService.send({ type: "PAUSE", time: new Date() })
  await delay(1000)
  workDayService.send({ type: "RESUME", time: new Date() })
  await delay(2000)
  workDayService.send({ type: "PAUSE", time: new Date() })
  await delay(1000)
  workDayService.send({ type: "RESUME", time: new Date() })
  await delay(2000)
  workDayService.send({ type: "DONE", time: new Date() })
}

run()
*/

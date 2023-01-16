import { createContext, FunctionComponent, AnyComponent } from "preact";
import { useContext } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { createTimerState, TimerState } from "../lib/createTimerState";

const TimerContext = createContext<TimerState | null>(null);
export function useTimerContext() {
  const ctx = useContext(TimerContext);
  if (!ctx) {
    throw new Error(
      `useTimerContext must be used within <TimerContext.Provider />`
    );
  }
  return ctx;
}

export const Timer: FunctionComponent<{ time: string }> = ({
  children,
  time,
}) => {
  const timerState = useSignal(createTimerState(time));

  if (time && !time.includes(":")) {
    return <p>Invalid time: {time}</p>;
  }

  return (
    <TimerContext.Provider value={timerState.value}>
      {children}
    </TimerContext.Provider>
  );
};

export function TimeRemainingDisplay() {
  const { remainingTimeDisplay } = useTimerContext();

  return <strong>{remainingTimeDisplay}</strong>;
}

export function Controls() {
  const {
    remainingTimeDisplay,
    timerEnabled,
    timerElapsed,
    toggleTimer,
    cancelTimer,
    restart,
  } = useTimerContext();

  return (
    <>
      {remainingTimeDisplay.value === "00:00" ? (
        <button onClick={restart}>Restart</button>
      ) : (
        <>
          <button onClick={toggleTimer}>
            {console.log(timerEnabled.value)}
            {timerEnabled.value
              ? "pause"
              : `${+timerElapsed.value > 0 ? "resume" : "start"}`}
          </button>

          {timerEnabled.value && <button onClick={cancelTimer}>cancel</button>}
        </>
      )}
    </>
  );
}

export function createTimer(
  config: { time: string; components: { [k: string]: AnyComponent } } = {
    time: "5:00",
    components: {},
  }
) {
  const { time } = config;

  const GeneratedTimer: FunctionComponent = ({ children }) => {
    return <Timer time={time}>{children}</Timer>;
  };

  return GeneratedTimer;
}

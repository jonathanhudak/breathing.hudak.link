import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { signal, computed, useSignal } from "@preact/signals";
import { useRef, useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

const fill = "#ffffff";
const opacity = 0.35;
const stroke = "#242424";
const strokeWidth = 0.1;
const circleProps = {
  fill,
  opacity,
  stroke,
  strokeWidth,
};
const Circle = (props) => <circle {...circleProps} {...props} />;

export default function Coherence({ time, enabled }) {
  const ref = useRef();
  const animation = useRef();
  const lastPause = useSignal(0);

  useEffect(() => {
    if (animation.current) {
      if (enabled) {
        animation.current.play();
      } else {
        animation.current.pause();
      }
    }
  }, [enabled, animation]);

  useEffect(() => {
    if (time === 0 && !enabled && animation.current) {
      animation.current.currentTime = 0;
    }
  }, [time, enabled, animation]);

  useEffect(() => {
    if (ref.current) {
      animation.current = ref.current.animate(
        [
          {
            transform: "scale(0.5)",
            opacity: 0.5,
          },
          {
            transform: "scale(1.5)",
            opacity: 1,
          },
        ],
        {
          duration: 5500,
          iterations: Infinity,
          direction: "alternate",
        }
      );
      animation.current.pause();
    }
  }, [ref, animation]);

  return (
    <div id="coherence-animation" ref={ref} style={{ opacity: 0 }}>
      <svg version="1.1" x="0px" y="0px" viewBox="0 0 200 200">
        <Circle cx="50%" cy="50%" r="40%" />
        <Circle cx="50%" cy="50%" r="35%" />
        <Circle cx="50%" cy="50%" r="30%" />
        <Circle cx="50%" cy="50%" r="25%" />
        <Circle cx="50%" cy="50%" r="20%" />
        <Circle cx="50%" cy="50%" r="15%" />
        <Circle cx="50%" cy="50%" r="10%" />
        <Circle cx="50%" cy="50%" r="5%" />
      </svg>
    </div>
  );
}

const TimerContext = createContext();
function useTimerContext() {
  const ctx = useContext(TimerContext);
  if (!ctx) {
    throw new Error(
      `useTimerContext must be used within <TimerContext.Provider />`
    );
  }
  return ctx;
}

function playSound(frequency = 300) {
  console.debug("sound disabled");
  //   // https://teropa.info/blog/2016/08/04/sine-waves.html
  //   const REAL_TIME_FREQUENCY = frequency;
  //   let audioContext = new AudioContext();
  //   const gainNode = audioContext.createGain();
  //   gainNode.gain.value = 0.2;
  //   let myOscillator = audioContext.createOscillator();
  //   myOscillator.frequency.value = REAL_TIME_FREQUENCY;
  //   myOscillator.connect(audioContext.destination);
  //   myOscillator.start();
  //   myOscillator.stop(audioContext.currentTime + 0.1); // Stop after two seconds
}

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;

const TIMER_SPEED = ONE_SECOND;
// const TIMER_SPEED = 100;

function createTimerState(time) {
  function initializeTimer(time) {
    const [minutes, seconds] = time.split(":");
    return seconds * ONE_SECOND + minutes * ONE_MINUTE;
  }
  console.assert(initializeTimer("1:30") === 90000);

  const timerDisplay = signal(time);
  const timer = computed(() => initializeTimer(timerDisplay.value));
  const timerElapsed = signal(0);
  const timerEnabled = signal(false);
  const interval = signal();

  const clearTimerInterval = () => {
    if (!interval.value) return;

    clearInterval(interval.value);
    interval.value = null;
  };

  const cancelTimer = () => {
    timerEnabled.value = false;
    timerElapsed.value = 0;
    clearTimerInterval();
  };

  const restart = () => {
    cancelTimer();
    toggleTimer();
  };

  const toggleTimer = () => {
    timerEnabled.value = !timerEnabled.value;
    if (
      timerEnabled.value &&
      timerElapsed.value !== timer.value &&
      !interval.value
    ) {
      playSound(340);
      interval.value = setInterval(() => {
        if (timerElapsed.value !== timer.value) {
          timerElapsed.value += ONE_SECOND;
        } else {
          playSound(200);
          clearTimerInterval();
        }
      }, TIMER_SPEED);
    } else {
      clearTimerInterval();
    }
  };

  const computeTimeRemaining = computed(() => timer.value - timerElapsed.value);

  function getRemainingTimeDisplay(remaining) {
    const minutes = Math.floor(remaining / ONE_MINUTE);
    const seconds = Math.floor((remaining - minutes * ONE_MINUTE) / ONE_SECOND);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  console.assert(
    getRemainingTimeDisplay(90000) === "01:30",
    `getRemainingTimeDisplay failed ${getRemainingTimeDisplay(90000)}`
  );

  const remainingTimeDisplay = computed(() =>
    getRemainingTimeDisplay(computeTimeRemaining.value)
  );

  return {
    cancelTimer,
    remainingTimeDisplay,
    toggleTimer,
    timerElapsed,
    timerEnabled,
    restart,
  };
}

function TimeRemainingDisplay() {
  const { remainingTimeDisplay } = useTimerContext();

  return <strong style={{ fontSize: "3rem" }}>{remainingTimeDisplay}</strong>;
}

function Controls() {
  const {
    remainingTimeDisplay,
    timerEnabled,
    timerElapsed,
    toggleTimer,
    cancelTimer,
  } = useTimerContext();

  return (
    <div>
      {remainingTimeDisplay === "00:00" ? (
        <button onClick={restart}>Restart</button>
      ) : (
        <>
          <button onClick={toggleTimer}>
            {timerEnabled.value
              ? "pause"
              : `${!timerElapsed.value > 0 ? "start" : "resume"}`}
          </button>

          {timerEnabled.value && <button onClick={cancelTimer}>cancel</button>}
        </>
      )}
    </div>
  );
}

function BaseTimer(timerProps) {
  return (
    <TimerContext.Provider value={timerProps}>
      <div>
        <div>
          Timer:&nbsp;
          {remainingTimeDisplay.value}
        </div>
        <div>
          {remainingTimeDisplay.value === "00:00" ? (
            <button onClick={restart}>Restart</button>
          ) : (
            <>
              <button onClick={toggleTimer}>
                {timerEnabled.value
                  ? "pause"
                  : `${!timerElapsed.value > 0 ? "start" : "resume"}`}
              </button>

              {timerEnabled.value && (
                <button onClick={cancelTimer}>cancel</button>
              )}
            </>
          )}
        </div>
      </div>
      <CoherenceAnimation
        time={timerElapsed.value}
        enabled={timerEnabled.value}
      />
    </TimerContext.Provider>
  );
}

export function Timer({ children, time }) {
  const timerState = useSignal(createTimerState(time));

  if (time && !time.includes(":")) {
    return <p>Invalid time: {time}</p>;
  }

  return (
    <TimerContext.Provider value={timerState.value}>
      {children}
    </TimerContext.Provider>
  );
}

function createTimer(config = {}) {
  const { time } = config;
  function GeneratedTimer({ children }) {
    return <Timer time={time}>{children}</Timer>;
  }

  GeneratedTimer.Header = (props) => <div {...props} />;
  GeneratedTimer.Controls = Controls;
  GeneratedTimer.Remaining = TimeRemainingDisplay;
  Object.entries(config.components || {}).forEach(
    ([componentName, Component]) => {
      GeneratedTimer[componentName] = Component;
    }
  );

  return GeneratedTimer;
}

function StatefulCoherenceAnimation({ time }) {
  const { timerElapsed, timerEnabled } = useTimerContext();

  return (
    <CoherenceAnimation
      time={timerElapsed.value}
      enabled={timerEnabled.value}
    />
  );
}

export const CoherenceTimer = createTimer({
  time: "5:00",
  components: {
    Animation: StatefulCoherenceAnimation,
  },
});

export const LongCoherenceTimer = createTimer({
  time: "20:00",
  components: {
    Animation: StatefulCoherenceAnimation,
  },
});

import { FunctionComponent } from "preact";
import {
  useTimerContext,
  createTimer,
  Controls,
  TimeRemainingDisplay,
} from "./Timer";
import CoherenceAnimation from "./CoherenceAnimation";
import "./CoherenceTimer.css";

const StatefulCoherenceAnimation: FunctionComponent<{}> = () => {
  const { timerElapsed, timerEnabled } = useTimerContext();

  return (
    <CoherenceAnimation
      time={timerElapsed.value}
      enabled={timerEnabled.value}
    />
  );
};

export const TimerLong = createTimer({
  time: "20:00",
  components: {
    Animation: StatefulCoherenceAnimation,
  },
});

export default () => (
  <TimerLong>
    <div class="timer">
      <div class="timer-controls">
        <Controls />
      </div>
      <div class="timer-remaining">
        <TimeRemainingDisplay />
      </div>
      <div class="timer-animation">
        <StatefulCoherenceAnimation />
      </div>
    </div>
  </TimerLong>
);

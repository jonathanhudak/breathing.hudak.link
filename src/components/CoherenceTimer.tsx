import { FunctionComponent } from "preact";
import {
  useTimerContext,
  createTimer,
  Controls,
  TimeRemainingDisplay,
} from "./Timer";
import CoherenceAnimation from "./CoherenceAnimation";
import "./CoherenceTimer.css";
import { COHERENCE_BREATH_DURATION } from "../lib/constants";

const BreathPrompt: FunctionComponent<{}> = () => {
  const { timerElapsed, timerEnabled } = useTimerContext();
  const breathCount = Math.floor(
    timerElapsed.value / COHERENCE_BREATH_DURATION
  );

  const isInhale = breathCount % 2 === 0;
  if (!timerEnabled.value) return null;

  return <strong class="direction">{isInhale ? "Inhale" : "Exhale"}</strong>;
};

const RoundCount: FunctionComponent<{}> = () => {
  const { timerElapsed, timerEnabled } = useTimerContext();
  const breathCount = Math.floor(
    timerElapsed.value / COHERENCE_BREATH_DURATION
  );
  const roundDisplay = Math.floor(breathCount / 2 + 1);

  if (!timerEnabled.value) return null;

  return <>Round: {roundDisplay}</>;
};

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
      <div class="timer-direction">
        <BreathPrompt />
      </div>
      <div class="timer-animation">
        <StatefulCoherenceAnimation />
      </div>
      <div class="timer-footer">
        <RoundCount />
        <TimeRemainingDisplay />
      </div>
      <div class="timer-controls">
        <Controls />
      </div>
    </div>
  </TimerLong>
);

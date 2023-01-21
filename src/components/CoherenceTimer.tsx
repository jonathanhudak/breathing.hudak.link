import { FunctionComponent } from "preact";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import {
  useTimerContext,
  createTimer,
  Controls,
  TimeRemainingDisplay,
} from "./Timer";
import CoherenceAnimation from "./CoherenceAnimation";
import "./CoherenceTimer.css";
import { createSoundPlay } from "../lib/sounds";
import { COHERENCE_BREATH_DURATION } from "../lib/constants";

const BreathPrompt: FunctionComponent<{}> = () => {
  const sound = useSignal(createSoundPlay());
  const { timerElapsed, timerEnabled } = useTimerContext();
  const breathCount = Math.floor(
    timerElapsed.value / COHERENCE_BREATH_DURATION
  );
  const isInhale = breathCount % 2 === 0;

  useEffect(() => {
    if (sound && sound.value) {
      console.log("isInhale", isInhale);
      sound.value.play(isInhale ? 40 : 80);
    }
  }, [isInhale]);

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

  return <>Round {roundDisplay}</>;
};

const StatefulCoherenceAnimation: FunctionComponent<{}> = () => {
  const { timerElapsed, timerEnabled } = useTimerContext();

  return (
    <CoherenceAnimation
      time={Math.floor(timerElapsed.value / 1000)}
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
  <div>
    <h1>Coherence Breathing</h1>
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
  </div>
);

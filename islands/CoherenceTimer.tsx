import { FunctionComponent } from "preact";
import {
  useTimerContext,
  createTimer,
  Controls,
  TimeRemainingDisplay,
} from "../components/Timer.tsx";
import CoherenceAnimation from "../components/CoherenceAnimation.tsx";

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
    <Controls />
    <TimeRemainingDisplay />
    <StatefulCoherenceAnimation />
  </TimerLong>
);

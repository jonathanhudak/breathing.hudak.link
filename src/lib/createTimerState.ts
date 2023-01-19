import { ONE_SECOND, ONE_MINUTE } from "./constants";

import { signal, computed, Signal, ReadonlySignal } from "@preact/signals";

const TIMER_SPEED = ONE_SECOND / 10;

export interface TimerState {
  cancelTimer: () => void;
  remainingTimeDisplay: ReadonlySignal<string>;
  toggleTimer: () => void;
  timerElapsed: Signal<number>;
  timerEnabled: Signal<boolean>;
  restart: () => void;
}
export function createTimerState(time: string): TimerState {
  function initializeTimer(time: string) {
    const [minutes, seconds] = time.split(":");
    return +seconds * ONE_SECOND + +minutes * ONE_MINUTE;
  }
  console.assert(initializeTimer("1:30") === 90000);

  const timerDisplay = signal(time);
  const timer = computed(() => initializeTimer(timerDisplay.value));
  const timerElapsed = signal(0);
  const timerEnabled = signal(false);
  const interval = signal(0);

  const clearTimerInterval = () => {
    if (!interval.value) return;

    clearInterval(interval.value);
    interval.value = 0;
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
      // playSound(340);
      interval.value = setInterval(() => {
        if (timerElapsed.value !== timer.value) {
          timerElapsed.value += TIMER_SPEED;
        } else {
          // playSound(200);
          clearTimerInterval();
        }
      }, TIMER_SPEED);
    } else {
      clearTimerInterval();
    }
  };

  const computeTimeRemaining = computed(() => timer.value - timerElapsed.value);

  function getRemainingTimeDisplay(remaining: number) {
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

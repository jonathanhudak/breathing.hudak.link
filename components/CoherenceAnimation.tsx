import { createContext, FunctionComponent, Preact } from "preact";
import { MutableRef, useContext } from "preact/hooks";
import { signal, computed, useSignal } from "@preact/signals";
import { useRef, useEffect } from "preact/hooks";

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

// @ts-ignore not sure here
const Circle: FunctionComponent<Preact.svg> = (props) => (
  <circle {...circleProps} {...props} />
);

const Coherence: FunctionComponent<{ time: number; enabled: boolean }> = ({
  time,
  enabled,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation>();
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
};

export default Coherence;
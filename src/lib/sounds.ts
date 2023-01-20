import { signal, computed, Signal, ReadonlySignal } from "@preact/signals";

export function createSoundPlay() {
  const ctx = signal(new AudioContext());

  function play(frequency = 80) {
    console.log("play");
    const gainNode = ctx.value.createGain();
    const compressor = ctx.value.createDynamicsCompressor();
    gainNode.gain.value = 0.1;
    const osc = signal(ctx.value.createOscillator());
    osc.value.type = "sine";
    osc.value.frequency.value = frequency;
    osc.value.connect(gainNode);
    gainNode.connect(ctx.value.destination);

    // osc.value.connect(ctx.value.destination);
    osc.value.frequency.value = frequency;
    osc.value.start(ctx.value.currentTime);
    compressor.threshold.setValueAtTime(-50, ctx.value.currentTime);
    compressor.knee.setValueAtTime(40, ctx.value.currentTime);
    compressor.ratio.setValueAtTime(12, ctx.value.currentTime);
    compressor.attack.setValueAtTime(0.5, ctx.value.currentTime);
    compressor.release.setValueAtTime(0.25, ctx.value.currentTime);
    osc.value.stop(ctx.value.currentTime + 2);
  }

  return {
    play,
  };
}

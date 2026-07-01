let _muted = false;
let _ctx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

function tone(
  freqs: number[],
  durations: number[],
  type: OscillatorType = "sine",
  gainVal = 0.25,
  delay = 0,
) {
  if (_muted) return;
  try {
    const c = ctx();
    freqs.forEach((freq, i) => {
      const t = c.currentTime + delay + durations.slice(0, i).reduce((a, b) => a + b, 0);
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.frequency.setValueAtTime(freq, t);
      osc.type = type;
      gain.gain.setValueAtTime(gainVal, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + durations[i]);
      osc.start(t);
      osc.stop(t + durations[i] + 0.01);
    });
  } catch {
    // AudioContext not available (SSR / test)
  }
}

export const sounds = {
  get muted() { return _muted; },

  toggle() {
    _muted = !_muted;
    return _muted;
  },

  step() {
    const freq = 260 + Math.random() * 90;
    tone([freq], [0.045], "square", 0.08);
  },

  dice() {
    // rapid random clicks
    for (let i = 0; i < 6; i++) {
      tone([200 + Math.random() * 300], [0.05], "square", 0.15, i * 0.08);
    }
  },

  correct() {
    // happy rising arpeggio: C5 E5 G5
    tone([523, 659, 784], [0.12, 0.12, 0.25], "sine", 0.3);
  },

  wrong() {
    // sad falling: G4 Eb4 C4
    tone([392, 311, 261], [0.15, 0.15, 0.3], "sawtooth", 0.2);
  },

  snake() {
    // descending slide
    try {
      if (_muted) return;
      const c = ctx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(600, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.6);
      gain.gain.setValueAtTime(0.25, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.61);
    } catch { /* */ }
  },

  ladder() {
    // bright ascending chime: C5 E5 G5 C6
    tone([523, 659, 784, 1047], [0.1, 0.1, 0.1, 0.3], "sine", 0.3);
  },

  win() {
    // triumphant fanfare
    tone([523, 659, 784, 1047, 1047], [0.1, 0.1, 0.1, 0.1, 0.5], "sine", 0.35);
    tone([659, 784, 988, 1319], [0.1, 0.1, 0.1, 0.5], "sine", 0.2, 0.55);
  },

  emoji() {
    tone([880, 1046], [0.06, 0.1], "sine", 0.15);
  },

  streak() {
    // escalating ping
    tone([660, 880, 1320], [0.08, 0.08, 0.18], "sine", 0.3);
  },

  setMuted(val: boolean) {
    _muted = val;
  },
};

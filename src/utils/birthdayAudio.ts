type AudioStateListener = (state: {
  isPlaying: boolean;
  isMuted: boolean;
  audioSupported: boolean;
  errorMessage: string | null;
}) => void;

interface NoteEvent {
  freq: number;
  beats: number;
  chord?: number[];
}

// Cheerful instrumental arrangement of Happy Birthday in F major (celesta + warm pad)
const BIRTHDAY_MELODY: NoteEvent[] = [
  { freq: 261.63, beats: 0.75 }, // C4
  { freq: 261.63, beats: 0.25 }, // C4
  { freq: 293.66, beats: 1.0, chord: [174.61, 220.0, 261.63] }, // D4 (F maj)
  { freq: 261.63, beats: 1.0 }, // C4
  { freq: 349.23, beats: 1.0 }, // F4
  { freq: 329.63, beats: 2.0, chord: [196.0, 261.63, 329.63] }, // E4 (C maj)

  { freq: 261.63, beats: 0.75 }, // C4
  { freq: 261.63, beats: 0.25 }, // C4
  { freq: 293.66, beats: 1.0, chord: [196.0, 261.63, 329.63] }, // D4
  { freq: 261.63, beats: 1.0 }, // C4
  { freq: 392.0, beats: 1.0 }, // G4
  { freq: 349.23, beats: 2.0, chord: [174.61, 220.0, 261.63] }, // F4 (F maj)

  { freq: 261.63, beats: 0.75 }, // C4
  { freq: 261.63, beats: 0.25 }, // C4
  { freq: 523.25, beats: 1.0, chord: [174.61, 220.0, 349.23] }, // C5
  { freq: 440.0, beats: 1.0 }, // A4
  { freq: 349.23, beats: 1.0, chord: [233.08, 293.66, 349.23] }, // F4 (Bb maj)
  { freq: 329.63, beats: 1.0 }, // E4
  { freq: 293.66, beats: 1.5 }, // D4

  { freq: 466.16, beats: 0.75 }, // Bb4
  { freq: 466.16, beats: 0.25 }, // Bb4
  { freq: 440.0, beats: 1.0, chord: [174.61, 220.0, 261.63] }, // A4
  { freq: 349.23, beats: 1.0 }, // F4
  { freq: 392.0, beats: 1.0, chord: [196.0, 261.63, 329.63] }, // G4
  { freq: 349.23, beats: 2.5, chord: [174.61, 220.0, 349.23] }, // F4
];

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private isMuted = false;
  private audioSupported = true;
  private errorMessage: string | null = null;
  private schedulerTimer: number | null = null;
  private nextNoteTime = 0;
  private noteIndex = 0;
  private listeners = new Set<AudioStateListener>();

  private notify() {
    const snapshot = this.getState();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      audioSupported: this.audioSupported,
      errorMessage: this.errorMessage,
    };
  }

  public subscribe(listener: AudioStateListener) {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private ensureContext(): boolean {
    if (typeof window === 'undefined') return false;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) {
      this.audioSupported = false;
      this.errorMessage = 'Web Audio is unavailable on this browser. Visual celebration mode is active.';
      this.notify();
      return false;
    }

    try {
      if (!this.ctx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : 0.42;
        this.masterGain.connect(this.ctx.destination);
      }

      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      this.audioSupported = true;
      this.errorMessage = null;
      return true;
    } catch {
      this.audioSupported = false;
      this.errorMessage = 'Audio playback could not start. Visual celebration mode is active.';
      this.notify();
      return false;
    }
  }

  private playBellNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    const harmonicGain = this.ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.16, startTime);

    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.28, startTime + 0.025);
    noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.95);

    osc1.connect(noteGain);
    osc2.connect(harmonicGain);
    harmonicGain.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
  }

  private playPadChord(freqs: number[], startTime: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;

    freqs.forEach((f) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const padGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startTime);

      padGain.gain.setValueAtTime(0.0001, startTime);
      padGain.gain.exponentialRampToValueAtTime(0.055, startTime + 0.18);
      padGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(padGain);
      padGain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  }

  private scheduleNotes = () => {
    if (!this.ctx || !this.isPlaying) return;

    const secondsPerBeat = 0.52;
    const lookAhead = 0.22;

    while (this.nextNoteTime < this.ctx.currentTime + lookAhead) {
      const event = BIRTHDAY_MELODY[this.noteIndex];
      const dur = event.beats * secondsPerBeat;

      this.playBellNote(event.freq, this.nextNoteTime, Math.max(dur, 0.35));
      if (event.chord) {
        this.playPadChord(event.chord, this.nextNoteTime, dur * 1.9);
      }

      this.nextNoteTime += dur;
      this.noteIndex = (this.noteIndex + 1) % BIRTHDAY_MELODY.length;
    }

    this.schedulerTimer = window.setTimeout(this.scheduleNotes, 75);
  };

  public play() {
    if (!this.ensureContext() || !this.ctx) return false;
    if (this.isPlaying) return true;

    this.isPlaying = true;
    this.nextNoteTime = this.ctx.currentTime + 0.06;
    this.scheduleNotes();
    this.notify();
    return true;
  }

  public pause() {
    this.isPlaying = false;
    if (this.schedulerTimer !== null) {
      window.clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
      return false;
    }
    return this.play();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : 0.42,
        this.ctx.currentTime,
        0.04
      );
    }
    this.notify();
    return this.isMuted;
  }

  public playSparkleChime() {
    if (this.isMuted) return;
    if (!this.ensureContext() || !this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      this.playBellNote(freq, now + idx * 0.075, 0.45);
    });
  }

  public playWishChime() {
    if (this.isMuted) return;
    if (!this.ensureContext() || !this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [587.33, 739.99, 880.0, 1174.66, 1318.51];
    notes.forEach((freq, idx) => {
      this.playBellNote(freq, now + idx * 0.09, 0.6);
    });
  }
}

export const birthdayAudio = new BirthdayAudioEngine();

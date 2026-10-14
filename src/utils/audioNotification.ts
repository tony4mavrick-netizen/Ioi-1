// Web Audio API chime for non-intrusive notification sounds without external audio file dependencies
class NotificationAudio {
  private audioCtx: AudioContext | null = null;
  public soundEnabled: boolean = true;

  private init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public playChime(type: 'normal' | 'urgent' = 'normal') {
    if (!this.soundEnabled) return;

    try {
      this.init();
      if (!this.audioCtx) return;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + (type === 'urgent' ? 0.7 : 0.5));

      osc1.type = 'sine';
      osc2.type = 'triangle';

      if (type === 'urgent') {
        osc1.frequency.setValueAtTime(740, now); // F#5
        osc1.frequency.setValueAtTime(880, now + 0.15); // A5
        osc2.frequency.setValueAtTime(440, now);
      } else {
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.setValueAtTime(659.25, now + 0.12); // E5
        osc2.frequency.setValueAtTime(329.63, now);
      }

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + (type === 'urgent' ? 0.7 : 0.5));
      osc2.stop(now + (type === 'urgent' ? 0.7 : 0.5));
    } catch {
      // Audio playback silently falls back if not permitted by user gesture
    }
  }
}

export const notificationAudio = new NotificationAudio();

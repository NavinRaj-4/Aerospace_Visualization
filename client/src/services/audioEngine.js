// Web Audio API Synthesizer for Aerospace Wind Tunnel Simulation
class WindTunnelAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.noiseNode = null;
    this.noiseGain = null;
    this.noiseFilter = null;
    this.toneOsc = null;
    this.toneGain = null;
    this.isTunnelRunning = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
    } catch (e) {
      console.warn('[AudioEngine] Web Audio not supported');
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.ctx && this.ctx.state === 'suspended' && !muted) {
      this.ctx.resume();
    }
    if (muted) {
      this.stopTunnelRumble();
    }
  }

  // Play subtle futuristic UI click
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  // Play stall separation alert tone
  playStallWarning() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(660, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  // Play Emergency Scram Klaxon Siren
  playEmergencyScram() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const t = now + i * 0.35;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(950, t);
        osc.frequency.linearRampToValueAtTime(480, t + 0.25);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.linearRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      }
    } catch (e) {}
  }

  // Start continuous tunnel flow rumble
  startTunnelRumble(mach = 0.15, fanRpm = 1400) {
    if (this.isMuted || this.isTunnelRunning) return;
    this.init();
    if (!this.ctx) return;

    try {
      // Buffer for pink/white noise
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = 'lowpass';
      const cutoff = Math.min(2200, 200 + mach * 1200 + (fanRpm / 3000) * 800);
      this.noiseFilter.frequency.setValueAtTime(cutoff, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      const vol = Math.min(0.2, 0.03 + mach * 0.08);
      this.noiseGain.gain.setValueAtTime(vol, this.ctx.currentTime);

      this.noiseNode.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.ctx.destination);

      this.noiseNode.start();
      this.isTunnelRunning = true;
    } catch (e) {}
  }

  updateTunnelRumble(mach = 0.15, fanRpm = 1400) {
    if (!this.isTunnelRunning || !this.ctx || this.isMuted) return;
    try {
      const cutoff = Math.min(3000, 200 + mach * 1400 + (fanRpm / 3000) * 800);
      const vol = Math.min(0.22, 0.03 + mach * 0.09);
      if (this.noiseFilter) {
        this.noiseFilter.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.1);
      }
      if (this.noiseGain) {
        this.noiseGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
      }
    } catch (e) {}
  }

  stopTunnelRumble() {
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch (e) {}
      this.noiseNode = null;
    }
    this.isTunnelRunning = false;
  }
}

export const audioEngine = new WindTunnelAudioEngine();

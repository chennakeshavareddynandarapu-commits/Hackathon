/**
 * SAVEE Cognitive Vocal Unit Module
 * Manages Speech Synthesis (TTS) and Web Speech Recognition.
 */
class VoiceManager {
  constructor() {
    this.muted = false;
    this.recognition = null;
    this.isListening = false;
    this.synthesis = window.speechSynthesis || null;
    this.initSpeechRecognition();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.synthesis) {
      this.synthesis.cancel();
    }
    return this.muted;
  }

  speak(text) {
    if (this.muted || !this.synthesis) return;
    this.synthesis.cancel(); // Stop ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.9;

    const voices = this.synthesis.getVoices();
    const cyberVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('David')));
    if (cyberVoice) utterance.voice = cyberVoice;

    this.synthesis.speak(utterance);
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (this.onCommandCallback) {
        this.onCommandCallback(transcript);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onStatusChangeCallback) {
        this.onStatusChangeCallback(false);
      }
    };

    this.recognition.onerror = () => {
      this.isListening = false;
      if (this.onStatusChangeCallback) {
        this.onStatusChangeCallback(false);
      }
    };
  }

  startListening(onCommand, onStatusChange) {
    if (!this.recognition) {
      alert('Speech Recognition API is not supported in this browser environment.');
      return;
    }
    this.onCommandCallback = onCommand;
    this.onStatusChangeCallback = onStatusChange;

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      if (onStatusChange) onStatusChange(false);
    } else {
      this.recognition.start();
      this.isListening = true;
      if (onStatusChange) onStatusChange(true);
    }
  }
}

window.voiceManager = new VoiceManager();

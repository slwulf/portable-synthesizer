export default function Oscillator(context, {
  frequency,
  waveform = 'sine',
  volume = 1,
  decay = 0,
  decayNote = false
}) {
  this.context = context
  this.frequency = frequency
  this.waveform = waveform
  this.volume = volume
  this.decay = decay
  this.decayNote = decayNote
}

Oscillator.prototype.play = function(decayNow) {
  const now = this.context.currentTime
  this.node = createOscillator(this.context, this.frequency, this.waveform)
  this.node.volume.gain.value = this.volume

  this.node.oscillator.start(now)

  if (this.decay && decayNow) {
    this.stop()
  }
}

Oscillator.prototype.stop = function() {
  const now = this.context.currentTime

  if (this.node === null) return

  if (this.decay) {
    this.node.volume.gain.exponentialRampToValueAtTime(0.001, now + this.decay)


    if (this.decayNote) {
      this.node.oscillator.frequency.exponentialRampToValueAtTime(0.001, now + this.decay)
    }

    this.node.oscillator.stop(now + this.decay)
  } else {
    this.node.volume.gain.value = 0
    this.node.oscillator.stop(now + 1)
  }

  this.node = null
}

function createOscillator(context, frequency, waveform) {
  const oscillator = context.createOscillator()
  const volume = context.createGain()

  oscillator.frequency.value = frequency
  oscillator.type = waveform
  volume.gain.value = 0

  oscillator.connect(volume)
  volume.connect(context.destination)

  return { oscillator, volume }
}


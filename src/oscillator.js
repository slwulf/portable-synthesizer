export default function Oscillator(context, {
  frequency,
  waveform = 'sine',
  volume = 1
}) {
  this.context = context
  this.frequency = frequency
  this.waveform = waveform
  this.volume = volume
}

Oscillator.prototype.play = function() {
  this.node = createOscillator(this.context, this.frequency, this.waveform)
  this.node.volume.gain.value = this.volume
}

Oscillator.prototype.stop = function() {
  this.node.volume.gain.value = 0
  this.node = null
}

Oscillator.prototype.setFrequency = function(frequency) {
  this.frequency = frequency
}

function createOscillator(context, frequency, waveform) {
  const oscillator = context.createOscillator()
  const volume = context.createGain()

  oscillator.frequency.value = frequency
  oscillator.type = waveform
  volume.gain.value = 0

  oscillator.connect(volume)
  volume.connect(context.destination)
  oscillator.start(0)

  return { oscillator, volume }
}


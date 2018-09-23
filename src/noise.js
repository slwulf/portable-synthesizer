export default function Noise(context, {
  volume = 0,
  frequency = 0,
  decay = 0,
  filter = 'highpass'
} = {}) {
  this.context = context
  this.frequency = frequency
  this.volume = volume
  this.decay = decay
  this.filter = filter
}

Noise.prototype.play = function() {
  const now = this.context.currentTime

  this.node = createNoise(this.context, {
    frequency: this.frequency,
    volume: this.volume,
    filter: this.filter
  })

  this.node.source.start(now)

  if (this.decay) {
    this.node.volume.gain.exponentialRampToValueAtTime(0.001, now + this.decay)
  } else {
    this.node.source.stop(now + 1)
  }
}

Noise.prototype.stop = function() {
  this.node.volume.gain.value = 0
  this.node = null
}

function createNoise(context, { frequency, volume, filter }) {
  const buffersize = context.sampleRate
  const buffer = context.createBuffer(1, buffersize, context.sampleRate)
  const output = buffer.getChannelData(0)

  const source = context.createBufferSource()
  const biquadFilter = context.createBiquadFilter()
  const gain = context.createGain()

  for (let i = 0; i < buffersize; i++)
    output[i] = Math.random() * 2 - 1

  source.buffer = buffer
  biquadFilter.type = filter
  biquadFilter.frequency.value = frequency
  gain.gain.value = volume

  source.connect(biquadFilter)
  biquadFilter.connect(gain)
  gain.connect(context.destination)

  return { source, volume: gain }
}

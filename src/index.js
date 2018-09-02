import {Note} from 'octavian'
import Oscillator from './oscillator.js'

export default function Synthesizer(Context) {
  const context = new Context()
  const nodes = {}
  let tone = {}

  return {
    play(name) {
      const note = new Note(name)
      const freq = note.frequency
      nodes[freq] = createOscillators(context, tone, freq)
      const oscillators = nodes[freq]
      oscillators.forEach(osc => osc.play())
    },

    stop(name) {
      const note = new Note(name)
      const freq = note.frequency
      const oscillators = nodes[freq]
      oscillators.forEach(osc => osc.stop())
      // TODO: implement decay
    },

    setTone({oscillators = [], noises = []}) {
      tone.oscillators = oscillators
      tone.noises = noises
    },

    addSound(name, {oscillators = [], noises = []}) {},

    removeSound(name) {}
  }
}

function createOscillators(context, tone, frequency) {
  return tone.oscillators.map(osc => {
    return new Oscillator(context, {
      waveform: osc.waveform,
      volume: osc.volume,
      frequency
    })
  })
}

/**

function createNoise(context, { frequency, gain, type = 'highpass' }) {
  const buffersize = context.sampleRate
  const buffer = context.createBuffer(1, buffersize, context.sampleRate)
  const output = buffer.getChannelData(0)

  const source = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const volume = context.createGain()

  for (let i = 0; i < buffersize; i++)
    output[i] = Math.random() * 2 - 1

  source.buffer = buffer
  filter.type = type
  filter.frequency.value = frequency
  volume.gain.value = gain

  source.connect(filter)
  filter.connect(volume)
  volume.connect(context.destination)

  return { source, volume }
}
**/
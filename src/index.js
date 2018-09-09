import {Note} from 'octavian'
import Oscillator from './oscillator.js'
import Noise from './noise.js';

export default function Synthesizer(Context) {
  const context = new Context()
  const nodes = {}
  let tone = {}
  let sounds = {}

  return {
    play(name) {
      if (sounds[name]) {
        sounds[name].oscillators.forEach(osc => osc.play(true))
        sounds[name].noises.forEach(noise => noise.play())
        return
      }

      const note = new Note(name)
      const freq = note.frequency

      nodes[freq] = createOscillators(context, tone.oscillators, freq)
      const oscillators = nodes[freq]
      oscillators.forEach(osc => osc.play())
    },

    stop(name) {
      if (sounds[name]) {
        sounds[name].oscillators.forEach(osc => osc.stop())
        sounds[name].noises.forEach(noise => noise.stop())
        return
      }

      const note = new Note(name)
      const freq = note.frequency
      const oscillators = nodes[freq]

      oscillators.forEach(osc => osc.stop())
    },

    setTone({oscillators = [], noises = []}) {
      tone.oscillators = oscillators
      tone.noises = noises
    },

    addSound(name, {oscillators = [], noises = []}) {
      sounds[name] = {
        oscillators: createOscillators(context, oscillators),
        noises: createNoises(context, noises)
      }
    },

    removeSound(name) {}
  }
}

function createOscillators(context, oscillators, frequency) {
  return oscillators.map(osc => {
    return new Oscillator(context, {
      waveform: osc.waveform,
      volume: osc.volume,
      decay: osc.decay,
      decayNote: osc.decayNote,
      frequency: frequency || osc.frequency
    })
  })
}

function createNoises(context, noises) {
  return noises.map(noise => {
    return new Noise(context, {
      volume: noise.volume,
      frequency: noise.frequency,
      decay: noise.decay,
      filter: noise.filter
    })
  })
}

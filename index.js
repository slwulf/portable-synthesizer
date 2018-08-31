import Synthesizer from './src'

const Context = window.AudioContext || window.webkitAudioContext
const synth = Synthesizer(Context)

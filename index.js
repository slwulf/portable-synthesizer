import Synthesizer from './src'

const Context = window.AudioContext || window.webkitAudioContext
const synth = Synthesizer(Context)

const keymap = {}

synth.setTone({
  oscillators: [{
    waveform: 'sawtooth'
  }, {
    waveform: 'square',
    volume: 0.75
  }]
})

function createKeybindingThing(id) {
  const $template = $(`
    <div class="key-binding">
      <input type="text" data-key-binding="${id}">
      <span><=></span>
      <input type="text" data-note="${id}">
    </div>
  `)

  return $template
}

$('input[data-key-binding]').on('keyup', event => {
  const key = event.key
  event.preventDefault()
  event.target.value = ''
  event.target.value = key
  keymap[key] = ''

  const id = Date.now()
  $(event.target).data('key-binding', id)
  $(event.target).next('[data-note]').data('note', id)
})

$('input[data-note]').on('change', event => {
  const value = event.target.value
  const key = $(event.target).parent().find('[data-key-binding]').val()
  console.log(value)
  keymap[key] = value
})

$(document).on('keydown', event => {
  if ($('input:focus').length > 0) return;
  event.preventDefault()

  const note = keymap[event.key]
  console.log(keymap, event.key)
  synth.play(note)
})

$(document).on('keyup', event => {
  if ($('input:focus').length > 0) return;
  event.preventDefault()

  const note = keymap[event.key]
  synth.stop(note)
})



// setTimeout(() => {
//   synth.setTone({
//     oscillators: [{waveform: 'sine'}]
//   })
// }, 2000)

// document.addEventListener('keydown', (event) => {
//   const key = event.key
//   event.preventDefault()
//   if (key === 'a') synth.play('A4')
//   if (key === 's') synth.play('B4')
//   if (key === 'd') synth.play('C4')
// })

// document.addEventListener('keyup', () => {
//   const key = event.key
//   event.preventDefault()
//   if (key === 'a') synth.stop('A4')
//   if (key === 's') synth.stop('B4')
//   if (key === 'd') synth.stop('C4')
// })

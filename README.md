## `portable-synthesizer` [![Build Status](https://travis-ci.org/atwulf/portable-synthesizer.svg?branch=master)](https://travis-ci.org/atwulf/portable-synthesizer)
> Making sounds with JavaScript! 🎹🎼🎶

![](https://media.giphy.com/media/Hcw7rjsIsHcmk/giphy.gif) ![](https://media.giphy.com/media/LHZyixOnHwDDy/giphy.gif)

`portable-synthesizer` is a wrapper around the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) aimed at making it easy to use the browser as a synthesizer. Currently, it has a fairly minimal API that allows users to define a set of oscillators and noises, play notes, and define custom sounds based on a mix of oscillators and noises.

### Installation

`portable-synthesizer` is available on npm:
```bash
npm install portable-synthesizer --save
```

### Usage Example

This library works in [all browsers that support the Web Audio API](https://caniuse.com/#feat=audio-api).

```javascript
import Synthesizer from 'portable-synthesizer'

const synth = Synthesizer(window.AudioContext || window.webkitAudioContext)

synth.setTone({
  oscillators: [{ waveform: 'triangle' }]
})

synth.play('C4') // middle C

setTimeout(() => {
  synth.stop('C4')
}, 500)
```

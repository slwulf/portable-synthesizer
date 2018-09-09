import {expect} from 'chai'
import sinon from 'sinon'
import Synthesizer from '../src/index.js'

describe('Synthesizer', () => {
  it('instantiates the AudioContext', () => {
    const FakeAudioContext = sinon.spy()
    Synthesizer(FakeAudioContext)
    expect(FakeAudioContext).to.have.been.calledOnce
  })

  describe.only('#play', () => {
    const synth = Synthesizer(sinon.spy())
    synth.play('C4')
  })
})

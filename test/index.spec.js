const Synthesizer = require('./build').default
const chai = require('chai')
const sinon = require('sinon')
const {expect} = chai
chai.use(require('sinon-chai'))

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

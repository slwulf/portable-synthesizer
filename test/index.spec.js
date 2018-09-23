import {expect} from 'chai'
import sinon from 'sinon'
import {Note} from 'octavian'

import Synthesizer from '../src/index.js'
import {
  mockAudioContext,
  mockOscillator,
  mockGain,
  mockBufferSource,
  mockFilter
} from './helper.js'

describe.only('Synthesizer', () => {
  const oscillatorConnect = sinon.spy()
  const gainConnect = sinon.spy()
  const bufferConnect = sinon.spy()
  const filterConnect = sinon.spy()
  const start = sinon.spy()
  const stop = sinon.spy()
  const bufferStart = sinon.spy()
  const bufferStop = sinon.spy()
  const currentTime = Date.now()
  const oscillatorRamp = sinon.spy()
  const gainRamp = sinon.spy()
  const destination = 'hi i am a destination'

  const mockAudioOscillator = mockOscillator({
    connect: oscillatorConnect,
    start,
    exponentialRampToValueAtTime: oscillatorRamp
  })

  const mockAudioGain = mockGain({
    connect: gainConnect,
    exponentialRampToValueAtTime: gainRamp
  })

  const mockAudioBuffer = mockBufferSource({
    connect: bufferConnect,
    start: bufferStart,
    stop: bufferStop
  })

  const mockAudioFilter = mockFilter({
    connect: filterConnect
  })

  const createOscillator = sinon.stub().returns(mockAudioOscillator)
  const createGain = sinon.stub().returns(mockAudioGain)
  const createBufferSource = sinon.stub().returns(mockAudioBuffer)
  const createBiquadFilter = sinon.stub().returns(mockAudioFilter)
  const createBuffer = sinon.stub().returns({
    getChannelData: sinon.stub().returns([0,1,2,3])
  })

  const AudioContext = mockAudioContext({
    createOscillator,
    createGain,
    createBuffer,
    createBufferSource,
    createBiquadFilter,
    currentTime,
    destination
  })

  beforeEach(() => {
    oscillatorConnect.resetHistory()
    gainConnect.resetHistory()
    filterConnect.resetHistory()
    start.resetHistory()
    stop.resetHistory()
    bufferConnect.resetHistory()
    bufferStart.resetHistory()
    bufferStop.resetHistory()
    oscillatorRamp.resetHistory()
    gainRamp.resetHistory()
    createOscillator.resetHistory()
    createGain.resetHistory()
    createBufferSource.resetHistory()
    createBiquadFilter.resetHistory()
    createBuffer.resetHistory()
  })

  it('instantiates the AudioContext', () => {
    const FakeAudioContext = sinon.spy()
    Synthesizer(FakeAudioContext)
    expect(FakeAudioContext).to.have.been.calledOnce
  })

  describe('#play', () => {
    it('plays a note with the set tone', () => {
      const {frequency} = new Note('C4')
      const synth = Synthesizer(AudioContext)
      synth.setTone({
        oscillators: [{ waveform: 'triangle' }]
      })
      synth.play('C4')

      expect(createOscillator).to.have.been.calledOnce
      expect(mockAudioOscillator.frequency.value).to.equal(frequency)
      expect(mockAudioOscillator.type).to.equal('triangle')
    })

    it('plays a sound', () => {
      const synth = Synthesizer(AudioContext)
      synth.addSound('test-sound', {
        oscillators: [{frequency: 200, waveform: 'square'}]
      })
      synth.play('test-sound')

      expect(createOscillator).to.have.been.calledOnce
      expect(mockAudioOscillator.frequency.value).to.equal(200)
      expect(mockAudioOscillator.type).to.equal('square')
    })

    it('throws an error if the note or sound does not exist', () => {
      const synth = Synthesizer(AudioContext)
      expect(() => synth.play('💩')).to.throw()
    })
  })

  describe('#stop', () => {
    beforeEach(() => {
      mockAudioOscillator.stop.resetHistory()
    })

    it('stops the note', () => {
      const synth = Synthesizer(AudioContext)
      synth.setTone({
        oscillators: [{ waveform: 'triangle' }]
      })
      synth.play('C4')
      synth.stop('C4')

      expect(mockAudioOscillator.stop).to.have.been.calledOnceWith(currentTime + 1)
    })

    it('stops the sound', () => {
      const synth = Synthesizer(AudioContext)
      synth.addSound('test-sound', {
        oscillators: [{frequency: 200, waveform: 'square'}]
      })
      synth.play('test-sound')
      synth.stop('test-sound')

      expect(mockAudioOscillator.stop).to.have.been.calledOnceWith(currentTime + 1)
    })

    it('throws an error if the note or sound does not exist', () => {
      const synth = Synthesizer(AudioContext)
      expect(() => synth.stop('💩')).to.throw()
    })

    it('throws an error if the note has not been played yet', () => {
      const synth = Synthesizer(AudioContext)
      expect(() => synth.stop('C4')).to.throw(Error, 'Cannot stop note C4 before it is played.')
    })
  })

  describe('#setTone', () => {
    it('sets the tone oscillators', () => {
      const synth = Synthesizer(AudioContext)
      synth.setTone({
        oscillators: [{ waveform: 'poop' }]
      })
      synth.play('C4')

      expect(mockAudioOscillator.type).to.equal('poop')
    })

    it.skip('sets the tone noises', () => {
      const synth = Synthesizer(AudioContext)
      synth.setTone({
        noises: [{ frequency: 1000 }]
      })
      synth.play('C4')

      // TODO: make sure that #play with a valid note makes noises as well
      expect(createBiquadFilter).to.have.been.calledOnce
      expect(mockAudioFilter.frequency.value).to.equal(1000)
    })
  })

  describe('#removeSound', () => {
    it('throws an error if the sound does not exist', () => {
      const synth = Synthesizer(AudioContext)
      expect(
        () => synth.remove('fake-sound')
      ).to.throw()
    })

    it('removes a sound', () => {
      const synth = Synthesizer(AudioContext)
      synth.addSound('test-sound', {})
      expect(
        () => synth.removeSound('test-sound')
      ).to.not.throw()
    })
  })
})

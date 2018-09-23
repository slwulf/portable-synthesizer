import {expect} from 'chai'
import sinon from 'sinon'
import {Note} from 'octavian'

import Oscillator from '../src/oscillator.js'
import {
  mockAudioContext,
  mockOscillator,
  mockGain
} from './helper.js'

describe('Oscillator', () => {
  const oscillatorConnect = sinon.spy()
  const gainConnect = sinon.spy()
  const start = sinon.spy()
  const stop = sinon.spy()
  const currentTime = Date.now()
  const oscillatorRamp = sinon.spy()
  const gainRamp = sinon.spy()
  const destination = 'hi i am a destination'

  beforeEach(() => {
    oscillatorConnect.resetHistory()
    gainConnect.resetHistory()
    start.resetHistory()
    stop.resetHistory()
    oscillatorRamp.resetHistory()
    gainRamp.resetHistory()
  })

  describe('constructor', () => {
    it('creates an oscillator instance', () => {
      const oscillator = new Oscillator(sinon.spy(), {
        waveform: 'triangle',
        frequency: new Note('C4').frequency,
        volume: 0.5,
        decay: 1
      })

      expect(oscillator.waveform).to.equal('triangle')
      expect(oscillator.frequency).to.equal(new Note('C4').frequency)
      expect(oscillator.volume).to.equal(0.5)
      expect(oscillator.decay).to.equal(1)
    })
  })

  describe('#play', () => {
    const mockAudioOscillator = mockOscillator({
      connect: oscillatorConnect,
      start,
      exponentialRampToValueAtTime: oscillatorRamp
    })

    const mockAudioGain = mockGain({
      connect: gainConnect,
      exponentialRampToValueAtTime: gainRamp
    })

    const createOscillator = sinon.stub().returns(mockAudioOscillator)
    const createGain = sinon.stub().returns(mockAudioGain)

    const AudioContext = mockAudioContext({
      createOscillator,
      createGain,
      currentTime,
      destination
    })

    beforeEach(() => {
      createOscillator.resetHistory()
      createGain.resetHistory()
    })

    it('plays the note', () => {
      const oscillator = new Oscillator(new AudioContext())
      oscillator.play()

      expect(createOscillator).to.have.been.calledOnce
      expect(createGain).to.have.been.calledOnce
      expect(start).to.have.been.calledOnceWith(currentTime)
    })

    it('calls the stop method if decayNow is true', () => {
      const decay = 0.5
      const oscillator = new Oscillator(new AudioContext(), {decay})

      oscillator.stop = sinon.spy()

      oscillator.play(true)

      expect(oscillator.stop).to.have.been.calledOnce
    })

    it('connects the oscillator to the destination through the gain', () => {
      const oscillator = new Oscillator(new AudioContext())
      oscillator.play()

      expect(oscillatorConnect).to.have.been.calledWith(mockAudioGain)
      expect(gainConnect).to.have.been.calledOnceWith(destination)
    })
  })

  describe('#stop', () => {
    const mockAudioOscillator = mockOscillator({
      connect: oscillatorConnect,
      start,
      stop,
      exponentialRampToValueAtTime: oscillatorRamp
    })

    const mockAudioGain = mockGain({
      connect: gainConnect,
      exponentialRampToValueAtTime: gainRamp
    })

    const createOscillator = sinon.stub().returns(mockAudioOscillator)
    const createGain = sinon.stub().returns(mockAudioGain)

    const AudioContext = mockAudioContext({
      createOscillator,
      createGain,
      currentTime
    })

    beforeEach(() => {
      createOscillator.resetHistory()
      createGain.resetHistory()
    })

    it('sets the gain volume to 0', () => {
      const oscillator = new Oscillator(new AudioContext())
      oscillator.play('C4')
      oscillator.stop()

      expect(mockAudioGain.gain.value).to.equal(0)
    })

    it('stops the oscillator', () => {
      const oscillator = new Oscillator(new AudioContext())
      oscillator.play('C4')
      oscillator.stop()

      expect(mockAudioOscillator.stop).to.have.been.calledOnceWith(currentTime + 1)
    })

    it('decays the gain if there is decay', () => {
      const decay = 0.5
      const oscillator = new Oscillator(new AudioContext(), {decay})
      oscillator.play('C4')
      oscillator.stop()

      expect(gainRamp).to.have.been.calledOnceWith(0.001, currentTime + decay)
      expect(stop).to.have.been.calledOnceWith(currentTime + decay)
    })

    it('decays the note if decayNote is true', () => {
      const decay = 0.5
      const oscillator = new Oscillator(new AudioContext(), {decay, decayNote: true})
      oscillator.play('C4')
      oscillator.stop()

      expect(oscillatorRamp).to.have.been.calledOnceWith(0.001, currentTime + decay)
      expect(stop).to.have.been.calledOnceWith(currentTime + decay)
    })

    it('does nothing if no note is being played', () => {
      const oscillator = new Oscillator(new AudioContext())
      oscillator.stop()

      expect(stop).to.not.have.been.called
    })
  })
})

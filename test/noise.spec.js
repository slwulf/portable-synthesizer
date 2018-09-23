import {expect} from 'chai'
import sinon from 'sinon'

import Noise from '../src/noise.js'
import {
  mockAudioContext,
  mockOscillator,
  mockGain,
  mockBufferSource,
  mockFilter
} from './helper.js'

describe('Noise', () => {
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

  describe('constructor', () => {
    it('creates a noise instance', () => {
      const context = sinon.stub()
      const noise = new Noise(context, {
        volume: 1,
        frequency: 200,
        decay: 0.5,
        filter: 'test-filter'
      })

      expect(noise.context).to.equal(context)
      expect(noise.frequency).to.equal(200)
      expect(noise.volume).to.equal(1)
      expect(noise.decay).to.equal(0.5)
      expect(noise.filter).to.equal('test-filter')
    })
  })

  describe('#play', () => {
    it('plays the noise', () => {
      const context = new AudioContext()
      const noise = new Noise(context)
      noise.play()

      expect(createBuffer).to.have.been.calledOnceWith(1, context.sampleRate, context.sampleRate)
      expect(createGain).to.have.been.calledOnce
      expect(createBufferSource).to.have.been.calledOnce
      expect(bufferStart).to.have.been.calledOnceWith(currentTime)
    })

    it('stops the noise after a period of time', () => {
      const noise = new Noise(new AudioContext())
      noise.play()

      expect(bufferStart).to.have.been.calledOnce
      expect(bufferStop).to.have.been.calledOnceWith(currentTime + 1)
    })

    it('it decays the noise if decay is set', () => {
      const noise = new Noise(new AudioContext(), {
        decay: 0.5
      })
      noise.play()

      expect(bufferStart).to.have.been.calledOnce
      expect(gainRamp).to.have.been.calledOnceWith(0.001, currentTime + 0.5)
    })

    it('connects the noise through the filter and gain to the destination', () => {
      const noise = new Noise(new AudioContext())
      noise.play()

      expect(bufferConnect).to.have.been.calledOnceWith(mockAudioFilter)
      expect(filterConnect).to.have.been.calledOnceWith(mockAudioGain)
      expect(gainConnect).to.have.been.calledOnceWith(destination)
    })
  })

  describe('#stop', () => {
    it('sets the gain volume to zero', () => {
      const noise = new Noise(new AudioContext())
      noise.play()
      noise.stop()

      expect(mockAudioGain.gain.value).to.equal(0)
      expect(noise.node).to.equal(null)
    })
  })
})

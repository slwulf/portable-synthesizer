import sinon from 'sinon'

export function mockAudioContext({
  currentTime = Date.now(),
  createOscillator = sinon.stub(),
  createGain = sinon.stub(),
  createBuffer = sinon.stub(),
  createBufferSource = sinon.stub(),
  createBiquadFilter = sinon.stub(),
  destination = null
} = {}) {
  const Mock = function() {
    this.currentTime = currentTime
    this.destination = destination
    this.sampleRate = 2400
  }

  Mock.prototype.createOscillator = createOscillator
  Mock.prototype.createGain = createGain
  Mock.prototype.createBuffer = createBuffer
  Mock.prototype.createBufferSource = createBufferSource
  Mock.prototype.createBiquadFilter = createBiquadFilter

  return Mock
}

export function mockOscillator({
  connect = sinon.stub(),
  start = sinon.stub(),
  stop = sinon.stub(),
  exponentialRampToValueAtTime = sinon.stub()
} = {}) {
  return {
    frequency: {
      value: null,
      exponentialRampToValueAtTime
    },
    type: '',
    connect,
    start,
    stop
  }
}

export function mockGain({
  connect = sinon.stub(),
  exponentialRampToValueAtTime = sinon.stub()
} = {}) {
  return {
    gain: {
      value: null,
      exponentialRampToValueAtTime
    },
    connect
  }
}

export function mockBufferSource({
  connect = sinon.stub(),
  start = sinon.stub(),
  stop = sinon.stub()
} = {}) {
  return {
    buffer: null,
    connect,
    start,
    stop
  }
}

export function mockFilter({
  connect = sinon.stub()
} = {}) {
  return {
    type: 'highpass',
    frequency: {},
    connect
  }
}

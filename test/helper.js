import sinon from 'sinon'

export function mockAudioContext({
  currentTime = Date.now(),
  createOscillator = sinon.stub(),
  createGain = sinon.stub(),
  destination = null
} = {}) {
  const Mock = function() {
    this.currentTime = currentTime
    this.destination = destination
  }

  Mock.prototype.createOscillator = createOscillator
  Mock.prototype.createGain = createGain

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

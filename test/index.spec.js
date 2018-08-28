const thing = require('./build').default
const expect = require('chai').expect

describe('thing', () => {
  it('returns true', () => {
    expect(thing()).to.be.true
  })
})

'use strict'

var test = require('tape')
var ghContribs = require('../')

test('awesomeness', function (t) {
  t.ok(ghContribs() === 'awesome', 'module must be awesome')
  t.end()
})

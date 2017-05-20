
var EC = require('elliptic').ec
var aliases = require('./aliases')
var parameters = {
    secp256k1: [1, 3, 132, 0, 10],
    p192: [1, 2, 840, 10045, 3, 1, 1],
    p224: [1, 3, 132, 0, 33],
    p256: [1, 2, 840, 10045, 3, 1, 7],
    p384: [1, 3, 132, 0, 34],
    p521: [1, 3, 132, 0, 35]
}

var curveCache = {}

function toCurves (parameters) {
  var curves = {}
  Object.keys(parameters).forEach(function (curve) {
    var cParams
    // be lazy
    curves[curve] = {
      curveParameters: parameters[curve],
      privatePEMOptions: {label: 'EC PRIVATE KEY'},
      publicPEMOptions: {label: 'PUBLIC KEY'},
      keyFromPrivate: function () {
        if (!curveCache[curve]) {
          curveCache[curve] = new EC(curve)
        }

        var ec = curveCache[curve]
        return ec.keyFromPrivate.apply(ec, arguments)
      }
    }

    if (aliases[curve]) {
      curves[aliases[curve]] = curves[curve]
    }
  })

  return curves
}

module.exports = toCurves(parameters)

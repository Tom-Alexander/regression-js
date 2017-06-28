/* eslint-env node, mocha */

var expect = require('chai').expect;
var regression = require('..');

describe('regression', function () {
  var example = {
    diagLine: [[10, 20], [100, 200], [1000, 2000], [10000, 20000]],
    nullDataDiagLine: [[10, 20], [100, null], [1000, 2000], [10000, null]],
    thirdSlopeLine: [[3, 2], [6, 3]],
    hline: [[10, 20], [20, 20]],
    negdiagline: [[10, -20], [100, -200], [1000, -2000], [10000, -20000]],
  };

  it('should be case-insensitive', function () {
    expect(regression('linear', example.diagLine)).to.deep.equal(regression('LiNeAR', example.diagLine));
  });

  it('should take precision options', function () {
    function equation(opts) { return regression('linear', example.thirdSlopeLine, opts).string; }

    expect(equation()).to.equal('y = 0.33x + 1');
    expect(equation({ precision: 9 })).to.equal('y = 0.333333333x + 1');
  });

  describe('#linear()', function () {
    function linear(data) { return regression('linear', data); }

    it('should fit perfectly linear data correctly', function () {
      expect(linear(example.diagLine)).to.deep.equal({
        r2: 1,
        equation: [2, 0],
        points: example.diagLine,
        string: 'y = 2x + 0',
      });
    });
    it('should predict fit for missing linear data correctly', function () {
      expect(linear(example.nullDataDiagLine)).to.deep.equal({
        r2: 1,
        equation: [2, 0],
        points: example.diagLine,
        string: 'y = 2x + 0',
      });
    });
  });

  describe('#linearThroughOrigin()', function () {
    function linearThroughOrigin(data) { return regression('linearThroughOrigin', data); }

    it('should fit perfectly linear data correctly', function () {
      expect(linearThroughOrigin(example.diagLine)).to.deep.equal({
        r2: 1,
        equation: [2],
        points: example.diagLine,
        string: 'y = 2x',
      });
    });
  });
});

/* eslint-env node, mocha */

import { expect } from 'chai';
import * as models from './data';
import regression, { round } from '../src/regression';

describe('round', () => {
  it('rounds to the correct precision', () => {
    expect(round(0.33333333333333333333, 9)).to.equal(0.333333333);
  });
});

describe('models', () => {
  Object.keys(models).forEach((model) => {
    describe(model, () => {
      Object.keys(models[model]).forEach((name) => {
        const example = models[model][name];
        describe(name, () => {
          it(`correctly predicts ${name}`, () => {
            expect(regression(model, example.data, example.order)).to.deep.equal({
              r2: example.r2,
              string: example.string,
              points: example.points,
              equation: example.equation,
            });
          });

          it(`should ignore model name case`, () => {
            const lowercase = regression(model, example.data, example.order);
            const uppercase = regression(model.toUpperCase(), example.data, example.order);
            expect(lowercase).to.deep.equal(uppercase);
          });

          it('should take precision options', () => {
            const notSpecified = regression(model, example.data, example.order);
            const specified = regression(model, example.data, example.order, { precision: 4 });
            expect(specified.equation).to.deep.equal(example.equation.map(v => round(v, 4)));
            expect(notSpecified.equation).to.deep.equal(example.equation.map(v => round(v, 2)));
          });
        });
      });
    });
  });
});

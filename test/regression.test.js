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
            let result = regression(model, example.data, example.order);
            delete result.predict;
            expect(result).to.deep.equal({
              r2: example.r2,
              string: example.string,
              points: example.points,
              equation: example.equation,
            });
          });

          it('should correctly forecast data points', () => {
            const result = regression(model, example.data, example.order);
            expect(result.predict(example.predicted[0])).to.deep.equal(example.predicted);
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

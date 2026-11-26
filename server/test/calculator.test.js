import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcular, sumar, CalcError } from '../src/calculator.js';

test('operaciones básicas', () => {
  assert.equal(calcular('2+3'), 5);
  assert.equal(calcular('10-4'), 6);
  assert.equal(calcular('6*7'), 42);
  assert.equal(calcular('9/2'), 4.5);
});

test('respeta la precedencia y los paréntesis', () => {
  assert.equal(calcular('2+3*4'), 14);
  assert.equal(calcular('(2+3)*4'), 20);
  assert.equal(calcular('10-2-3'), 5);
  assert.equal(calcular('100/10/2'), 5);
});

test('negativos y decimales', () => {
  assert.equal(calcular('-5+2'), -3);
  assert.equal(calcular('3*-2'), -6);
  assert.equal(calcular('0.1+0.2'), 0.3);
});

test('rechaza expresiones inválidas', () => {
  for (const mala of ['', '2+', '2**3', '1/0', 'alert(1)', '(2+3', '1.2.3', '5)']) {
    assert.throws(() => calcular(mala), CalcError, `debió fallar: "${mala}"`);
  }
});

test('sumar', () => {
  assert.equal(sumar(2, 3), 5);
  assert.equal(sumar('2.5', '1.5'), 4);
  assert.throws(() => sumar('a', 1), CalcError);
  assert.throws(() => sumar('', 1), CalcError);
  assert.throws(() => sumar(undefined, 1), CalcError);
});

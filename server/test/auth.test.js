import { test } from 'node:test';
import assert from 'node:assert/strict';
import { login, logout, usuarioDeToken } from '../src/auth.js';

test('login con credenciales correctas devuelve token', () => {
  const token = login('admin', '1234');
  assert.ok(token);
  assert.equal(usuarioDeToken(token), 'admin');
  assert.equal(logout(token), true);
  assert.equal(usuarioDeToken(token), null);
});

test('login con credenciales incorrectas devuelve null', () => {
  assert.equal(login('admin', 'mala'), null);
  assert.equal(login('otro', '1234'), null);
});

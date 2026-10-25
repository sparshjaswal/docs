// Try the lesson's Practice Problems before reading these worked checks.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { totalSelected, moveToCity, isExpired, divide } from '../examples.mjs';

test('cart total handles an empty cart, unselected items, and quantities', () => {
  const cart = Object.freeze([
    Object.freeze({ pricePaise: 10000, quantity: 2, selected: true }),
    Object.freeze({ pricePaise: 5000, quantity: 1, selected: false }),
    Object.freeze({ pricePaise: 3000, quantity: 1, selected: true }),
  ]);
  assert.equal(totalSelected(cart), 23000);
  assert.equal(totalSelected([]), 0);
  assert.equal(totalSelected([cart[1]]), 0);
  assert.equal(cart[0].quantity, 2);
});

test('a city update copies the changed levels and preserves other fields', () => {
  const address = Object.freeze({ city: 'Pune', postcode: '411001' });
  const original = Object.freeze({ name: 'Asha', address });
  const moved = moveToCity(original, 'Delhi');
  assert.deepEqual(moved, {
    name: 'Asha',
    address: { city: 'Delhi', postcode: '411001' },
  });
  assert.notEqual(moved, original);
  assert.notEqual(moved.address, address);
  assert.equal(original.address.city, 'Pune');
});

test('an expiry calculation uses the supplied time and includes the boundary', () => {
  assert.equal(isExpired(100, 99), false);
  assert.equal(isExpired(100, 100), true);
  assert.equal(isExpired(100, 101), true);
});

test('division keeps a valid zero result distinct from a zero-divisor error', () => {
  assert.deepEqual(divide(0, 2), { ok: true, value: 0 });
  assert.deepEqual(divide(10, 2), { ok: true, value: 5 });
  assert.deepEqual(divide(10, 0), {
    ok: false,
    error: 'Divisor must not be zero',
  });
});

// Shared teaching examples. Contracts and limitations are explained in the lessons.
export const pipe =
  (...steps) =>
  (input) =>
    steps.reduce((value, step) => step(value), input);
export const compose =
  (...steps) =>
  (input) =>
    steps.reduceRight((value, step) => step(value), input);
export const pipeAsync =
  (...steps) =>
  (input) =>
    steps.reduce((pending, step) => pending.then(step), Promise.resolve(input));

export const totalSelected = (items) =>
  items
    .filter((item) => item.selected)
    .map((item) => item.pricePaise * item.quantity)
    .reduce((total, amount) => total + amount, 0);
export const moveToCity = (user, city) => ({
  ...user,
  address: { ...user.address, city },
});
export const isExpired = (expiresAtMs, nowMs) => nowMs >= expiresAtMs;
export const divide = (a, b) =>
  b === 0
    ? { ok: false, error: 'Divisor must not be zero' }
    : { ok: true, value: a / b };

export const makeTag = pipe(
  (text) => text.trim(),
  (text) => text.toLowerCase(),
  (text) => text.replace(/\s+/g, '-'),
);

export class Maybe {
  constructor(present, value) {
    this.present = present;
    this.value = value;
    Object.freeze(this);
  }
  static of(value) {
    return new Maybe(true, value);
  }
  static none() {
    return new Maybe(false, undefined);
  }
  static fromNullable(value) {
    return value === null || value === undefined
      ? Maybe.none()
      : Maybe.of(value);
  }
  map(fn) {
    return this.present ? Maybe.of(fn(this.value)) : this;
  }
  flatMap(fn) {
    if (!this.present) return this;
    const next = fn(this.value);
    if (!(next instanceof Maybe)) throw new TypeError('Return a Maybe');
    return next;
  }
  getOrElse(fallback) {
    return this.present ? this.value : fallback;
  }
}

export class Result {
  constructor(ok, value, error) {
    this.ok = ok;
    this.value = value;
    this.error = error;
    Object.freeze(this);
  }
  static of(value) {
    return new Result(true, value, undefined);
  }
  static err(error) {
    return new Result(false, undefined, error);
  }
  map(fn) {
    return this.ok ? Result.of(fn(this.value)) : this;
  }
  flatMap(fn) {
    if (!this.ok) return this;
    const next = fn(this.value);
    if (!(next instanceof Result)) throw new TypeError('Return a Result');
    return next;
  }
  match(onError, onSuccess) {
    return this.ok ? onSuccess(this.value) : onError(this.error);
  }
}

export const parseAge = (text) => {
  if (typeof text !== 'string' || !/^\d+$/.test(text.trim())) {
    return Result.err('Enter whole digits');
  }
  const age = Number(text.trim());
  return Number.isSafeInteger(age)
    ? Result.of(age)
    : Result.err('Age is too large');
};
export const checkAge = (age) =>
  age >= 18 && age <= 120
    ? Result.of(age)
    : Result.err('Use an age from 18 to 120');

// One safe integer input, except -0. The supplied function must be deterministic,
// effect-free, and return a value safe to share. This teaching cache is unbounded.
export const memoizeInteger = (fn) => {
  const cache = new Map();
  return (number) => {
    if (!Number.isSafeInteger(number) || Object.is(number, -0)) {
      throw new TypeError('Use a safe integer other than negative zero');
    }
    if (!cache.has(number)) cache.set(number, fn(number));
    return cache.get(number);
  };
};

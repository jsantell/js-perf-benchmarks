/**
 * Last results: Nov-30-2016
 *
 * Regex x 143,364 ops/sec ±1.58% (83 runs sampled)
 * Array Membership x 63,020 ops/sec ±1.18% (86 runs sampled)
 * CharCode x 316,314 ops/sec ±1.44% (80 runs sampled)
 */
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

const VALID_UUIDS = [
  '66c8374e-3ddb-4c4c-88e1-33941855d2e1',
  'd8c5871f-adb7-4b3e-92ad-ca4e1048393f',
  'fc14994a-dc81-4735-a7e7-75321bf99874',
  '57f8edd5-331b-417f-9cea-f4581fb67118',
  'fbad52fd-3281-4cfd-95ad-18c51a026035',
];

const INVALID_UUIDS = [
  'fbad52fd-3281-4cfd-95ad-18c51a02603',
  'fbad52fd-3281-4cfd-95ad-18c51a02603x',
  'hello',
  'abcdefabcdefabcdefacbdefacbdefabcdef',
  'abcd1234-abcd-1234-acbd-helloyesyou!',
];

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const UUID_CHARS = '0123456789abcdefABCDEF'.split('');
const DASH_INDEXES = [8, 13, 18, 23];

function isUUIDRegex (str) {
  if (str.length !== 36) {
    return false;
  }
  return UUID_REGEX.test(str);
}

function isUUIDArrayMembership (str) {
  if (str.length !== 36) {
    return false;
  }
  for (var i = 0; i < str.length; i++) {
    if (DASH_INDEXES.indexOf(i) !== -1) {
      if (str[i] !== '-') {
        return false;
      }
      continue;
    }
    if (UUID_CHARS.indexOf(str[i]) === -1) {
      return false;
    }
  }
  return true;
}

const CHAR_CODE_0 = '0'.charCodeAt(0);
const CHAR_CODE_9 = '9'.charCodeAt(0);
const CHAR_CODE_a = 'a'.charCodeAt(0);
const CHAR_CODE_f = 'f'.charCodeAt(0);
const CHAR_CODE_A = 'A'.charCodeAt(0);
const CHAR_CODE_F = 'F'.charCodeAt(0);
const CHAR_CODE_DASH = '-'.charCodeAt(0)
function isUUIDCharCode (str) {
  if (str.length !== 36) {
    return false;
  }
  var charCode;
  for (var i = 0; i < str.length; i++) {
    charCode = str.charCodeAt(i);
    if (DASH_INDEXES.indexOf(i) !== -1) {
      if (charCode !== CHAR_CODE_DASH) { return false; }
      continue;
    }
    if (!((charCode >= CHAR_CODE_0 && charCode <= CHAR_CODE_9) ||
          (charCode >= CHAR_CODE_a && charCode <= CHAR_CODE_f) ||
          (charCode >= CHAR_CODE_A && charCode <= CHAR_CODE_F))) {
      return false; 
    }
  }
  return true;
}

function testUUIDs (fn) {
  VALID_UUIDS.forEach(uuid => { if (!fn(uuid)) throw new Error('should be valid')});
  INVALID_UUIDS.forEach(uuid => {if (fn(uuid)) throw new Error('should be invalid')});
}

suite.add('Regex', () => {
  testUUIDs(isUUIDRegex);
});

suite.add('Array Membership', () => {
  testUUIDs(isUUIDArrayMembership);
});

suite.add('CharCode', () => {
  testUUIDs(isUUIDCharCode);
});

suite.on('cycle', e => console.log(String(e.target)));
suite.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
});
suite.run();

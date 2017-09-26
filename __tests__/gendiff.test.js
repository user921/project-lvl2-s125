import path from 'path';
import gendiff from '../src';

test('the same .json', () => {
  const before = path.join(__dirname, 'files', 'before.json');
  const result = '{\n' +
    '  host: hexlet.io\n' +
    '  timeout: 50\n' +
    '  proxy: 123.234.53.22\n' +
    '}';
  expect(gendiff(before, before)).toBe(result);
});

test('after1.json', () => {
  const before = path.join(__dirname, 'files', 'before.json');
  const after = path.join(__dirname, 'files', 'after1.json');
  const result = '{\n' +
    '  host: hexlet.io\n' +
    '  + timeout: 20\n' +
    '  - timeout: 50\n' +
    '  - proxy: 123.234.53.22\n' +
    '  + verbose: true\n' +
    '}';
  expect(gendiff(before, after)).toBe(result);
});

test('after2.json', () => {
  const before = path.join(__dirname, 'files', 'before.json');
  const after = path.join(__dirname, 'files', 'after2.json');
  const result = '{\n' +
    '  - host: hexlet.io\n' +
    '  - timeout: 50\n' +
    '  - proxy: 123.234.53.22\n' +
    '}';
  expect(gendiff(before, after)).toBe(result);
});

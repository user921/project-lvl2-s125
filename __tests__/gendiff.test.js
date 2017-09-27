import path from 'path';
import gendiff from '../src';

const nothingChangedResult = '{\n' +
  '  host: hexlet.io\n' +
  '  timeout: 50\n' +
  '  proxy: 123.234.53.22\n' +
  '}';

const somethingChangedResult = '{\n' +
  '  host: hexlet.io\n' +
  '  + timeout: 20\n' +
  '  - timeout: 50\n' +
  '  - proxy: 123.234.53.22\n' +
  '  + verbose: true\n' +
  '}';

const allDeletedResult = '{\n' +
  '  - host: hexlet.io\n' +
  '  - timeout: 50\n' +
  '  - proxy: 123.234.53.22\n' +
  '}';

const createPath = fileName => path.join(__dirname, 'fixtures', fileName);

describe('JSON', () => {
  const beforePath = createPath('before.json');

  test('nothing changed', () =>
    expect(gendiff(beforePath, beforePath)).toBe(nothingChangedResult));

  test('some properties changed', () =>
    expect(gendiff(beforePath, createPath('after.json'))).toBe(somethingChangedResult));

  test('all properties deleted', () =>
    expect(gendiff(beforePath, createPath('empty.json'))).toBe(allDeletedResult));
});

describe('YAML', () => {
  const beforePath = createPath('before.yml');

  test('nothing changed', () =>
    expect(gendiff(beforePath, beforePath)).toBe(nothingChangedResult));

  test('some properties changed', () =>
    expect(gendiff(beforePath, createPath('after.yml'))).toBe(somethingChangedResult));

  test('all properties deleted', () =>
    expect(gendiff(beforePath, createPath('empty.yml'))).toBe(allDeletedResult));
});

describe('INI', () => {
  const beforePath = createPath('before.ini');

  test('nothing changed', () =>
    expect(gendiff(beforePath, beforePath)).toBe(nothingChangedResult));

  test('some properties changed', () =>
    expect(gendiff(beforePath, createPath('after.ini'))).toBe(somethingChangedResult));

  test('all properties deleted', () =>
    expect(gendiff(beforePath, createPath('empty.ini'))).toBe(allDeletedResult));
});

describe('Errors', () => {
  test('unknown extention', () => {
    const generateError = () => {
      const errorPath = createPath('unknown.lol');
      gendiff(errorPath, errorPath);
    };
    expect(generateError).toThrow('An unknown file extension!');
  });
});

import path from 'path';
import fs from 'fs';
import gendiff from '../src';

const createResult = (resultName) => {
  const filePath = path.join(__dirname, 'fixtures', 'results', resultName);
  return fs.readFileSync(filePath, 'utf8');
};

const nothingChangedResult = createResult('nothingChangedResult.txt');
const somethingChangedResult = createResult('somethingChangedResult.txt');
const allDeletedResult = createResult('allDeletedResult.txt');
const somethingChangedResult2 = createResult('somethingChangedResult2.txt');
const somethingChangedPlainResult = createResult('somethingChangedPlainResult.txt');
const jsonOutput = createResult('jsonOutput.txt');

describe('JSON', () => {
  const createPath = fileName => path.join(__dirname, 'fixtures', 'json', fileName);
  const beforePath = createPath('before.json');

  test('nothing changed', () =>
    expect(gendiff(beforePath, beforePath)).toBe(nothingChangedResult));

  test('some properties updated', () =>
    expect(gendiff(beforePath, createPath('after.json'))).toBe(somethingChangedResult));

  test('all properties deleted', () =>
    expect(gendiff(beforePath, createPath('empty.json'))).toBe(allDeletedResult));

  test('some properties updated: recursive config', () => {
    const beforeRecursivePath = createPath('beforeRecursive.json');
    const afterRecursivePath = createPath('afterRecursive.json');
    expect(gendiff(beforeRecursivePath, afterRecursivePath)).toBe(somethingChangedResult2);
  });

  test('some properties updated: recursive config: plain output', () => {
    const beforeRecursivePath = createPath('beforeRecursive.json');
    const afterRecursivePath = createPath('afterRecursive.json');
    expect(gendiff(beforeRecursivePath, afterRecursivePath, 'plain')).toBe(somethingChangedPlainResult);
  });
});

describe('YAML', () => {
  const createPath = fileName => path.join(__dirname, 'fixtures', 'yml', fileName);
  const beforePath = createPath('before.yml');

  test('nothing changed', () =>
    expect(gendiff(beforePath, beforePath)).toBe(nothingChangedResult));

  test('some properties updated', () =>
    expect(gendiff(beforePath, createPath('after.yml'))).toBe(somethingChangedResult));

  test('all properties deleted', () =>
    expect(gendiff(beforePath, createPath('empty.yml'))).toBe(allDeletedResult));

  test('some properties updated: recursive config', () => {
    const beforeRecursivePath = createPath('beforeRecursive.yml');
    const afterRecursivePath = createPath('afterRecursive.yml');
    expect(gendiff(beforeRecursivePath, afterRecursivePath)).toBe(somethingChangedResult2);
  });

  test('some properties updated: recursive config: plain output', () => {
    const beforeRecursivePath = createPath('beforeRecursive.yml');
    const afterRecursivePath = createPath('afterRecursive.yml');
    expect(gendiff(beforeRecursivePath, afterRecursivePath, 'plain')).toBe(somethingChangedPlainResult);
  });
});

describe('INI', () => {
  const createPath = fileName => path.join(__dirname, 'fixtures', 'ini', fileName);
  const beforePath = createPath('before.ini');

  test('nothing changed', () =>
    expect(gendiff(beforePath, beforePath)).toBe(nothingChangedResult));

  test('some properties updated', () =>
    expect(gendiff(beforePath, createPath('after.ini'))).toBe(somethingChangedResult));

  test('all properties deleted', () =>
    expect(gendiff(beforePath, createPath('empty.ini'))).toBe(allDeletedResult));

  test('some properties updated: recursive config', () => {
    const beforeRecursivePath = createPath('beforeRecursive.ini');
    const afterRecursivePath = createPath('afterRecursive.ini');
    expect(gendiff(beforeRecursivePath, afterRecursivePath)).toBe(somethingChangedResult2);
  });

  test('some properties updated: recursive config: plain output', () => {
    const beforeRecursivePath = createPath('beforeRecursive.ini');
    const afterRecursivePath = createPath('afterRecursive.ini');
    expect(gendiff(beforeRecursivePath, afterRecursivePath, 'plain')).toBe(somethingChangedPlainResult);
  });
});

describe('Errors', () => {
  const createPath = fileName => path.join(__dirname, 'fixtures', fileName);
  test('unknown extention', () => {
    const generateError = () => {
      const errorPath = createPath('unknown.lol');
      gendiff(errorPath, errorPath);
    };
    expect(generateError).toThrow('An unknown file extension!');
  });
});

describe('JSON output', () => {
  const createPath = fileName => path.join(__dirname, 'fixtures', 'json', fileName);
  test('---', () => {
    const beforeRecursivePath = createPath('beforeRecursive.json');
    const afterRecursivePath = createPath('afterRecursive.json');
    expect(gendiff(beforeRecursivePath, afterRecursivePath, 'json')).toBe(jsonOutput);
  });
});

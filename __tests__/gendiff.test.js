import path from 'path';
import gendiff from '../src';

const nothingChangedResult =
  '{\n' +
  '    host: hexlet.io\n' +
  '    timeout: 50\n' +
  '    proxy: 123.234.53.22\n' +
  '}';

const somethingChangedResult =
  '{\n' +
  '    host: hexlet.io\n' +
  '  + timeout: 20\n' +
  '  - timeout: 50\n' +
  '  - proxy: 123.234.53.22\n' +
  '  + verbose: true\n' +
  '}';

const allDeletedResult =
  '{\n' +
  '  - host: hexlet.io\n' +
  '  - timeout: 50\n' +
  '  - proxy: 123.234.53.22\n' +
  '}';

const somethingChangedResult2 =
  '{\n' +
  '    common: {\n' +
  '        setting1: Value 1\n' +
  '      - setting2: 200\n' +
  '        setting3: true\n' +
  '      - setting6: {\n' +
  '            key: value\n' +
  '        }\n' +
  '      + setting4: blah blah\n' +
  '      + setting5: {\n' +
  '            key5: value5\n' +
  '        }\n' +
  '    }\n' +
  '    group1: {\n' +
  '      + baz: bars\n' +
  '      - baz: bas\n' +
  '        foo: bar\n' +
  '    }\n' +
  '  - group2: {\n' +
  '        abc: 12345\n' +
  '    }\n' +
  '  + group3: {\n' +
  '        fee: 100500\n' +
  '    }\n' +
  '}';

const somethingChangedPlainResult =
  "Property 'common.setting2' was removed\n" +
  "Property 'common.setting6' was removed\n" +
  "Property 'common.setting4' was added with value: 'blah blah'\n" +
  "Property 'common.setting5' was added with complex value\n" +
  "Property 'group1.baz' was updated. From 'bas' to 'bars'\n" +
  "Property 'group2' was removed\n" +
  "Property 'group3' was added with complex value\n";

const jsonOutput =
`[
  {
    "key": "common",
    "status": "unchanged",
    "children": {
      "nodes": [
        {
          "key": "setting1",
          "status": "unchanged",
          "oldValue": "Value 1"
        },
        {
          "key": "setting2",
          "status": "deleted",
          "oldValue": "200"
        },
        {
          "key": "setting3",
          "status": "unchanged",
          "oldValue": true
        },
        {
          "key": "setting6",
          "status": "deleted",
          "children": {
            "nodes": [
              {
                "key": "key",
                "status": "unchanged",
                "oldValue": "value"
              }
            ]
          }
        },
        {
          "key": "setting4",
          "status": "added",
          "newValue": "blah blah"
        },
        {
          "key": "setting5",
          "status": "added",
          "children": {
            "nodes": [
              {
                "key": "key5",
                "status": "unchanged",
                "oldValue": "value5"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "key": "group1",
    "status": "unchanged",
    "children": {
      "nodes": [
        {
          "key": "baz",
          "status": "updated",
          "oldValue": "bas",
          "newValue": "bars"
        },
        {
          "key": "foo",
          "status": "unchanged",
          "oldValue": "bar"
        }
      ]
    }
  },
  {
    "key": "group2",
    "status": "deleted",
    "children": {
      "nodes": [
        {
          "key": "abc",
          "status": "unchanged",
          "oldValue": "12345"
        }
      ]
    }
  },
  {
    "key": "group3",
    "status": "added",
    "children": {
      "nodes": [
        {
          "key": "fee",
          "status": "unchanged",
          "oldValue": "100500"
        }
      ]
    }
  }
]`;

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

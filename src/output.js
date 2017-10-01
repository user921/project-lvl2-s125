import _ from 'lodash';

const stringifyValue = (value, n) => {
  if (!_.isObject(value)) {
    return value;
  }
  const obj = value;
  const keys = Object.keys(obj);
  const indent = ' '.repeat(n);

  const stringArray = keys.map((key) => {
    const newN = n + 4;
    const valueForKey = obj[key];

    return _.isObject(valueForKey)
      ? stringifyValue(valueForKey, newN)
      : `${indent}  ${key}: ${valueForKey}\n`;
  });

  return ['{\n', stringArray, ' '.repeat(n - 2), '}'];
};

const createNormalOutput = (ast) => {
  const iter = (nodesArray, n) => {
    const indent = ' '.repeat(n);

    const result = nodesArray.map((node) => {
      const { key, type, children, oldValue, newValue } = node;
      const newN = n + 4;

      switch (type) {
        case 'unchanged':
          return `${indent}  ${key}: ${oldValue}\n`;
        case 'updated':
          return [`${indent}+ ${key}: ${newValue}\n`, `${indent}- ${key}: ${oldValue}\n`];
        case 'deleted':
          return [`${indent}- ${key}: `, stringifyValue(oldValue, newN), '\n'];
        case 'added':
          return [`${indent}+ ${key}: `, stringifyValue(newValue, newN), '\n'];
        default:
          return [`${indent}  ${key}: `, iter(children, newN), '\n'];
      }
    });

    return ['{\n', result, ' '.repeat(n - 2), '}'];
  };

  return _.flattenDeep(iter(ast, 2)).join('');
};

const createPlainOutput = (ast) => {
  const iter = (nodesArray, parent) => {
    const resultArray = nodesArray.map((node) => {
      const { key, type, children, oldValue, newValue } = node;
      switch (type) {
        case 'unchanged':
          return '';
        case 'updated':
          return `Property '${parent}${key}' was updated. From '${oldValue}' to '${newValue}'\n`;
        case 'added':
          return _.isObject(newValue)
            ? `Property '${parent}${key}' was added with complex value\n`
            : `Property '${parent}${key}' was added with value: '${newValue}'\n`;
        case 'deleted':
          return `Property '${parent}${key}' was removed\n`;
        default:
          return iter(children, `${parent}${key}.`);
      }
    });
    return resultArray;
  };
  return _.flattenDeep(iter(ast, '')).join('');
};

const createJsonOutput = ast => JSON.stringify(ast, null, '  ');

const mapper = {
  normal: createNormalOutput,
  plain: createPlainOutput,
  json: createJsonOutput,
};

const renderOutput = (ast, format) => mapper[format](ast);

export default renderOutput;

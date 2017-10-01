import _ from 'lodash';

const createNormalOutput = (ast) => {
  const iter = (nodesArray, n) => {
    const indent = ' '.repeat(n);

    const result = nodesArray.map((node) => {
      const { key, type, status, children, oldValue, newValue } = node;
      const newN = n + 4;

      switch (status) {
        case 'added':
          return type === 'node'
            ? [`${indent}+ ${key}: `, iter(children, newN), '\n']
            : `${indent}+ ${key}: ${newValue}\n`;
        case 'deleted':
          return type === 'node'
            ? [`${indent}- ${key}: `, iter(children, newN), '\n']
            : `${indent}- ${key}: ${oldValue}\n`;
        case 'updated':
          return `${indent}+ ${key}: ${newValue}\n${indent}- ${key}: ${oldValue}\n`;
        default:
          return type === 'node'
            ? [`${indent}  ${key}: `, iter(children, newN), '\n']
            : `${indent}  ${key}: ${oldValue}\n`;
      }
    });

    return ['{\n', result, ' '.repeat(n - 2), '}'];
  };

  return _.flattenDeep(iter(ast, 2)).join('');
};

const createPlainOutput = (ast) => {
  const iter = (nodesArray, parent) => {
    const resultArray = nodesArray.map((node) => {
      const { key, type, status, children, oldValue, newValue } = node;
      switch (status) {
        case 'added':
          return type === 'node'
            ? `Property '${parent}${key}' was added with complex value\n`
            : `Property '${parent}${key}' was added with value: '${newValue}'\n`;
        case 'deleted':
          return `Property '${parent}${key}' was removed\n`;
        case 'updated':
          return `Property '${parent}${key}' was updated. From '${oldValue}' to '${newValue}'\n`;
        default:
          return type === 'node'
            ? iter(children, `${parent}${key}.`)
            : '';
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

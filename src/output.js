import _ from 'lodash';

export const createNormalOutput = (ast) => {
  const iter = (arr, indent) => {
    const result = arr.map((node) => {
      const { key, status, hasChildren, oldValue, newValue } = node;
      const newIndent = `${indent}    `;

      switch (status) {
        case 'added':
          return hasChildren
            ? [`${indent}+ ${key}: `, iter(newValue, newIndent), '\n']
            : `${indent}+ ${key}: ${newValue}\n`;
        case 'deleted':
          return hasChildren
            ? [`${indent}- ${key}: `, iter(oldValue, newIndent), '\n']
            : `${indent}- ${key}: ${oldValue}\n`;
        case 'updated':
          return `${indent}+ ${key}: ${newValue}\n${indent}- ${key}: ${oldValue}\n`;
        default:
          return hasChildren
            ? [`${indent}  ${key}: `, iter(oldValue, newIndent), '\n']
            : `${indent}  ${key}: ${oldValue}\n`;
      }
    });
    return ['{\n', result, `${indent.slice(2)}`, '}'];
  };
  return _.flattenDeep(iter(ast, '  ')).join('');
};

export const createPlainOutput = (ast) => {
  const iter = (arr, parent) => {
    const resultArray = arr.map((node) => {
      const { key, status, hasChildren, oldValue, newValue } = node;
      switch (status) {
        case 'added':
          return hasChildren
            ? `Property '${parent}${key}' was added with complex value\n`
            : `Property '${parent}${key}' was added with value: '${newValue}'\n`;
        case 'deleted':
          return `Property '${parent}${key}' was removed\n`;
        case 'updated':
          return `Property '${parent}${key}' was updated. From '${oldValue}' to '${newValue}'\n`;
        default:
          return hasChildren
            ? iter(oldValue, `${parent}${key}.`)
            : '';
      }
    });
    return resultArray;
  };
  return _.flattenDeep(iter(ast, '')).join('');
};

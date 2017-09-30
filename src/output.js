import _ from 'lodash';

const createNormalOutput = (ast) => {
  const iter = (nodes, indent) => {
    const result = nodes.map((node) => {
      const { key, status, children, oldValue, newValue } = node;
      const newIndent = `${indent}    `;

      switch (status) {
        case 'added':
          return children !== undefined
            ? [`${indent}+ ${key}: `, iter(children.nodes, newIndent), '\n']
            : `${indent}+ ${key}: ${newValue}\n`;
        case 'deleted':
          return children !== undefined
            ? [`${indent}- ${key}: `, iter(children.nodes, newIndent), '\n']
            : `${indent}- ${key}: ${oldValue}\n`;
        case 'updated':
          return `${indent}+ ${key}: ${newValue}\n${indent}- ${key}: ${oldValue}\n`;
        default:
          return children !== undefined
            ? [`${indent}  ${key}: `, iter(children.nodes, newIndent), '\n']
            : `${indent}  ${key}: ${oldValue}\n`;
      }
    });
    return ['{\n', result, `${indent.slice(2)}`, '}'];
  };
  return _.flattenDeep(iter(ast.nodes, '  ')).join('');
};

const createPlainOutput = (ast) => {
  const iter = (nodes, parent) => {
    const resultArray = nodes.map((node) => {
      const { key, status, children, oldValue, newValue } = node;
      switch (status) {
        case 'added':
          return children !== undefined
            ? `Property '${parent}${key}' was added with complex value\n`
            : `Property '${parent}${key}' was added with value: '${newValue}'\n`;
        case 'deleted':
          return `Property '${parent}${key}' was removed\n`;
        case 'updated':
          return `Property '${parent}${key}' was updated. From '${oldValue}' to '${newValue}'\n`;
        default:
          return children !== undefined
            ? iter(children.nodes, `${parent}${key}.`)
            : '';
      }
    });
    return resultArray;
  };
  return _.flattenDeep(iter(ast.nodes, '')).join('');
};

const createJsonOutput = ast => JSON.stringify(ast.nodes, null, '  ');

const mapping = {
  normal: createNormalOutput,
  plain: createPlainOutput,
  json: createJsonOutput,
};

const renderOutput = format => mapping[format];

export default renderOutput;

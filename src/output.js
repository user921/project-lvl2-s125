export const createNormalOutput = (ast) => {
  const iter = (arr, indent) => {
    const result = arr.reduce((acc, node) => {
      const { type, status, key, oldValue, newValue } = node;
      const newIndent = `${indent}    `;

      switch (status) {
        case 'added':
          if (type === 'object') {
            return `${acc}${indent}+ ${key}: ${iter(newValue, newIndent)}\n`;
          }
          return `${acc}${indent}+ ${key}: ${newValue}\n`;
        case 'deleted':
          if (type === 'object') {
            return `${acc}${indent}- ${key}: ${iter(oldValue, newIndent)}\n`;
          }
          return `${acc}${indent}- ${key}: ${oldValue}\n`;
        case 'unchanged':
          if (type === 'object') {
            return `${acc}${indent}  ${key}: ${iter(oldValue, newIndent)}\n`;
          }
          return `${acc}${indent}  ${key}: ${oldValue}\n`;
        default:
          // case 'changed':
          return `${acc}${indent}+ ${key}: ${newValue}\n${indent}- ${key}: ${oldValue}\n`;
      }
    }, '{\n');
    return `${result}${indent.slice(2)}}`;
  };
  return iter(ast, '  ');
};

export const createPlainOutput = (ast) => {
  const iter = (arr, parent) => {
    const result = arr.reduce((acc, node) => {
      const { type, status, key, oldValue, newValue } = node;

      switch (status) {
        case 'added':
          if (type === 'object') {
            return `${acc}Property '${parent}${key}' was added with complex value\n`;
          }
          return `${acc}Property '${parent}${key}' was added with value: '${newValue}'\n`;
        case 'deleted':
          return `${acc}Property '${parent}${key}' was removed\n`;
        case 'unchanged':
          if (type === 'object') {
            const newParent = `${parent}${key}.`;
            return `${acc}${iter(oldValue, newParent)}`;
          }
          return acc;
        default:
          // case 'changed':
          return `${acc}Property '${parent}${key}' was updated. From '${oldValue}' to '${newValue}'\n`;
      }
    }, '');
    return `${result}`;
  };
  return iter(ast, '');
};

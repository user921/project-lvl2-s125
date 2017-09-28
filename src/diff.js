import fs from 'fs';
import path from 'path';
import parse from './parse';
import createAST from './ast';

const diff = (firstConfigPath, secondConfigPath) => {
  const firstConfigContent = fs.readFileSync(firstConfigPath, 'utf8');
  const secondConfigContent = fs.readFileSync(secondConfigPath, 'utf8');

  const obj1 = parse(firstConfigContent, path.extname(firstConfigPath));
  const obj2 = parse(secondConfigContent, path.extname(secondConfigPath));

  const ast = createAST(obj1, obj2);

  const iter = (arr, indent) => {
    const result = arr.reduce((acc, node) => {
      const { type, status, key, oldValue, newValue } = node;

      switch (status) {
        case 'added':
          if (type === 'object') {
            return `${acc}${indent}+ ${key}: ${iter(newValue, `${indent}    `)}\n`;
          }
          return `${acc}${indent}+ ${key}: ${newValue}\n`;
        case 'deleted':
          if (type === 'object') {
            return `${acc}${indent}- ${key}: ${iter(oldValue, `${indent}    `)}\n`;
          }
          return `${acc}${indent}- ${key}: ${oldValue}\n`;
        case 'unchanged':
          if (type === 'object') {
            return `${acc}${indent}  ${key}: ${iter(oldValue, `${indent}    `)}\n`;
          }
          return `${acc}${indent}  ${key}: ${oldValue}\n`;
        default:
          if (type === 'object') {
            return `${acc}${indent}+ ${key}: ${iter(oldValue, `${indent}    `)}\n${indent}- ${key}: ${iter(oldValue, `${indent}    `)}\n`;
          }
          return `${acc}${indent}+ ${key}: ${newValue}\n${indent}- ${key}: ${oldValue}\n`;
      }
    }, '{\n');
    return `${result}${indent.slice(2)}}`;
  };
  return iter(ast, '  ');
};

export default diff;

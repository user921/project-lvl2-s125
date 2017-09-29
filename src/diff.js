import fs from 'fs';
import path from 'path';
import parse from './parser';
import createAST from './ast';
import { createNormalOutput, createPlainOutput } from './output';

const diff = (firstConfigPath, secondConfigPath, format = 'normal', needJson = false) => {
  const firstConfigContent = fs.readFileSync(firstConfigPath, 'utf8');
  const secondConfigContent = fs.readFileSync(secondConfigPath, 'utf8');

  const obj1 = parse(firstConfigContent, path.extname(firstConfigPath));
  const obj2 = parse(secondConfigContent, path.extname(secondConfigPath));

  const ast = createAST(obj1, obj2);

  const output = format === 'normal' ? createNormalOutput(ast) : createPlainOutput(ast);
  return needJson ? JSON.stringify(ast, null, '  ') : output;
};

export default diff;

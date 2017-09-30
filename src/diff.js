import fs from 'fs';
import path from 'path';
import parse from './parser';
import AST from './astClass';
import { createNormalOutput, createPlainOutput, createJsonOutput } from './output';

const mapping = {
  normal: createNormalOutput,
  plain: createPlainOutput,
  json: createJsonOutput,
};

const output = format => mapping[format];

const diff = (firstConfigPath, secondConfigPath, format = 'normal') => {
  const firstConfigContent = fs.readFileSync(firstConfigPath, 'utf8');
  const secondConfigContent = fs.readFileSync(secondConfigPath, 'utf8');

  const obj1 = parse(firstConfigContent, path.extname(firstConfigPath));
  const obj2 = parse(secondConfigContent, path.extname(secondConfigPath));

  const ast = AST.createFromObjects(obj1, obj2);

  // console.log(output('json')(ast));
  return output(format)(ast);
};

export default diff;

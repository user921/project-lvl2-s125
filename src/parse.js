import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

const parse = (filePath) => {
  switch (path.extname(filePath)) {
    case '.json':
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    case '.yml':
      return yaml.safeLoad(fs.readFileSync(filePath, 'utf8')) || {};
    default:
      throw new Error('An unknown file extension!');
  }
};

export default parse;

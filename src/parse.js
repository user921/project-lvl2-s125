import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';

const parse = (filePath) => {
  switch (path.extname(filePath)) {
    case '.json':
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    case '.yml':
      return yaml.safeLoad(fs.readFileSync(filePath, 'utf8')) || {};
    case '.ini':
      return ini.parse(fs.readFileSync(filePath, 'utf8'));
    default:
      throw new Error('An unknown file extension!');
  }
};

export default parse;

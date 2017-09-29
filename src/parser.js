import yaml from 'js-yaml';
import ini from 'ini';

const mapper = {
  '.json': JSON.parse,
  '.yml': fileContent => yaml.safeLoad(fileContent) || {},
  '.ini': ini.parse,
};

const parse = (fileContent, format) => {
  if (!(format in mapper)) {
    throw new Error('An unknown file extension!');
  }
  return mapper[format](fileContent);
};

export default parse;

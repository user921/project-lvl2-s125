import yaml from 'js-yaml';
import ini from 'ini';

const parse = (fileContent, format) => {
  switch (format) {
    case '.json':
      return JSON.parse(fileContent);
    case '.yml':
      return yaml.safeLoad(fileContent) || {};
    case '.ini':
      return ini.parse(fileContent);
    default:
      throw new Error('An unknown file extension!');
  }
};

export default parse;

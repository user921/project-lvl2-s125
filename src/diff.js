import _ from 'lodash';
import parse from './parse';

const diff = (firstConfigPath, secondConfigPath) => {
  const obj1 = parse(firstConfigPath);
  const obj2 = parse(secondConfigPath);
  const uniqueKeys = _.union(Object.keys(obj1), Object.keys(obj2));

  const res = uniqueKeys.reduce((acc, key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (value1 === undefined && value2 !== undefined) {
      return `${acc}  + ${key}: ${value2}\n`;
    } else if (value1 !== undefined && value2 === undefined) {
      return `${acc}  - ${key}: ${value1}\n`;
    } else if (value1 === value2) {
      return `${acc}  ${key}: ${value1}\n`;
    }
    return `${acc}  + ${key}: ${value2}\n  - ${key}: ${value1}\n`;
  }, '{\n');
  return `${res}}`;
};

export default diff;

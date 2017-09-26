import fs from 'fs';

const diff = (firstConfigPath, secondConfigPath) => {
  const obj1 = JSON.parse(fs.readFileSync(firstConfigPath, 'utf8'));
  const obj2 = JSON.parse(fs.readFileSync(secondConfigPath, 'utf8'));

  const keySet = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  const res = [...keySet].reduce((acc, key) => {
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

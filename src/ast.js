import _ from 'lodash';

const isObject = value => typeof value === 'object';
const isPrimitive = value => typeof value !== 'object' && value !== undefined;


const createAST = (oldObject, newObject) => {
  const uniqueKeys = _.union(Object.keys(oldObject), Object.keys(newObject));

  const tree = uniqueKeys.reduce((acc, key) => {
    const oldValue = oldObject[key];
    const newValue = newObject[key];

    if (isObject(oldValue) && isObject(newValue)) {
      return [...acc, { key, status: 'unchanged', children: createAST(oldValue, newValue) }];
    }
    if (isPrimitive(oldValue) && isPrimitive(newValue)) {
      return oldValue === newValue
        ? [...acc, { key, status: 'unchanged', oldValue }]
        : [...acc, { key, status: 'updated', oldValue, newValue }];
    }
    if (isObject(oldValue) && newValue === undefined) {
      return [...acc, { key, status: 'deleted', children: createAST(oldValue, oldValue) }];
    }
    if (oldValue === undefined && isObject(newValue)) {
      return [...acc, { key, status: 'added', children: createAST(newValue, newValue) }];
    }
    if (isPrimitive(oldValue) && newValue === undefined) {
      return [...acc, { key, status: 'deleted', oldValue }];
    }
    // if (oldValue === undefined && isPrimitive(newValue))
    return [...acc, { key, status: 'added', newValue }];
  }, []);

  return tree;
};

export default createAST;

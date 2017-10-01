import _ from 'lodash';

const isPrimitive = value => !_.isObject(value) && !_.isUndefined(value);

const createAST = (oldObject, newObject) => {
  const uniqueKeys = _.union(Object.keys(oldObject), Object.keys(newObject));

  const tree = uniqueKeys.reduce((acc, key) => {
    const oldValue = oldObject[key];
    const newValue = newObject[key];

    if (isPrimitive(oldValue) && isPrimitive(newValue)) {
      return oldValue === newValue
        ? [...acc, { key, type: 'unchanged', oldValue }]
        : [...acc, { key, type: 'updated', oldValue, newValue }];
    }
    if (_.isObject(oldValue) && _.isUndefined(newValue)) {
      return [...acc, { key, type: 'deleted', oldValue }];
    }
    if (isPrimitive(oldValue) && _.isUndefined(newValue)) {
      return [...acc, { key, type: 'deleted', oldValue }];
    }
    if (_.isUndefined(oldValue) && _.isObject(newValue)) {
      return [...acc, { key, type: 'added', newValue }];
    }
    if (_.isUndefined(oldValue) && isPrimitive(newValue)) {
      return [...acc, { key, type: 'added', newValue }];
    }

    return [...acc, { key, type: 'nested', children: createAST(oldValue, newValue) }];
  }, []);

  return tree;
};

export default createAST;

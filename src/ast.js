import _ from 'lodash';

const isPrimitive = value => !_.isObject(value) && !_.isUndefined(value);

const createAST = (oldObject, newObject) => {
  const uniqueKeys = _.union(Object.keys(oldObject), Object.keys(newObject));

  const tree = uniqueKeys.reduce((acc, key) => {
    const oldValue = oldObject[key];
    const newValue = newObject[key];

    // type: 'node'
    if (_.isObject(oldValue)) {
      if (_.isObject(newValue)) {
        return [...acc, { key, type: 'node', status: 'unchanged', nodes: createAST(oldValue, newValue) }];
      }
      if (_.isUndefined(newValue)) {
        return [...acc, { key, type: 'node', status: 'deleted', nodes: createAST(oldValue, oldValue) }];
      }
    }
    if (_.isUndefined(oldValue) && _.isObject(newValue)) {
      return [...acc, { key, type: 'node', status: 'added', nodes: createAST(newValue, newValue) }];
    }

    // type: 'leaf'
    if (isPrimitive(oldValue) && isPrimitive(newValue)) {
      return oldValue === newValue
        ? [...acc, { key, type: 'leaf', status: 'unchanged', oldValue }]
        : [...acc, { key, type: 'leaf', status: 'updated', oldValue, newValue }];
    }

    if (isPrimitive(oldValue) && _.isUndefined(newValue)) {
      return [...acc, { key, type: 'leaf', status: 'deleted', oldValue }];
    }
    // if (_.isUndefined(oldValue) && isPrimitive(newValue))
    return [...acc, { key, type: 'leaf', status: 'added', newValue }];
  }, []);

  return tree;
};

export default createAST;

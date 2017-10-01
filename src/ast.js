import _ from 'lodash';

const isPrimitive = value => !_.isObject(value) && !_.isUndefined(value);

const isAdded = (oldValue, newValue) =>
  (_.isUndefined(oldValue) && (_.isObject(newValue) || isPrimitive(newValue)));

const isDeleted = (oldValue, newValue) =>
  ((_.isObject(oldValue) || isPrimitive(oldValue)) && _.isUndefined(newValue));

const isUnchanged = (oldValue, newValue) =>
  isPrimitive(oldValue) && isPrimitive(newValue) && oldValue === newValue;

const isUpdated = (oldValue, newValue) =>
  isPrimitive(oldValue) && isPrimitive(newValue) && oldValue !== newValue;

const createAST = (oldObject, newObject) => {
  const uniqueKeys = _.union(Object.keys(oldObject), Object.keys(newObject));

  const tree = uniqueKeys.reduce((acc, key) => {
    const oldValue = oldObject[key];
    const newValue = newObject[key];

    if (isUnchanged(oldValue, newValue)) {
      return [...acc, { key, type: 'unchanged', oldValue }];
    }
    if (isUpdated(oldValue, newValue)) {
      return [...acc, { key, type: 'updated', oldValue, newValue }];
    }
    if (isDeleted(oldValue, newValue)) {
      return [...acc, { key, type: 'deleted', oldValue }];
    }
    if (isAdded(oldValue, newValue)) {
      return [...acc, { key, type: 'added', newValue }];
    }

    return [...acc, { key, type: 'nested', children: createAST(oldValue, newValue) }];
  }, []);

  return tree;
};

export default createAST;

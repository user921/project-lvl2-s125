import _ from 'lodash';

const createNode = (key, status, hasChildren, oldValue, newValue) =>
  ({ key, status, hasChildren, oldValue, newValue });

const isObject = value => typeof value === 'object';
const isPrimitive = value => typeof value !== 'object' && value !== undefined;

const createAST = (oldObject, newObject) => {
  const uniqueKeys = _.union(Object.keys(oldObject), Object.keys(newObject));

  const resultArray = uniqueKeys.reduce((acc, key) => {
    const oldValue = oldObject[key];
    const newValue = newObject[key];

    if (isObject(oldValue) && isObject(newValue)) {
      return [...acc, createNode(key, 'unchanged', true, createAST(oldValue, newValue), null)];
    } else if (isPrimitive(oldValue) && isPrimitive(newValue)) {
      if (oldValue === newValue) {
        return [...acc, createNode(key, 'unchanged', false, oldValue, null)];
      }
      return [...acc, createNode(key, 'updated', false, oldValue, newValue)];
    } else if (isObject(oldValue) && newValue === undefined) {
      return [...acc, createNode(key, 'deleted', true, createAST(oldValue, oldValue), null)];
    } else if (oldValue === undefined && isObject(newValue)) {
      return [...acc, createNode(key, 'added', true, null, createAST(newValue, newValue))];
    } else if (isPrimitive(oldValue) && newValue === undefined) {
      return [...acc, createNode(key, 'deleted', false, oldValue, null)];
    }
    // if (oldValue === undefined && isPrimitive(newValue))
    return [...acc, createNode(key, 'added', false, null, newValue)];
  }, []);

  return resultArray;
};

export default createAST;

/*
// node
{
  type: 'primitive',
  status: 'changed',
  key: 'key',
  oldValue,
  newValue,
}

//before
{
  "common": {
    "setting1": "Value 1",
    "setting6": { "key": "value" }
  }
}
// after
{
  "common": {
    "setting1": "Value 2",
    "setting5": { "key5": "value5" }
  },
}

// node
[
  {
    type: 'object',
    status: 'unchanged',
    key: 'common',
    oldValue: [
      {
        type: 'primitive',
        status: 'changed',
        key: 'setting1',
        oldValue: "Value 1",
        newValue: "Value 2",
      },
      {
        type: 'object',
        status: 'deleted',
        key: 'setting6',
        oldValue: [
          {
            type: 'primitive',
            status: 'unchanged',
            key: 'key',
            oldValue: "value",
          },
        ],
      },
      {
        type: 'object',
        status: 'added',
        key: 'setting5',
        newValue: [
          {
            type: 'primitive',
            status: 'unchanged',
            key: 'key5',
            oldValue: "value5",
          },
        ],
      },
    ]
  }
]

*/

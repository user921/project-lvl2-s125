import _ from 'lodash';
import Node from './nodeClass';
import { isObject, isPrimitive } from './lib';

class AST {
  constructor(...nodes) {
    this.nodes = nodes;
  }

  static createFromObjects(oldObject, newObject) {
    const uniqueKeys = _.union(Object.keys(oldObject), Object.keys(newObject));

    const tree = uniqueKeys.reduce((acc, key) => {
      const oldValue = oldObject[key];
      const newValue = newObject[key];

      if (isObject(oldValue) && isObject(newValue)) {
        return acc.addNode(new Node({ key, status: 'unchanged', children: this.createFromObjects(oldValue, newValue) }));
      }
      if (isPrimitive(oldValue) && isPrimitive(newValue)) {
        return oldValue === newValue
          ? acc.addNode(new Node({ key, status: 'unchanged', oldValue }))
          : acc.addNode(new Node({ key, status: 'updated', oldValue, newValue }));
      }
      if (isObject(oldValue) && newValue === undefined) {
        return acc.addNode(new Node({ key, status: 'deleted', children: this.createFromObjects(oldValue, oldValue) }));
      }
      if (oldValue === undefined && isObject(newValue)) {
        return acc.addNode(new Node({ key, status: 'added', children: this.createFromObjects(newValue, newValue) }));
      }
      if (isPrimitive(oldValue) && newValue === undefined) {
        return acc.addNode(new Node({ key, status: 'deleted', oldValue }));
      }
      // if (oldValue === undefined && isPrimitive(newValue))
      return acc.addNode(new Node({ key, status: 'added', newValue }));
    }, new AST());

    return tree;
  }

  addNode(node) {
    return new AST(...this.nodes, node);
  }
}

export default AST;

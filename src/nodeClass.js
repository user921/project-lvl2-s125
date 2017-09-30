class Node {
  constructor({ key, status, children, oldValue, newValue }) {
    this.key = key;
    this.status = status;
    this.children = children;
    this.oldValue = oldValue;
    this.newValue = newValue;
  }
}

export default Node;

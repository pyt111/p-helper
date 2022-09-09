export class TasksQueue<T = any> {
  items: T[] = [];

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    this.items.shift();
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}

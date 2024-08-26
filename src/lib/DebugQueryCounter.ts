export default class DebugQueryCounter {
  static counter = 0;

  static increase() {
    return DebugQueryCounter.counter++;
  }
}

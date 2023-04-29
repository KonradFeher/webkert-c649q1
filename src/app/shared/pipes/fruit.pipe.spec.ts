import { FruitPipe } from './fruit.pipe';

describe('FruitPipe', () => {
  it('create an instance', () => {
    const pipe = new FruitPipe();
    expect(pipe).toBeTruthy();
  });
});

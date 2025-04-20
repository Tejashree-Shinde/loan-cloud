import { MysqlDatePipe } from './mysql-date.pipe';

describe('MysqlDatePipe', () => {
  it('create an instance', () => {
    const pipe = new MysqlDatePipe();
    expect(pipe).toBeTruthy();
  });
});

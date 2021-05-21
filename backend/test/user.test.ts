import {expect} from 'chai';
import User from '../src/model/user';

describe('User tests', () => {
  it('checking default options', () => {
    const user = new User();
    !expect(user.id).to.be.undefined;
    expect(user.email).to.be.undefined;
  });
});

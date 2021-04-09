import {expect} from 'chai';
import {User} from '../src/entity/User';

describe('User tests', () => {
  it('checking default options', () => {
    const user = new User();
    expect(user.notes).to.be.undefined;
    expect(user.id).to.be.undefined;
    expect(user.email).to.be.undefined;
  });
});

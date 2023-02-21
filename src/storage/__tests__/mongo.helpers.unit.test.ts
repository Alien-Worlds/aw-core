import { buildMongoUrl } from '../mongo.helpers';

describe('buildMongoUrl', () => {
  it('should build a valid MongoDB url with user and password', () => {
    const config = {
      hosts: ['localhost'],
      user: 'admin',
      password: 'password',
      ports: ['27017'],
      authMechanism: 'SCRAM-SHA-1'
    };
    const expectedUrl = 'mongodb://admin:password@localhost:27017/?authMechanism=SCRAM-SHA-1';
    const url = buildMongoUrl(config as any);

    expect(url).toEqual(expectedUrl);
  });

  it('should build a valid MongoDB url without user and password', () => {
    const config = { hosts: ['localhost'] };
    const expectedUrl = 'mongodb://localhost:27017';
    const url = buildMongoUrl(config as any);

    expect(url).toEqual(expectedUrl);
  });

  it('should build a valid MongoDB url with SSL enabled', () => {
    const config = { hosts: ['localhost'], ssl: true };
    const expectedUrl = 'mongodb://localhost:27017/?ssl=true';
    const url = buildMongoUrl(config as any);

    expect(url).toEqual(expectedUrl);
  });  
});
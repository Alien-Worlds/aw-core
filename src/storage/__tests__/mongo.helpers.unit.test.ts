import { buildMongoUrl } from '../mongo.helpers';

describe('buildMongoUrl', () => {
  it('should build a valid MongoDB url with user and password', () => {
    const config = {
      host: 'localhost',
      user: 'admin',
      password: 'password',
      port: 27017,
      authMechanism: 'SCRAM-SHA-1'
    };
    const expectedUrl = 'mongodb://admin:password@localhost:27017/?authMechanism=SCRAM-SHA-1';
    const url = buildMongoUrl(config as any);

    expect(url).toEqual(expectedUrl);
  });

  it('should build a valid MongoDB url without user and password', () => {
    const config = { host: 'localhost' };
    const expectedUrl = 'mongodb://localhost';
    const url = buildMongoUrl(config as any);

    expect(url).toEqual(expectedUrl);
  });

  it('should build a valid MongoDB url with SSL enabled', () => {
    const config = { host: 'localhost', ssl: true };
    const expectedUrl = 'mongodb://localhost/?ssl=true';
    const url = buildMongoUrl(config as any);

    expect(url).toEqual(expectedUrl);
  });  
});
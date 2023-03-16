/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { connectMongo, containsSpecialKeys, buildMongoUrl } from '../mongo.utils';

const mockedDb = 'mockedDb';

jest.mock('mongodb', () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => {
      return {
        connect: () => this,
        db: () => mockedDb,
      };
    }),
  };
});

describe('buildMongoUrl', () => {
  it('should build a valid MongoDB url with user and password', () => {
    const config = {
      hosts: ['localhost'],
      user: 'admin',
      password: 'password',
      ports: ['27017'],
      authMechanism: 'SCRAM-SHA-1',
    };
    const expectedUrl =
      'mongodb://admin:password@localhost:27017/?authMechanism=SCRAM-SHA-1';
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

describe('connectMongo Unit tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('Should reject with error when the connection fails', async () => {
    connectMongo({ hosts: [''], database: '' }).catch(error => {
      expect(error).toBeInstanceOf(Error);
    });
  });

  it('Should resolve with Db instance when the connection is successful', async () => {
    const db = await connectMongo({
      hosts: ['localhost'],
      database: 'UnitTest',
    });
    expect(db).toBe(mockedDb);
  });
});

describe('"Storage Utils" unit tests', () => {
  it('"containsSpecialKeys" should return true when given object contains special (operator) keys', () => {
    expect(containsSpecialKeys({ $max: 'foo', bar: 'baz' })).toBeTruthy();
  });

  it('"containsSpecialKeys" should return false when given object does not contain special (operator) keys', () => {
    expect(containsSpecialKeys({ foo: 'foo', bar: 'baz' })).toBeFalsy();
  });

  it('"containsSpecialKeys" should return false when given data is not an object', () => {
    try {
      containsSpecialKeys('');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});

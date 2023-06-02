import { Entity } from "../../../../architecture";
import { UnknownObject } from "../../../../architecture/domain/types";
import { PermissionLevel } from "../../types";
import { Action } from "../action";

// Mock entity class for testing
class MockDataEntity implements Entity {
  public id: string;
  public toJSON(): UnknownObject {
    return {};
  }
}

describe('Action', () => {
  let mockDataEntity: MockDataEntity;

  beforeEach(() => {
    mockDataEntity = new MockDataEntity();
  });

  it('should create an instance of Action', () => {
    const account = 'account';
    const name = 'action';
    const authorization: PermissionLevel[] = [];
    const action = new Action(account, name, authorization, mockDataEntity);

    expect(action.account).toBe(account);
    expect(action.name).toBe(name);
    expect(action.authorization).toBe(authorization);
    expect(action.data).toBe(mockDataEntity);
  });

  it('should create an instance of Action using the create static method', () => {
    const account = 'account';
    const name = 'action';
    const model = {
      account,
      name,
      data: mockDataEntity,
    };
    const action = Action.create(model);

    expect(action.account).toBe(account);
    expect(action.name).toBe(name);
    expect(action.authorization).toBeNull();
    expect(action.data).toBe(mockDataEntity);
  });

  it('should convert Action to JSON', () => {
    const account = 'account';
    const name = 'action';
    const authorization: PermissionLevel[] = [];
    const action = new Action(account, name, authorization, mockDataEntity);

    const expectedJson = {
      id: undefined,
      account,
      name,
      authorization,
      data: {},
    };

    expect(action.toJSON()).toEqual(expectedJson);
  });
});

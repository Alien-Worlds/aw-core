import { Where } from '../../../where/where';
import { UpdateParams, UpdateMethod, UpdateEachParams } from '../update-params';

describe('UpdateParams', () => {
  const where: Where = Where.is({});
  const update = {};

  test('should create update parameters for many updates', () => {
    const updates = [update];
    const wheres = [where];

    const params = UpdateParams.createUpdateMany(update, where);

    expect(params.updates).toEqual(updates);
    expect(params.where).toEqual(wheres);
    expect(params.methods.every(method => method === UpdateMethod.UpdateMany)).toBe(true);
  });

  test('should create update parameters for each update', () => {
    const updateParams: UpdateEachParams[] = [
      {
        update,
        where,
        method: UpdateMethod.UpdateOne,
      },
      {
        update,
        where,
        method: UpdateMethod.UpdateMany,
      },
    ];

    const params = UpdateParams.createUpdateEach(updateParams);

    expect(params.updates).toEqual(updateParams.map(param => param.update));
    expect(params.where).toEqual(updateParams.map(param => param.where));
    expect(params.methods).toEqual(updateParams.map(param => param.method));
  });

  test('should create update parameters for one update', () => {
    const params = UpdateParams.createUpdateOne(update, where);

    expect(params.updates).toEqual([update]);
    expect(params.where).toEqual([where]);
    expect(params.methods).toEqual([UpdateMethod.UpdateOne]);
  });
});

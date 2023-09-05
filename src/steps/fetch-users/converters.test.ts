import { getIdForRole } from './converter';

describe('getIdFromRole', () => {
  test('should return an object with an unknown scope and empty id if an empty object is passed in', () => {
    expect(getIdForRole({})).toEqual({
      scopeName: 'unknown',
      id: 'unknown:unknown',
    });
  });

  test('should return an object with an unknown scope and a half unknown id if an object with only role name but no scope id is passed in', () => {
    expect(
      getIdForRole({
        roleName: 'GROUP_OWNER',
      }),
    ).toEqual({
      scopeName: 'unknown',
      id: 'unknown:GROUP_OWNER',
    });
  });

  test('should return an object with an unknown scope and a half unknown id if an object with only role name but no scope id is passed in', () => {
    expect(
      getIdForRole({
        roleName: 'GROUP_OWNER',
      }),
    ).toEqual({
      scopeName: 'unknown',
      id: 'unknown:GROUP_OWNER',
    });
  });

  test('should return an object with a scope of "org" if a role with a an orgId is passed in', () => {
    expect(
      getIdForRole({
        orgId: '0987654321',
        roleName: 'ORG_OWNER',
      }),
    ).toEqual({
      scopeName: 'org',
      id: '0987654321:ORG_OWNER',
    });
  });

  test('should return an object with a scope of "project" if a role with a groupId is passed in', () => {
    expect(
      getIdForRole({
        groupId: '1234567890',
        roleName: 'GROUP_OWNER',
      }),
    ).toEqual({
      scopeName: 'project',
      id: '1234567890:GROUP_OWNER',
    });
  });

  test('should return an object with a scope of "project" if a role with only project name is passed in, but a scope is passed as well', () => {
    expect(
      getIdForRole(
        {
          roleName: 'GROUP_OWNER',
        },
        { scopeName: 'project', scopeId: '1234567890' },
      ),
    ).toEqual({
      scopeName: 'project',
      id: '1234567890:GROUP_OWNER',
    });
  });
});

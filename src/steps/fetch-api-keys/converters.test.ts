import { getUniqueOrgAndProjectIdsFromRoles } from './converters';

describe('getOrgAndProjectIdsFromRoles', () => {
  test('returns empty arrays when no roles are provided', () => {
    expect(getUniqueOrgAndProjectIdsFromRoles([])).toEqual({
      projectIds: [],
      orgIds: [],
    });
  });
  test('returns an array of unique projectIds', () => {
    const mockRoles = [
      {
        groupId: '64efac48409f7b418e2e1300',
        roleName: 'GROUP_READ_ONLY',
      },
      {
        groupId: '64efac48409f7b418e2e1300',
        roleName: 'GROUP_MEMBER',
      },
    ];
    expect(getUniqueOrgAndProjectIdsFromRoles(mockRoles)).toEqual({
      projectIds: ['64efac48409f7b418e2e1300'],
      orgIds: [],
    });
  });
  test('returns an array of unique orgIds', () => {
    const mockRoles = [
      {
        orgId: '64efac48409f7b418e2e1300',
        roleName: 'ORG_READ_ONLY',
      },
      {
        orgId: '64efac48409f7b418e2e1300',
        roleName: 'ORG_MEMBER',
      },
    ];
    expect(getUniqueOrgAndProjectIdsFromRoles(mockRoles)).toEqual({
      projectIds: [],
      orgIds: ['64efac48409f7b418e2e1300'],
    });
  });

  test('returns an array of unique orgIds and projectIds', () => {
    const mockRoles = [
      {
        orgId: '64efac48409f7b418e2e1300',
        roleName: 'ORG_READ_ONLY',
      },
      {
        orgId: '64efac48409f7b418e2e1300',
        roleName: 'ORG_MEMBER',
      },
      {
        groupId: '64efac48409f7b418e2e1400',
        roleName: 'PROJECT_READ_ONLY',
      },
      {
        groupId: '64efac48409f7b418e2e1400',
        roleName: 'PROJECT_MEMBER',
      },
    ];
    expect(getUniqueOrgAndProjectIdsFromRoles(mockRoles)).toEqual({
      projectIds: ['64efac48409f7b418e2e1400'],
      orgIds: ['64efac48409f7b418e2e1300'],
    });
  });
});

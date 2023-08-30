import { Organization } from '../../types';
import { createOrganizationEntity } from './converters';

describe('createOrganizationEntity', () => {
  const mockMongoDBOrganization: Organization = {
    id: 'mongo-db-org-id-0922',
    isDeleted: false,
    name: 'janus-org',
    links: [
      {
        rel: 'self',
        href: 'https://cloud.mongodb.com/api/atlas/v2/orgs/mongo-db-org-id-0922',
      },
    ],
  };

  test('creates an Organization integration entity', () => {
    expect(createOrganizationEntity(mockMongoDBOrganization)).toEqual({
      _class: ['Organization'],
      _type: 'mongodb_organization',
      _key: 'mongodb_organization:mongo-db-org-id-0922',
      _rawData: [
        {
          name: 'default',
          rawData: mockMongoDBOrganization,
        },
      ],
      createdOn: undefined,
      displayName: 'janus-org',
      name: 'janus-org',
      id: 'mongo-db-org-id-0922',
      organizationId: 'mongo-db-org-id-0922',
      webLink: 'https://cloud.mongodb.com/v2#/org/mongo-db-org-id-0922',
      isDeleted: false,
    });
  });
});

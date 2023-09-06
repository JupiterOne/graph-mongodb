import { fetchProjectsSteps } from './fetch-projects';
import { fetchClustersSteps } from './fetch-clusters';
import { fetchUsersSteps } from './fetch-users';
import { fetchTeamsSteps } from './fetch-teams';
import { fetchOrganizationsSteps } from './fetch-organizations';
import { fetchApiKeysSteps } from './fetch-api-keys';

const integrationSteps = [
  ...fetchOrganizationsSteps,
  ...fetchProjectsSteps,
  ...fetchClustersSteps,
  ...fetchUsersSteps,
  ...fetchTeamsSteps,
  ...fetchApiKeysSteps,
];

export { integrationSteps };

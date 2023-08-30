import { fetchProjectsSteps } from './fetch-projects';
import { fetchClustersSteps } from './fetch-clusters';
import { fetchUsersSteps } from './fetch-users';
import { fetchTeamsSteps } from './fetch-teams';
import { fetchOrganizationsSteps } from './fetch-organizations';
import { fetchKeysSteps } from './fetch-keys';

const integrationSteps = [
  ...fetchOrganizationsSteps,
  ...fetchProjectsSteps,
  ...fetchClustersSteps,
  ...fetchUsersSteps,
  ...fetchTeamsSteps,
  ...fetchKeysSteps,
];

export { integrationSteps };

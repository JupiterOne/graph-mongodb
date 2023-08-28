import { fetchTenantSteps } from './fetch-tenant';
import { fetchProjectsSteps } from './fetch-projects';
import { fetchClustersSteps } from './fetch-clusters';
import { fetchUsersSteps } from './fetch-users';
import { fetchTeamsSteps } from './fetch-teams';
import { fetchRolesSteps } from './fetch-roles';

const integrationSteps = [
  ...fetchTenantSteps,
  ...fetchProjectsSteps,
  ...fetchClustersSteps,
  ...fetchUsersSteps,
  ...fetchTeamsSteps,
  ...fetchRolesSteps,
];

export { integrationSteps };

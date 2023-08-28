import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  publicKey: {
    type: 'string',
    mask: false,
  },
  privateKey: {
    type: 'string',
    mask: true,
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  publicKey: string;
  privateKey: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.publicKey || !config.privateKey) {
    throw new IntegrationValidationError(
      'Config requires all of publicKey,privateKey',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}

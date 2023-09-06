import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { setupProjectRecording } from '../../../test/recording';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';

describe('Fetch api keys step', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetch-api-keys',
      options: {
        recordFailedRequests: true,
      },
    });
  });

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('fetches api keys correctly', async () => {
    const stepConfig = buildStepTestConfigForStep(Steps.FETCH_API_KEYS);
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
  test('fetches api key roles correctly', async () => {
    const stepConfig = buildStepTestConfigForStep(Steps.FETCH_API_KEY_ROLES);
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});

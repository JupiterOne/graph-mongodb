import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { setupProjectRecording } from '../../../test/recording';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';

describe('Fetch organizations step', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetch-organizations',
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

  test('fetches organizations correctly', async () => {
    const stepConfig = buildStepTestConfigForStep(Steps.FETCH_ORGANIZATIONS);
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});

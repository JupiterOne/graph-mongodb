import {
  Recording,
  createMockExecutionContext,
} from '@jupiterone/integration-sdk-testing';
import { setupProjectRecording } from '../test/recording';
import { validateInvocation } from './config';
import { integrationConfig } from '../test/config';

describe('#validateInvocation', () => {
  let recording: Recording;

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test.each([
    { instanceConfig: {} },
    { instanceConfig: { wrong: 'config' } },
    { instanceConfig: { publicKey: 'missing privateKey' } },
    { instanceConfig: { privateKey: 'missing publicKey' } },
  ])('requires valid config', async ({ instanceConfig }) => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'validate-config',
    });

    const executionContext = createMockExecutionContext({
      instanceConfig,
    });

    await expect(validateInvocation(executionContext as any)).rejects.toThrow(
      'Config requires all of publicKey,privateKey',
    );
  });

  test('successfully validates invocation', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'validate-invocation',
    });

    const executionContext = createMockExecutionContext({
      instanceConfig: integrationConfig,
    });

    await expect(validateInvocation(executionContext)).resolves.toBe(undefined);
  });

  test('fails validating invocation', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'validate-invocation',
      options: {
        recordFailedRequests: true,
      },
    });

    const executionContext = createMockExecutionContext({
      instanceConfig: {
        publicKey: 'bob',
        privateKey: 'brad',
      },
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      'Provider authentication failed at https://cloud.mongodb.com/api/atlas/v2: 401 Unauthorized',
    );
  });
});

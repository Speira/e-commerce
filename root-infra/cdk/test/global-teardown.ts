// Jest Global Teardown - Runs once after all tests
import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';

export default async function globalTeardown(): Promise<void> {
  console.log('🌍 Global Teardown: Cleaning up after test suite...');

  try {
    // Clean coverage directory (keep test results)
    if (existsSync('coverage')) {
      console.log('📊 Coverage report preserved at: coverage/');
    }

    // Clean Jest cache
    if (existsSync('.jest-cache')) {
      rmSync('.jest-cache', { recursive: true, force: true });
      console.log('🧹 Cleaned Jest cache');
    }

    // Clean temporary CDK files (requires sudo for /tmp)
    try {
      execSync('sudo rm -rf /tmp/cdk* /tmp/cdk-custom-resource*', {
        stdio: 'pipe',
        timeout: 10000,
      });
      console.log('🧹 Cleaned CDK temporary files');
    } catch (error: unknown) {
      // If sudo fails, try without sudo (may not work for /tmp)
      try {
        execSync('rm -rf /tmp/cdk* /tmp/cdk-custom-resource*', {
          stdio: 'pipe',
          timeout: 10000,
        });
        console.log('🧹 Cleaned CDK temporary files (without sudo)');
      } catch (cleanupError: unknown) {
        console.warn(
          '⚠️  Could not clean CDK temporary files:',
          (cleanupError as Error).message,
        );
      }
    }

    // Final disk space check
    try {
      const output = execSync('df -h .', { encoding: 'utf8' });
      const lines = output.trim().split('\n');
      const currentDir = lines[1];

      if (currentDir) {
        const parts = currentDir.split(/\s+/);
        const used = parts[2];
        const available = parts[3];
        const usePercent = parts[4];

        console.log(
          `💾 Final disk usage: ${used} used, ${available} available (${usePercent})`,
        );
      }
    } catch (error: unknown) {
      console.warn(
        '⚠️  Could not check final disk space:',
        (error as Error).message,
      );
    }

    console.log('✅ Global Teardown completed successfully');
  } catch (error: unknown) {
    console.error('❌ Global Teardown failed:', (error as Error).message);
    // Don't throw - cleanup failure shouldn't fail the test suite
  }
}

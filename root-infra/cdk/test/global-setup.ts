// Jest Global Setup - Runs once before all tests
import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';

export default async function globalSetup(): Promise<void> {
  console.log('🌍 Global Setup: Cleaning up before test suite...');

  try {
    // Clean CDK output directory
    if (existsSync('cdk.out')) {
      rmSync('cdk.out', { recursive: true, force: true });
      console.log('🧹 Cleaned cdk.out directory');
    }

    // Clean Jest cache
    if (existsSync('.jest-cache')) {
      rmSync('.jest-cache', { recursive: true, force: true });
      console.log('🧹 Cleaned Jest cache');
    }

    // Clean coverage directory
    if (existsSync('coverage')) {
      rmSync('coverage', { recursive: true, force: true });
      console.log('🧹 Cleaned coverage directory');
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

    // Check disk space
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
          `💾 Disk usage: ${used} used, ${available} available (${usePercent})`,
        );

        // Warn if disk usage is high
        const percent = parseInt(usePercent.replace('%', ''));
        if (percent > 80) {
          console.warn(
            '⚠️  High disk usage detected! Consider cleaning up temporary files.',
          );
        }
      }
    } catch (error: unknown) {
      console.warn('⚠️  Could not check disk space:', (error as Error).message);
    }

    console.log('✅ Global Setup completed successfully');
  } catch (error: unknown) {
    console.error('❌ Global Setup failed:', (error as Error).message);
    // Don't throw - let tests continue even if cleanup fails
  }
}

import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { EcommerceInfrastructureStack } from '../stacks/ecommerce-infrastructure-stack';

/**
 * Detect unintended changes in infra. to use as a regression test
 *
 * Nb: When infrastructure changes are intentional, update the snapshot: pnpm
 * run test:snapshot:update
 */
describe('CDK Stack Snapshot', () => {
  let app: cdk.App;
  let stack: EcommerceInfrastructureStack;
  let template: Template;

  beforeAll(() => {
    app = new cdk.App();
    stack = new EcommerceInfrastructureStack(app, 'TestStack', {
      env: {
        account: '123456789012',
        region: 'eu-west-3',
      },
    });
    template = Template.fromStack(stack);
  });

  it('should match the complete infrastructure snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });
});

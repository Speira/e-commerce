#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { EcommerceInfrastructureStack } from '../stacks/ecommerce-infrastructure-stack';

const app = new cdk.App();

// Environment configuration for eu-west-3
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'eu-west-3',
};

// Main e-commerce infrastructure stack
new EcommerceInfrastructureStack(app, 'EcommerceInfrastructureStack', {
  env,
  description:
    'Secure e-commerce infrastructure with API Gateway, Lambda, RDS, and S3',
  tags: {
    Project: 'Ecommerce',
    Environment: 'Production',
    ManagedBy: 'CDK',
  },
});

// Add tags to all resources
cdk.Tags.of(app).add('Project', 'Ecommerce');
cdk.Tags.of(app).add('Environment', 'Production');
cdk.Tags.of(app).add('ManagedBy', 'CDK');

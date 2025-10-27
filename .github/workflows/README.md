# GitHub Workflows

This directory contains GitHub Actions workflows for the e-commerce project. These workflows provide automated CI/CD, testing, linting, security scanning, and deployment capabilities.

## Workflows Overview

### 🔄 CI (`ci.yml`)

**Triggers:** Push to `main`/`develop`, Pull Requests to `main`/`develop`

The main continuous integration workflow that runs on every push and pull request:

- **Linting**: Runs ESLint across all projects
- **Type Checking**: Validates TypeScript types across all projects
- **Testing**: Executes all test suites
- **Building**: Builds all projects to ensure they compile
- **Security Audit**: Checks for known vulnerabilities in dependencies

**Key Features:**

- Parallel job execution for faster CI
- Nx caching for improved performance
- Artifact uploads for test results and build outputs
- Comprehensive status reporting

### 🚀 Deploy (`deploy.yml`)

**Triggers:** Push to `main`, Manual dispatch

Handles deployment of infrastructure and applications:

- **Environment Detection**: Automatically determines staging vs production
- **Infrastructure Deployment**: Deploys AWS CDK infrastructure
- **UI Deployment**: Builds and deploys Next.js applications
- **Verification**: Post-deployment health checks

**Environments:**

- `staging`: Automatic deployment from develop branch
- `production`: Manual deployment from main branch

**Security:**

- Requires environment approval for production
- Uses AWS credentials from GitHub secrets
- Validates deployment outputs

### 📦 Dependency Updates (`dependency-update.yml`)

**Triggers:** Weekly schedule (Mondays 9 AM UTC), Manual dispatch

Automated dependency management:

- **Outdated Detection**: Scans for outdated packages
- **Automated Updates**: Creates PRs with dependency updates
- **Security Scanning**: Validates updated dependencies
- **License Compliance**: Checks package licenses

**Update Types:**

- `patch`: Bug fixes and patches
- `minor`: New features, backward compatible
- `major`: Breaking changes (manual review required)

### 🔍 Code Quality (`code-quality.yml`)

**Triggers:** Push/PR to main branches, Daily security scans

Comprehensive code quality and security analysis:

- **Code Quality**: ESLint, Prettier, TypeScript validation
- **Security Scanning**: Snyk integration, vulnerability checks
- **Dependency Analysis**: License compliance, vulnerability scanning
- **Complexity Analysis**: Code complexity metrics and reporting

### ✅ PR Validation (`pr-validation.yml`)

**Triggers:** Pull Request events

Specialized validation for pull requests:

- **Semantic PR**: Validates commit message format
- **Affected Testing**: Runs tests only for changed projects (Nx)
- **Security Checks**: Scans for secrets and vulnerabilities
- **Size Validation**: Warns about large PRs
- **Critical Files**: Special handling for infrastructure changes

## Configuration

### Required Secrets

Add these secrets to your GitHub repository settings:

```bash
# AWS Deployment
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Security Scanning (Optional)
SNYK_TOKEN=your_snyk_token

# Code Coverage (Optional)
CODECOV_TOKEN=your_codecov_token
```

### Environment Protection Rules

Configure these environments in GitHub:

1. **staging**: Auto-deploy from develop branch
2. **production**: Manual approval required

### Branch Protection Rules

Recommended branch protection for `main`:

- Require status checks to pass before merging
- Require branches to be up to date before merging
- Require pull request reviews
- Restrict pushes to main branch

## Usage

### Running Workflows Manually

```bash
# Deploy to specific environment
gh workflow run deploy.yml -f environment=staging

# Update dependencies
gh workflow run dependency-update.yml -f update_type=minor

# Run code quality checks
gh workflow run code-quality.yml
```

### Monitoring Workflows

- View workflow runs in the GitHub Actions tab
- Check workflow status badges in README
- Monitor deployment status in environment pages
- Review security scan results in Security tab

### Troubleshooting

**Common Issues:**

1. **Cache Misses**: Clear Nx cache if builds are inconsistent
2. **Permission Errors**: Verify AWS credentials and GitHub secrets
3. **Test Failures**: Check test logs and update tests as needed
4. **Dependency Conflicts**: Review dependency update PRs carefully

**Debug Commands:**

```bash
# Clear Nx cache
npx nx reset

# Run specific workflow locally
pnpm lint
pnpm test
pnpm build

# Check affected projects
npx nx show projects --affected
```

## Performance Optimization

### Caching Strategy

- **pnpm Store**: Cached across all workflows
- **Nx Cache**: Shared between CI and local development
- **Node Modules**: Cached per package manager lock file

### Parallel Execution

- Jobs run in parallel when possible
- Nx affected commands only run changed projects
- Independent workflows can run simultaneously

### Resource Management

- Use appropriate runner sizes for job requirements
- Clean up artifacts after successful runs
- Monitor workflow execution times

## Security Considerations

### Secrets Management

- Never commit secrets to repository
- Use GitHub secrets for sensitive data
- Rotate credentials regularly
- Use least-privilege access

### Dependency Security

- Regular vulnerability scanning
- Automated security updates
- License compliance checking
- Supply chain security monitoring

### Code Security

- Secret scanning in PRs
- Dependency vulnerability checks
- Security-focused code reviews
- Regular security audits

## Contributing

When adding new workflows:

1. Follow existing naming conventions
2. Include comprehensive documentation
3. Add appropriate triggers and conditions
4. Test workflows thoroughly
5. Update this README

## Support

For workflow issues:

1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Consult Nx and GitHub Actions documentation
4. Create an issue for persistent problems

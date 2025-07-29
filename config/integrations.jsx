import { 
  GitBranch, 
  Shield, 
  Cloud, 
  Server, 
  Database, 
  Lock, 
  Zap, 
  Settings,
  Monitor,
  Package,
  Briefcase,
  Users,
  Code,
  Workflow,
  Terminal,
  FileCode,
  Container,
  Layers
} from 'lucide-react';

export const INTEGRATIONS_CONFIG = {
  // Version Control & Repository Management
  github: {
    name: 'GitHub',
    category: 'devops',
    icon: GitBranch,
    description: 'Integrate with GitHub repositories for security scanning and vulnerability management',
    features: ['Repository scanning', 'PR security checks', 'Dependency alerts', 'Secret scanning'],
    status: 'available',
    setupSteps: [
      { title: 'Generate GitHub Token', description: 'Create a personal access token with repo and security_events permissions' },
      { title: 'Configure Webhooks', description: 'Set up webhooks for real-time security notifications' },
      { title: 'Enable Security Features', description: 'Activate Dependabot and secret scanning' }
    ],
    config: {
      fields: [
        { name: 'token', type: 'password', label: 'GitHub Personal Access Token', required: true },
        { name: 'org', type: 'text', label: 'Organization Name', required: true },
        { name: 'webhookUrl', type: 'text', label: 'Webhook URL', required: false }
      ]
    }
  },

  gitlab: {
    name: 'GitLab',
    category: 'devops',
    icon: GitBranch,
    description: 'Connect GitLab for comprehensive DevSecOps pipeline integration',
    features: ['Pipeline security', 'SAST/DAST integration', 'Container scanning', 'License compliance'],
    status: 'available',
    setupSteps: [
      { title: 'Create Access Token', description: 'Generate a GitLab access token with API scope' },
      { title: 'Configure CI/CD Variables', description: 'Add security scanning variables to your projects' },
      { title: 'Setup Security Policies', description: 'Configure security policies for merge requests' }
    ],
    config: {
      fields: [
        { name: 'token', type: 'password', label: 'GitLab Access Token', required: true },
        { name: 'baseUrl', type: 'text', label: 'GitLab Instance URL', required: true, default: 'https://gitlab.com' },
        { name: 'projectId', type: 'text', label: 'Project ID', required: false }
      ]
    }
  },

  // CRM & Business Tools
  salesforce: {
    name: 'Salesforce',
    category: 'billing',
    icon: Briefcase,
    description: 'Integrate with Salesforce for security incident management and compliance tracking',
    features: ['Incident case creation', 'Compliance reporting', 'Security metrics dashboard', 'Customer notifications'],
    status: 'available',
    setupSteps: [
      { title: 'Create Connected App', description: 'Set up a connected app in Salesforce with OAuth settings' },
      { title: 'Configure OAuth', description: 'Obtain client ID and secret for API access' },
      { title: 'Set Permissions', description: 'Grant necessary permissions for case and data management' }
    ],
    config: {
      fields: [
        { name: 'clientId', type: 'text', label: 'Consumer Key', required: true },
        { name: 'clientSecret', type: 'password', label: 'Consumer Secret', required: true },
        { name: 'instanceUrl', type: 'text', label: 'Instance URL', required: true },
        { name: 'username', type: 'text', label: 'Username', required: true },
        { name: 'securityToken', type: 'password', label: 'Security Token', required: true }
      ]
    }
  },

  // Cloud Platforms
  gcp: {
    name: 'Google Cloud Platform',
    category: 'cloud',
    icon: Cloud,
    description: 'Comprehensive Google Cloud security monitoring and compliance',
    features: ['IAM monitoring', 'Resource scanning', 'Security Command Center integration', 'Cloud Asset Inventory'],
    status: 'available',
    setupSteps: [
      { title: 'Create Service Account', description: 'Create a service account with Security Admin role' },
      { title: 'Download JSON Key', description: 'Download the service account key file' },
      { title: 'Enable APIs', description: 'Enable Security Command Center and Cloud Asset APIs' }
    ],
    config: {
      fields: [
        { name: 'serviceAccountKey', type: 'textarea', label: 'Service Account JSON Key', required: true },
        { name: 'projectId', type: 'text', label: 'Project ID', required: true },
        { name: 'organizationId', type: 'text', label: 'Organization ID', required: false }
      ]
    }
  },

  azure: {
    name: 'Microsoft Azure',
    category: 'cloud',
    icon: Cloud,
    description: 'Azure Security Center and Defender integration for cloud security',
    features: ['Security Center alerts', 'Defender for Cloud', 'Key Vault monitoring', 'Compliance assessments'],
    status: 'available',
    setupSteps: [
      { title: 'Register Application', description: 'Register an app in Azure Active Directory' },
      { title: 'Configure Permissions', description: 'Grant Security Reader and Contributor permissions' },
      { title: 'Create Client Secret', description: 'Generate a client secret for authentication' }
    ],
    config: {
      fields: [
        { name: 'tenantId', type: 'text', label: 'Tenant ID', required: true },
        { name: 'clientId', type: 'text', label: 'Application (Client) ID', required: true },
        { name: 'clientSecret', type: 'password', label: 'Client Secret', required: true },
        { name: 'subscriptionId', type: 'text', label: 'Subscription ID', required: true }
      ]
    }
  },

  // Deployment & Infrastructure
  octopusDeploy: {
    name: 'Octopus Deploy',
    category: 'devops',
    icon: Package,
    description: 'Secure deployment orchestration with security scanning integration',
    features: ['Deployment security checks', 'Environment compliance', 'Release validation', 'Security gates'],
    status: 'available',
    setupSteps: [
      { title: 'Generate API Key', description: 'Create an API key in Octopus Deploy with appropriate permissions' },
      { title: 'Configure Security Steps', description: 'Add security scanning steps to deployment processes' },
      { title: 'Setup Notifications', description: 'Configure security alert notifications' }
    ],
    config: {
      fields: [
        { name: 'serverUrl', type: 'text', label: 'Octopus Server URL', required: true },
        { name: 'apiKey', type: 'password', label: 'API Key', required: true },
        { name: 'spaceId', type: 'text', label: 'Space ID', required: false }
      ]
    }
  },

  codefresh: {
    name: 'Codefresh',
    category: 'devops',
    icon: Workflow,
    description: 'GitOps and CI/CD security integration with container scanning',
    features: ['Pipeline security', 'Image scanning', 'GitOps security', 'Compliance checks'],
    status: 'available',
    setupSteps: [
      { title: 'Generate API Token', description: 'Create a Codefresh API token with pipeline permissions' },
      { title: 'Configure Security Steps', description: 'Add security scanning steps to pipelines' },
      { title: 'Setup Image Scanning', description: 'Enable container image vulnerability scanning' }
    ],
    config: {
      fields: [
        { name: 'apiToken', type: 'password', label: 'API Token', required: true },
        { name: 'accountId', type: 'text', label: 'Account ID', required: true },
        { name: 'runtime', type: 'text', label: 'Runtime Environment', required: false }
      ]
    }
  },

  digitalocean: {
    name: 'DigitalOcean',
    category: 'cloud',
    icon: Server,
    description: 'DigitalOcean infrastructure security monitoring and compliance',
    features: ['Droplet monitoring', 'Kubernetes security', 'Database security', 'Load balancer protection'],
    status: 'available',
    setupSteps: [
      { title: 'Generate Personal Access Token', description: 'Create a token with read/write permissions' },
      { title: 'Configure Monitoring', description: 'Enable monitoring for droplets and services' },
      { title: 'Setup Alerts', description: 'Configure security alerts and notifications' }
    ],
    config: {
      fields: [
        { name: 'token', type: 'password', label: 'Personal Access Token', required: true },
        { name: 'teamId', type: 'text', label: 'Team ID', required: false }
      ]
    }
  },

  // CI/CD Platforms
  jenkins: {
    name: 'Jenkins',
    category: 'devops',
    icon: Settings,
    description: 'Jenkins CI/CD security integration with pipeline scanning',
    features: ['Pipeline security', 'Plugin vulnerability scanning', 'Build security checks', 'Credential management'],
    status: 'available',
    setupSteps: [
      { title: 'Install Security Plugin', description: 'Install the SerpienteSegura Jenkins plugin' },
      { title: 'Configure API Token', description: 'Create Jenkins API token for integration' },
      { title: 'Setup Security Steps', description: 'Add security scanning to build pipelines' }
    ],
    config: {
      fields: [
        { name: 'url', type: 'text', label: 'Jenkins URL', required: true },
        { name: 'username', type: 'text', label: 'Username', required: true },
        { name: 'apiToken', type: 'password', label: 'API Token', required: true }
      ]
    }
  },

  circleci: {
    name: 'CircleCI',
    category: 'devops',
    icon: Zap,
    description: 'CircleCI pipeline security integration and vulnerability scanning',
    features: ['Orb security scanning', 'Pipeline compliance', 'Artifact scanning', 'Security gates'],
    status: 'available',
    setupSteps: [
      { title: 'Generate Personal API Token', description: 'Create a CircleCI personal API token' },
      { title: 'Install Security Orb', description: 'Add SerpienteSegura orb to your config' },
      { title: 'Configure Workflows', description: 'Add security checks to your workflows' }
    ],
    config: {
      fields: [
        { name: 'apiToken', type: 'password', label: 'Personal API Token', required: true },
        { name: 'vcsType', type: 'select', label: 'VCS Type', options: ['github', 'bitbucket'], required: true },
        { name: 'organization', type: 'text', label: 'Organization', required: true }
      ]
    }
  },

  travisci: {
    name: 'Travis CI',
    category: 'devops',
    icon: Workflow,
    description: 'Travis CI security integration for continuous security testing',
    features: ['Build security', 'Dependency scanning', 'Security notifications', 'Compliance reporting'],
    status: 'available',
    setupSteps: [
      { title: 'Generate API Token', description: 'Create Travis CI API token' },
      { title: 'Configure .travis.yml', description: 'Add security scanning steps to build config' },
      { title: 'Setup Notifications', description: 'Configure security alert notifications' }
    ],
    config: {
      fields: [
        { name: 'apiToken', type: 'password', label: 'API Token', required: true },
        { name: 'domain', type: 'select', label: 'Travis Domain', options: ['travis-ci.org', 'travis-ci.com'], required: true }
      ]
    }
  },

  // Container & Orchestration
  docker: {
    name: 'Docker Hub',
    category: 'devops',
    icon: Container,
    description: 'Docker Hub integration for container image security scanning',
    features: ['Image vulnerability scanning', 'Registry monitoring', 'Compliance checking', 'Security notifications'],
    status: 'available',
    setupSteps: [
      { title: 'Create Access Token', description: 'Generate Docker Hub access token' },
      { title: 'Configure Webhooks', description: 'Setup webhooks for image push notifications' },
      { title: 'Enable Scanning', description: 'Configure automated vulnerability scanning' }
    ],
    config: {
      fields: [
        { name: 'username', type: 'text', label: 'Docker Hub Username', required: true },
        { name: 'accessToken', type: 'password', label: 'Access Token', required: true },
        { name: 'namespace', type: 'text', label: 'Namespace/Organization', required: false }
      ]
    }
  },

  kubernetes: {
    name: 'Kubernetes',
    category: 'devops',
    icon: Layers,
    description: 'Kubernetes cluster security monitoring and compliance',
    features: ['Cluster security scanning', 'RBAC monitoring', 'Pod security policies', 'Network policies'],
    status: 'available',
    setupSteps: [
      { title: 'Create Service Account', description: 'Create a service account with cluster-admin role' },
      { title: 'Generate Token', description: 'Generate a token for the service account' },
      { title: 'Configure RBAC', description: 'Setup role-based access controls' }
    ],
    config: {
      fields: [
        { name: 'apiServer', type: 'text', label: 'API Server URL', required: true },
        { name: 'token', type: 'password', label: 'Service Account Token', required: true },
        { name: 'caCertificate', type: 'textarea', label: 'CA Certificate', required: true },
        { name: 'namespace', type: 'text', label: 'Default Namespace', required: false, default: 'default' }
      ]
    }
  },

  // Infrastructure as Code
  terraform: {
    name: 'Terraform Cloud',
    category: 'devops',
    icon: Code,
    description: 'Terraform infrastructure security scanning and compliance',
    features: ['IaC security scanning', 'Policy as code', 'Compliance checking', 'Drift detection'],
    status: 'available',
    setupSteps: [
      { title: 'Generate API Token', description: 'Create Terraform Cloud API token' },
      { title: 'Configure Policies', description: 'Setup Sentinel policies for security' },
      { title: 'Enable Notifications', description: 'Configure security alert notifications' }
    ],
    config: {
      fields: [
        { name: 'token', type: 'password', label: 'API Token', required: true },
        { name: 'organization', type: 'text', label: 'Organization Name', required: true },
        { name: 'workspace', type: 'text', label: 'Workspace Name', required: false }
      ]
    }
  },

  ansible: {
    name: 'Ansible Tower/AWX',
    category: 'devops',
    icon: Terminal,
    description: 'Ansible automation security and compliance monitoring',
    features: ['Playbook security scanning', 'Inventory monitoring', 'Credential management', 'Compliance automation'],
    status: 'available',
    setupSteps: [
      { title: 'Create API User', description: 'Create an Ansible Tower user with API access' },
      { title: 'Generate Token', description: 'Generate an API token for authentication' },
      { title: 'Configure Projects', description: 'Setup security scanning for projects' }
    ],
    config: {
      fields: [
        { name: 'towerUrl', type: 'text', label: 'Ansible Tower URL', required: true },
        { name: 'username', type: 'text', label: 'Username', required: true },
        { name: 'password', type: 'password', label: 'Password', required: true }
      ]
    }
  },

  // Monitoring & Observability
  datadog: {
    name: 'Datadog',
    category: 'monitoring',
    icon: Monitor,
    description: 'Datadog security monitoring and alerting integration',
    features: ['Security monitoring', 'Log analysis', 'APM security', 'Compliance dashboards'],
    status: 'available',
    setupSteps: [
      { title: 'Create API Key', description: 'Generate Datadog API and Application keys' },
      { title: 'Configure Security Rules', description: 'Setup security monitoring rules' },
      { title: 'Create Dashboards', description: 'Build security dashboards and alerts' }
    ],
    config: {
      fields: [
        { name: 'apiKey', type: 'password', label: 'API Key', required: true },
        { name: 'appKey', type: 'password', label: 'Application Key', required: true },
        { name: 'site', type: 'select', label: 'Datadog Site', options: ['datadoghq.com', 'datadoghq.eu', 'us3.datadoghq.com'], required: true }
      ]
    }
  },

  newrelic: {
    name: 'New Relic',
    category: 'monitoring',
    icon: Monitor,
    description: 'New Relic security monitoring and performance insights',
    features: ['Security insights', 'Vulnerability detection', 'Performance monitoring', 'Alert management'],
    status: 'available',
    setupSteps: [
      { title: 'Generate API Key', description: 'Create New Relic API key with appropriate permissions' },
      { title: 'Configure Alerts', description: 'Setup security-related alert conditions' },
      { title: 'Create Dashboards', description: 'Build security monitoring dashboards' }
    ],
    config: {
      fields: [
        { name: 'apiKey', type: 'password', label: 'API Key', required: true },
        { name: 'accountId', type: 'text', label: 'Account ID', required: true },
        { name: 'region', type: 'select', label: 'Region', options: ['US', 'EU'], required: true }
      ]
    }
  },

  // Security-Specific Tools
  snyk: {
    name: 'Snyk',
    category: 'devops',
    icon: Shield,
    description: 'Snyk vulnerability scanning integration',
    features: ['Dependency scanning', 'Container scanning', 'IaC scanning', 'License compliance'],
    status: 'available',
    setupSteps: [
      { title: 'Generate Service Account Token', description: 'Create Snyk service account token' },
      { title: 'Configure Organizations', description: 'Setup organization access and permissions' },
      { title: 'Enable Integrations', description: 'Connect with your repositories and CI/CD' }
    ],
    config: {
      fields: [
        { name: 'token', type: 'password', label: 'Service Account Token', required: true },
        { name: 'orgId', type: 'text', label: 'Organization ID', required: true }
      ]
    }
  },

  sonarqube: {
    name: 'SonarQube',
    category: 'devops',
    icon: FileCode,
    description: 'SonarQube code quality and security analysis integration',
    features: ['Code security scanning', 'Quality gates', 'Security hotspots', 'Compliance reporting'],
    status: 'available',
    setupSteps: [
      { title: 'Generate User Token', description: 'Create SonarQube user token for API access' },
      { title: 'Configure Quality Gates', description: 'Setup security-focused quality gates' },
      { title: 'Enable Webhooks', description: 'Configure webhooks for real-time notifications' }
    ],
    config: {
      fields: [
        { name: 'serverUrl', type: 'text', label: 'SonarQube Server URL', required: true },
        { name: 'token', type: 'password', label: 'User Token', required: true },
        { name: 'projectKey', type: 'text', label: 'Project Key', required: false }
      ]
    }
  }
};

// Helper function to get integrations by category
export const getIntegrationsByCategory = (category) => {
  return Object.entries(INTEGRATIONS_CONFIG)
    .filter(([_, config]) => category === 'all' || config.category === category)
    .map(([key, config]) => ({ key, ...config }));
};

// Helper function to get all categories
export const getCategories = () => {
  const categories = new Set();
  Object.values(INTEGRATIONS_CONFIG).forEach(config => {
    categories.add(config.category);
  });
  return Array.from(categories);
};
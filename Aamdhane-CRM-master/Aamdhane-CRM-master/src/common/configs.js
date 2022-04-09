const config = {
  baseUrl: 'http://sqlapi.aamdhane.com',
};

const defaultPermissions = {
  download: [false, false, false, false],
  agents: [false, false, false, false],
  labourers: [false, false, false, false],
  factoryOwners: [false, false, false, false],
  jobApplications: [false, false, false, false],
  jobPosts: [false, false, false, false],
  notification: [false, false, false, false],
  adminAccess: [false, false, false, false],
};

export { config, defaultPermissions };

// Mock data for Network Configurations
const mockConfigurations = [
  {
    id: 1,
    name: 'LTE Urban Configuration',
    description: 'Default configuration for urban LTE deployments',
    version: '1.2.0',
    lastUpdated: '2023-09-14T10:30:00Z',
    author: 'admin@example.com',
    applicableDevices: ['eNodeB', 'MME', 'SGW'],
    tags: ['LTE', 'Urban', 'High Capacity'],
    status: 'Active'
  },
  {
    id: 2,
    name: 'LTE Rural Configuration',
    description: 'Optimized configuration for rural LTE deployments with extended coverage',
    version: '1.1.0',
    lastUpdated: '2023-09-12T14:45:00Z',
    author: 'engineer@example.com',
    applicableDevices: ['eNodeB', 'MME', 'SGW'],
    tags: ['LTE', 'Rural', 'Extended Coverage'],
    status: 'Active'
  },
  {
    id: 3,
    name: '5G NSA Configuration',
    description: 'Non-Standalone 5G configuration working with existing LTE infrastructure',
    version: '2.0.1',
    lastUpdated: '2023-09-10T09:15:00Z',
    author: 'admin@example.com',
    applicableDevices: ['eNodeB', 'gNodeB', 'MME', 'SGW'],
    tags: ['5G', 'NSA', 'High Throughput'],
    status: 'Active'
  },
  {
    id: 4,
    name: '5G SA Configuration',
    description: 'Standalone 5G configuration for new deployments',
    version: '1.0.0',
    lastUpdated: '2023-09-08T16:20:00Z',
    author: 'engineer@example.com',
    applicableDevices: ['gNodeB', 'AMF', 'UPF'],
    tags: ['5G', 'SA', 'Low Latency'],
    status: 'Draft'
  },
  {
    id: 5,
    name: 'LTE Small Cell Configuration',
    description: 'Configuration for small cell LTE deployments in dense urban areas',
    version: '1.3.0',
    lastUpdated: '2023-09-06T11:10:00Z',
    author: 'admin@example.com',
    applicableDevices: ['eNodeB', 'MME', 'SGW'],
    tags: ['LTE', 'Small Cell', 'Dense Urban'],
    status: 'Active'
  },
  {
    id: 6,
    name: 'mmWave 5G Configuration',
    description: 'High-frequency mmWave 5G configuration for ultra-high bandwidth',
    version: '0.9.0',
    lastUpdated: '2023-09-04T13:40:00Z',
    author: 'engineer@example.com',
    applicableDevices: ['gNodeB', 'AMF', 'UPF'],
    tags: ['5G', 'mmWave', 'High Bandwidth'],
    status: 'Testing'
  },
  {
    id: 7,
    name: 'Indoor Enterprise Configuration',
    description: 'Configuration for indoor enterprise deployments with seamless coverage',
    version: '1.1.2',
    lastUpdated: '2023-09-02T15:25:00Z',
    author: 'admin@example.com',
    applicableDevices: ['eNodeB', 'MME', 'SGW'],
    tags: ['LTE', 'Indoor', 'Enterprise'],
    status: 'Active'
  }
];

/**
 * API endpoint for fetching network configurations
 * 
 * @param {object} req - Next.js API request object
 * @param {object} res - Next.js API response object
 */
export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Extract query parameters for filtering
  const { status, tag, device, author, search } = req.query;
  
  // Filter configurations based on query parameters
  let filteredConfigs = [...mockConfigurations];
  
  if (status) {
    filteredConfigs = filteredConfigs.filter(
      config => config.status.toLowerCase() === status.toLowerCase()
    );
  }
  
  if (tag) {
    filteredConfigs = filteredConfigs.filter(
      config => config.tags.some(configTag => 
        configTag.toLowerCase() === tag.toLowerCase())
    );
  }
  
  if (device) {
    filteredConfigs = filteredConfigs.filter(
      config => config.applicableDevices.some(configDevice => 
        configDevice.toLowerCase() === device.toLowerCase())
    );
  }
  
  if (author) {
    filteredConfigs = filteredConfigs.filter(
      config => config.author.toLowerCase() === author.toLowerCase()
    );
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredConfigs = filteredConfigs.filter(
      config => 
        config.name.toLowerCase().includes(searchLower) || 
        config.description.toLowerCase().includes(searchLower) ||
        config.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  // Add artificial delay to simulate network latency
  setTimeout(() => {
    // Return the filtered configurations
    res.status(200).json(filteredConfigs);
  }, 500);
} 
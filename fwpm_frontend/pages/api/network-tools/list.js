// Mock data for Network Tools
const mockToolsData = [
  {
    id: 1,
    name: 'Ping',
    description: 'Test connectivity to a network device',
    category: 'Diagnostics',
    icon: 'NetworkCheck',
    lastUsed: '2023-09-15T10:30:00Z',
    requiresAuthentication: true
  },
  {
    id: 2,
    name: 'Traceroute',
    description: 'Display the route and transit delays of packets',
    category: 'Diagnostics',
    icon: 'RouteOutlined',
    lastUsed: '2023-09-14T14:45:00Z',
    requiresAuthentication: true
  },
  {
    id: 3,
    name: 'DNS Lookup',
    description: 'Look up DNS records for a domain',
    category: 'Domain',
    icon: 'DnsOutlined',
    lastUsed: '2023-09-10T09:15:00Z',
    requiresAuthentication: false
  },
  {
    id: 4,
    name: 'Port Scanner',
    description: 'Scan for open ports on a network host',
    category: 'Security',
    icon: 'SecurityOutlined',
    lastUsed: '2023-09-05T16:20:00Z',
    requiresAuthentication: true
  },
  {
    id: 5,
    name: 'Bandwidth Test',
    description: 'Measure network bandwidth between two points',
    category: 'Performance',
    icon: 'SpeedOutlined',
    lastUsed: '2023-09-08T11:10:00Z',
    requiresAuthentication: false
  },
  {
    id: 6,
    name: 'HTTP Headers',
    description: 'View HTTP headers of a web resource',
    category: 'Web',
    icon: 'CodeOutlined',
    lastUsed: '2023-09-12T13:40:00Z',
    requiresAuthentication: false
  },
  {
    id: 7,
    name: 'IP Geolocation',
    description: 'Find geographical location of an IP address',
    category: 'Geography',
    icon: 'LocationOnOutlined',
    lastUsed: '2023-09-11T15:25:00Z',
    requiresAuthentication: false
  },
  {
    id: 8,
    name: 'Subnet Calculator',
    description: 'Calculate subnet masks and address ranges',
    category: 'IP',
    icon: 'CalculateOutlined',
    lastUsed: '2023-09-09T10:05:00Z',
    requiresAuthentication: false
  }
];

/**
 * API endpoint for fetching network tools
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
  const { category, requiresAuthentication, search } = req.query;
  
  // Filter tools based on query parameters
  let filteredTools = [...mockToolsData];
  
  if (category) {
    filteredTools = filteredTools.filter(
      tool => tool.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (requiresAuthentication !== undefined) {
    const requiresAuth = requiresAuthentication === 'true';
    filteredTools = filteredTools.filter(
      tool => tool.requiresAuthentication === requiresAuth
    );
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredTools = filteredTools.filter(
      tool => 
        tool.name.toLowerCase().includes(searchLower) || 
        tool.description.toLowerCase().includes(searchLower) ||
        tool.category.toLowerCase().includes(searchLower)
    );
  }
  
  // Add artificial delay to simulate network latency
  setTimeout(() => {
    // Return the filtered tools
    res.status(200).json(filteredTools);
  }, 500);
} 
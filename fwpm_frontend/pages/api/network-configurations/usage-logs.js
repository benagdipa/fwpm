// Mock data for Network Configuration Change History
const mockUsageLogs = [
  {
    id: 'log-001',
    timestamp: '2023-09-15T08:30:00Z',
    user: 'admin@example.com',
    action: 'Create Configuration',
    configId: '1',
    configName: 'LTE Urban Configuration',
    details: 'Created new network configuration for urban LTE deployments with high capacity optimization'
  },
  {
    id: 'log-002',
    timestamp: '2023-09-15T09:45:00Z',
    user: 'engineer@example.com',
    action: 'Update Parameter',
    configId: '1',
    configName: 'LTE Urban Configuration',
    details: 'Modified TransmitPower parameter from 40dBm to 43dBm for better coverage'
  },
  {
    id: 'log-003',
    timestamp: '2023-09-14T14:20:00Z',
    user: 'engineer@example.com',
    action: 'Create Configuration',
    configId: '2',
    configName: 'LTE Rural Configuration',
    details: 'Created new network configuration optimized for rural deployments with extended coverage'
  },
  {
    id: 'log-004',
    timestamp: '2023-09-14T16:35:00Z',
    user: 'admin@example.com',
    action: 'Update Parameter',
    configId: '2',
    configName: 'LTE Rural Configuration',
    details: 'Modified AntennaGain parameter to improve rural coverage'
  },
  {
    id: 'log-005',
    timestamp: '2023-09-13T11:10:00Z',
    user: 'admin@example.com',
    action: 'Create Configuration',
    configId: '3',
    configName: '5G NSA Configuration',
    details: 'Created new 5G Non-Standalone configuration for integration with existing LTE infrastructure'
  },
  {
    id: 'log-006',
    timestamp: '2023-09-13T13:25:00Z',
    user: 'engineer@example.com',
    action: 'Update Parameter',
    configId: '3',
    configName: '5G NSA Configuration',
    details: 'Modified DualConnectivity and SplitBearerThreshold parameters for optimal performance'
  },
  {
    id: 'log-007',
    timestamp: '2023-09-12T09:40:00Z',
    user: 'engineer@example.com',
    action: 'Create Configuration',
    configId: '4',
    configName: '5G SA Configuration',
    details: 'Created new 5G Standalone configuration for greenfield deployments'
  },
  {
    id: 'log-008',
    timestamp: '2023-09-11T15:55:00Z',
    user: 'admin@example.com',
    action: 'Create Configuration',
    configId: '5',
    configName: 'LTE Small Cell Configuration',
    details: 'Created new small cell configuration for dense urban areas'
  },
  {
    id: 'log-009',
    timestamp: '2023-09-15T10:15:00Z',
    user: 'system',
    action: 'Validate Configuration',
    configId: '1',
    configName: 'LTE Urban Configuration',
    details: 'Automated validation passed for all parameters'
  },
  {
    id: 'log-010',
    timestamp: '2023-09-14T17:05:00Z',
    user: 'system',
    action: 'Validate Configuration',
    configId: '2',
    configName: 'LTE Rural Configuration',
    details: 'Automated validation passed with 2 warnings'
  },
  {
    id: 'log-011',
    timestamp: '2023-09-16T08:30:00Z',
    user: 'admin@example.com',
    action: 'Delete Parameter',
    configId: '5',
    configName: 'LTE Small Cell Configuration',
    details: 'Removed obsolete parameter AccessControlList from configuration'
  },
  {
    id: 'log-012',
    timestamp: '2023-09-16T09:45:00Z',
    user: 'engineer@example.com',
    action: 'Update Configuration',
    configId: '4',
    configName: '5G SA Configuration',
    details: 'Updated configuration metadata: tags, description, and applicable devices'
  }
];

/**
 * API endpoint for fetching network configuration usage logs
 * 
 * @param {object} req - Next.js API request object
 * @param {object} res - Next.js API response object
 */
export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Extract query parameters
  const { configId, user, action, startDate, endDate } = req.query;
  
  // Filter usage logs based on query parameters
  let filteredLogs = [...mockUsageLogs];
  
  if (configId) {
    filteredLogs = filteredLogs.filter(
      log => log.configId === configId
    );
  }
  
  if (user) {
    filteredLogs = filteredLogs.filter(
      log => log.user.toLowerCase().includes(user.toLowerCase())
    );
  }
  
  if (action) {
    filteredLogs = filteredLogs.filter(
      log => log.action.toLowerCase().includes(action.toLowerCase())
    );
  }
  
  if (startDate) {
    const start = new Date(startDate);
    filteredLogs = filteredLogs.filter(
      log => new Date(log.timestamp) >= start
    );
  }
  
  if (endDate) {
    const end = new Date(endDate);
    filteredLogs = filteredLogs.filter(
      log => new Date(log.timestamp) <= end
    );
  }
  
  // Add artificial delay to simulate network latency
  setTimeout(() => {
    // Return the filtered usage logs
    res.status(200).json(filteredLogs);
  }, 500);
} 
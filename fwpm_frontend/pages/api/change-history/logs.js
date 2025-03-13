// Mock data for Change History Logs
const mockChangeHistoryLogs = [
  {
    id: 1,
    action: 'Parameter Updated',
    user: 'admin@example.com',
    timestamp: '2023-09-15T14:30:00Z',
    details: {
      moClassName: 'RadioNetwork',
      parameterName: 'TransmitPower',
      oldValue: '40',
      newValue: '43',
      device: 'eNodeB_001'
    },
    status: 'success'
  },
  {
    id: 2,
    action: 'Parameter Added',
    user: 'engineer@example.com',
    timestamp: '2023-09-14T11:45:00Z',
    details: {
      moClassName: 'Core',
      parameterName: 'MaxUsers',
      newValue: '5000',
      device: 'RNC_002'
    },
    status: 'success'
  },
  {
    id: 3,
    action: 'Configuration Exported',
    user: 'admin@example.com',
    timestamp: '2023-09-13T16:20:00Z',
    details: {
      format: 'CSV',
      configCount: 124,
      filters: {
        moClassName: 'RadioNetwork'
      }
    },
    status: 'success'
  },
  {
    id: 4,
    action: 'Parameter Updated',
    user: 'operator@example.com',
    timestamp: '2023-09-12T09:15:00Z',
    details: {
      moClassName: 'RadioNetwork',
      parameterName: 'AntennaGain',
      oldValue: '15',
      newValue: '17',
      device: 'eNodeB_003'
    },
    status: 'failed',
    errorMessage: 'Permission denied'
  },
  {
    id: 5,
    action: 'Configuration Imported',
    user: 'admin@example.com',
    timestamp: '2023-09-11T13:10:00Z',
    details: {
      format: 'XML',
      configCount: 56,
      newConfigs: 12,
      updatedConfigs: 44
    },
    status: 'success'
  },
  {
    id: 6,
    action: 'Parameter Deleted',
    user: 'engineer@example.com',
    timestamp: '2023-09-10T10:05:00Z',
    details: {
      moClassName: 'Core',
      parameterName: 'IdleTimeout',
      oldValue: '60',
      device: 'MME_001'
    },
    status: 'success'
  },
  {
    id: 7,
    action: 'User Login',
    user: 'admin@example.com',
    timestamp: '2023-09-15T08:00:00Z',
    details: {
      ipAddress: '192.168.1.100',
      browser: 'Chrome 116.0.0',
      os: 'Windows 10'
    },
    status: 'success'
  },
  {
    id: 8,
    action: 'User Login',
    user: 'operator@example.com',
    timestamp: '2023-09-12T08:30:00Z',
    details: {
      ipAddress: '192.168.1.101',
      browser: 'Firefox 117.0.0',
      os: 'macOS 12.5'
    },
    status: 'success'
  }
];

/**
 * API endpoint for fetching change history logs
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
  const { action, user, status, startDate, endDate } = req.query;
  
  // Filter logs based on query parameters
  let filteredLogs = [...mockChangeHistoryLogs];
  
  if (action) {
    filteredLogs = filteredLogs.filter(
      log => log.action.toLowerCase() === action.toLowerCase()
    );
  }
  
  if (user) {
    filteredLogs = filteredLogs.filter(
      log => log.user.toLowerCase().includes(user.toLowerCase())
    );
  }
  
  if (status) {
    filteredLogs = filteredLogs.filter(
      log => log.status.toLowerCase() === status.toLowerCase()
    );
  }
  
  if (startDate) {
    const startDateTime = new Date(startDate).getTime();
    filteredLogs = filteredLogs.filter(
      log => new Date(log.timestamp).getTime() >= startDateTime
    );
  }
  
  if (endDate) {
    const endDateTime = new Date(endDate).getTime();
    filteredLogs = filteredLogs.filter(
      log => new Date(log.timestamp).getTime() <= endDateTime
    );
  }
  
  // Sort logs by timestamp in descending order (most recent first)
  filteredLogs.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Add artificial delay to simulate network latency
  setTimeout(() => {
    // Return the filtered logs
    res.status(200).json(filteredLogs);
  }, 500);
} 
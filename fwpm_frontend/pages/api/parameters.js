// Mock data for Parameters DataGrid
const mockParametersData = [
  { 
    id: 1,
    model: 'eNodeB',
    moClassName: 'RadioNetwork',
    parameterName: 'TransmitPower',
    seq: 1,
    parameterDescription: 'Maximum transmit power for radio interface',
    dataType: 'Integer',
    range: '20-46',
    default: '43',
    multiple: 'No',
    unit: 'dBm',
    resolution: '1',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'RAN',
    change: 'Auto',
    distribution: 'Global',
    dependencies: 'CellType',
    deployment: 'All',
    observations: '',
    precedence: 'Normal'
  },
  { 
    id: 2,
    model: 'eNodeB',
    moClassName: 'RadioNetwork',
    parameterName: 'AntennaGain',
    seq: 2,
    parameterDescription: 'Antenna gain for radio equipment',
    dataType: 'Integer',
    range: '0-30',
    default: '17',
    multiple: 'No',
    unit: 'dBi',
    resolution: '0.1',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'RAN',
    change: 'Manual',
    distribution: 'Site',
    dependencies: 'AntennaType',
    deployment: 'All',
    observations: '',
    precedence: 'Normal'
  },
  { 
    id: 3,
    model: 'MME',
    moClassName: 'Core',
    parameterName: 'ConnectionTimeout',
    seq: 3,
    parameterDescription: 'Timeout period for idle connections',
    dataType: 'Integer',
    range: '10-600',
    default: '30',
    multiple: 'No',
    unit: 'sec',
    resolution: '1',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'Core',
    change: 'Auto',
    distribution: 'Global',
    dependencies: 'NetworkType',
    deployment: 'All',
    observations: '',
    precedence: 'High'
  },
  { 
    id: 4,
    model: 'RNC',
    moClassName: 'Core',
    parameterName: 'MaxUsers',
    seq: 4,
    parameterDescription: 'Maximum number of concurrent users',
    dataType: 'Integer',
    range: '100-10000',
    default: '5000',
    multiple: 'No',
    unit: 'users',
    resolution: '100',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'Core',
    change: 'Manual',
    distribution: 'Site',
    dependencies: 'License',
    deployment: 'All',
    observations: '',
    precedence: 'Normal'
  },
  { 
    id: 5,
    model: 'eNodeB',
    moClassName: 'RadioNetwork',
    parameterName: 'InterferenceThreshold',
    seq: 5,
    parameterDescription: 'Threshold for interference detection',
    dataType: 'Integer',
    range: '-120-(-70)',
    default: '-95',
    multiple: 'No',
    unit: 'dBm',
    resolution: '1',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'RAN',
    change: 'Auto',
    distribution: 'Cell',
    dependencies: 'CellType',
    deployment: 'Urban',
    observations: '',
    precedence: 'Normal'
  },
  { 
    id: 6,
    model: 'gNodeB',
    moClassName: 'RadioNetwork',
    parameterName: 'BeamformingGain',
    seq: 6,
    parameterDescription: 'Additional gain from beamforming',
    dataType: 'Integer',
    range: '0-20',
    default: '10',
    multiple: 'No',
    unit: 'dB',
    resolution: '0.5',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'RAN',
    change: 'Auto',
    distribution: 'Cell',
    dependencies: 'AntennaType',
    deployment: '5G',
    observations: '',
    precedence: 'Normal'
  },
  { 
    id: 7,
    model: 'eNodeB',
    moClassName: 'RadioNetwork',
    parameterName: 'CellReselection',
    seq: 7,
    parameterDescription: 'Cell reselection parameters',
    dataType: 'Enum',
    range: 'Slow/Medium/Fast',
    default: 'Medium',
    multiple: 'No',
    unit: 'N/A',
    resolution: 'N/A',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'RAN',
    change: 'Manual',
    distribution: 'Global',
    dependencies: 'None',
    deployment: 'All',
    observations: '',
    precedence: 'Normal'
  },
];

/**
 * API endpoint for fetching network parameters
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
  const { model, moClassName, system, deployment } = req.query;
  
  // Filter parameters based on query parameters
  let filteredParameters = [...mockParametersData];
  
  if (model) {
    filteredParameters = filteredParameters.filter(
      param => param.model.toLowerCase() === model.toLowerCase()
    );
  }
  
  if (moClassName) {
    filteredParameters = filteredParameters.filter(
      param => param.moClassName.toLowerCase() === moClassName.toLowerCase()
    );
  }
  
  if (system) {
    filteredParameters = filteredParameters.filter(
      param => param.system.toLowerCase() === system.toLowerCase()
    );
  }
  
  if (deployment) {
    filteredParameters = filteredParameters.filter(
      param => param.deployment.toLowerCase().includes(deployment.toLowerCase()) || 
               param.deployment === 'All'
    );
  }
  
  // Add artificial delay to simulate network latency (optional)
  setTimeout(() => {
    // Return the filtered data
    res.status(200).json(filteredParameters);
  }, 600);
} 
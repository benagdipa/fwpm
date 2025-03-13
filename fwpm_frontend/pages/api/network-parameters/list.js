// Mock data for Network Parameters
const mockParameters = [
  {
    id: 'param-001',
    model: 'LTE',
    moClassName: 'RadioNetwork',
    parameterName: 'TransmitPower',
    seq: 1,
    parameterDescription: 'Maximum transmit power for base station radio',
    dataType: 'Integer',
    range: '20 - 46',
    default: '43',
    multiple: false,
    unit: 'dBm',
    resolution: '1',
    read: true,
    restrictions: 'None',
    managed: true,
    persistent: true,
    system: false,
    change: 'Restart Required',
    distribution: 'Normal',
    dependencies: 'None',
    deployment: 'All',
    observations: 'High impact on coverage',
    precedence: 'High'
  },
  {
    id: 'param-002',
    model: 'LTE',
    moClassName: 'RadioNetwork',
    parameterName: 'AntennaGain',
    seq: 2,
    parameterDescription: 'Antenna gain value for the base station antenna',
    dataType: 'Integer',
    range: '0 - 30',
    default: '17',
    multiple: false,
    unit: 'dBi',
    resolution: '0.1',
    read: true,
    restrictions: 'None',
    managed: true,
    persistent: true,
    system: false,
    change: 'Restart Required',
    distribution: 'Normal',
    dependencies: 'None',
    deployment: 'All',
    observations: 'Affects coverage calculations',
    precedence: 'Medium'
  },
  {
    id: 'param-003',
    model: 'LTE',
    moClassName: 'Core',
    parameterName: 'ConnectionTimeout',
    seq: 3,
    parameterDescription: 'Timeout for inactive connections',
    dataType: 'Integer',
    range: '10 - 120',
    default: '30',
    multiple: false,
    unit: 'seconds',
    resolution: '1',
    read: true,
    restrictions: 'None',
    managed: true,
    persistent: true,
    system: false,
    change: 'Immediate',
    distribution: 'Normal',
    dependencies: 'None',
    deployment: 'All',
    observations: 'Affects user experience during congestion',
    precedence: 'Medium'
  },
  {
    id: 'param-004',
    model: 'LTE',
    moClassName: 'RadioNetwork',
    parameterName: 'AccessClass',
    seq: 4,
    parameterDescription: 'Access class barring configuration',
    dataType: 'IntegerList',
    range: '0 - 15',
    default: '0-9',
    multiple: true,
    unit: 'N/A',
    resolution: '1',
    read: true,
    restrictions: 'None',
    managed: true,
    persistent: true,
    system: false,
    change: 'Immediate',
    distribution: 'Normal',
    dependencies: 'None',
    deployment: 'All',
    observations: 'Used for access control',
    precedence: 'High'
  },
  {
    id: 'param-005',
    model: '5G',
    moClassName: 'RadioNetwork',
    parameterName: 'DualConnectivity',
    seq: 5,
    parameterDescription: 'Enable/disable dual connectivity with LTE',
    dataType: 'Boolean',
    range: 'true, false',
    default: 'true',
    multiple: false,
    unit: 'N/A',
    resolution: 'N/A',
    read: true,
    restrictions: 'None',
    managed: true,
    persistent: true,
    system: false,
    change: 'Restart Required',
    distribution: 'Normal',
    dependencies: 'LTE Cell Configuration',
    deployment: 'NSA',
    observations: 'Required for NSA deployments',
    precedence: 'Critical'
  },
  {
    id: 'param-006',
    model: '5G',
    moClassName: 'RadioNetwork',
    parameterName: 'SplitBearerThreshold',
    seq: 6,
    parameterDescription: 'Threshold for activating split bearer in dual connectivity',
    dataType: 'Integer',
    range: '5 - 50',
    default: '10',
    multiple: false,
    unit: 'Mbps',
    resolution: '1',
    read: true,
    restrictions: 'None',
    managed: true,
    persistent: true,
    system: false,
    change: 'Immediate',
    distribution: 'Normal',
    dependencies: 'DualConnectivity',
    deployment: 'NSA',
    observations: 'Affects handover performance',
    precedence: 'Medium'
  },
  {
    id: 'param-007',
    model: '5G',
    moClassName: 'RadioNetwork',
    parameterName: 'BeamformingMode',
    seq: 7,
    parameterDescription: 'Beamforming mode for 5G NR',
    dataType: 'Enum',
    range: 'Static, Dynamic, Hybrid',
    default: 'Dynamic',
    multiple: false,
    unit: 'N/A',
    resolution: 'N/A',
    read: true,
    restrictions: 'None',
    managed: true,
    persistent: true,
    system: false,
    change: 'Restart Required',
    distribution: 'Normal',
    dependencies: 'None',
    deployment: 'FR2',
    observations: 'Critical for mmWave performance',
    precedence: 'High'
  },
  {
    id: 'param-008',
    model: 'LTE',
    moClassName: 'RadioNetwork',
    parameterName: 'CarrierAggregation',
    seq: 8,
    parameterDescription: 'Enable/disable carrier aggregation',
    dataType: 'Boolean',
    range: 'true, false',
    default: 'true',
    multiple: false,
    unit: 'N/A',
    resolution: 'N/A',
    read: true,
    restrictions: 'None',
    managed: true,
    persistent: true,
    system: false,
    change: 'Restart Required',
    distribution: 'Normal',
    dependencies: 'Secondary Carrier Configuration',
    deployment: 'All',
    observations: 'Impacts throughput',
    precedence: 'High'
  },
  {
    id: 'param-009',
    model: 'LTE',
    moClassName: 'Core',
    parameterName: 'SecurityAlgorithm',
    seq: 9,
    parameterDescription: 'Security algorithm for encryption',
    dataType: 'Enum',
    range: 'AES128, AES256, Snowfall',
    default: 'AES128',
    multiple: false,
    unit: 'N/A',
    resolution: 'N/A',
    read: true,
    restrictions: 'Regulatory',
    managed: true,
    persistent: true,
    system: true,
    change: 'Restart Required',
    distribution: 'Normal',
    dependencies: 'None',
    deployment: 'All',
    observations: 'Affects security level and computational load',
    precedence: 'Critical'
  },
  {
    id: 'param-010',
    model: '5G',
    moClassName: 'Core',
    parameterName: 'NetworkSlicing',
    seq: 10,
    parameterDescription: 'Enable/disable network slicing',
    dataType: 'Boolean',
    range: 'true, false',
    default: 'false',
    multiple: false,
    unit: 'N/A',
    resolution: 'N/A',
    read: true,
    restrictions: 'None',
    managed: true,
    persistent: true,
    system: false,
    change: 'Restart Required',
    distribution: 'Normal',
    dependencies: 'Slice Configuration',
    deployment: 'SA',
    observations: 'Required for advanced network services',
    precedence: 'Medium'
  },
  {
    id: 'param-011',
    model: '5G',
    moClassName: 'Core',
    parameterName: 'EdgeComputing',
    seq: 11,
    parameterDescription: 'Enable/disable edge computing support',
    dataType: 'Boolean',
    range: 'true, false',
    default: 'false',
    multiple: false,
    unit: 'N/A',
    resolution: 'N/A',
    read: true,
    restrictions: 'None',
    managed: true,
    persistent: true,
    system: false,
    change: 'Restart Required',
    distribution: 'Normal',
    dependencies: 'MEC Configuration',
    deployment: 'SA',
    observations: 'Required for low latency applications',
    precedence: 'Medium'
  },
  {
    id: 'param-012',
    model: 'Common',
    moClassName: 'System',
    parameterName: 'LogLevel',
    seq: 12,
    parameterDescription: 'System log level',
    dataType: 'Enum',
    range: 'DEBUG, INFO, WARNING, ERROR, CRITICAL',
    default: 'INFO',
    multiple: false,
    unit: 'N/A',
    resolution: 'N/A',
    read: true,
    restrictions: 'None',
    managed: true,
    persistent: false,
    system: true,
    change: 'Immediate',
    distribution: 'Normal',
    dependencies: 'None',
    deployment: 'All',
    observations: 'Affects system performance under high load',
    precedence: 'Low'
  }
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
  
  // Extract query parameters
  const { model, moClassName, parameterName } = req.query;
  
  // Filter parameters based on query parameters
  let filteredParameters = [...mockParameters];
  
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
  
  if (parameterName) {
    filteredParameters = filteredParameters.filter(
      param => param.parameterName.toLowerCase().includes(parameterName.toLowerCase())
    );
  }
  
  // Add artificial delay to simulate network latency
  setTimeout(() => {
    // Return the filtered parameters
    res.status(200).json(filteredParameters);
  }, 500);
} 
// Mock data for NSD Configuration Details
const mockConfigurationDetails = [
  {
    id: 101,
    configId: 1, // Reference to LTE Urban Configuration
    moClassName: 'RadioNetwork',
    parameterName: 'TransmitPower',
    thorView: 'Radio',
    thorName: 'TxPower',
    condition1: 'CellType=Macro',
    condition2: 'Frequency=1800MHz',
    nbnCoValue: '43 dBm',
    comments: 'Maximum power for urban macro cells on 1800MHz'
  },
  {
    id: 102,
    configId: 1, // Reference to LTE Urban Configuration
    moClassName: 'RadioNetwork',
    parameterName: 'AntennaGain',
    thorView: 'Radio',
    thorName: 'AntGain',
    condition1: 'AntennaType=Directional',
    condition2: '',
    nbnCoValue: '17 dBi',
    comments: 'Standard gain for urban directional antennas'
  },
  {
    id: 103,
    configId: 1, // Reference to LTE Urban Configuration
    moClassName: 'Core',
    parameterName: 'ConnectionTimeout',
    thorView: 'System',
    thorName: 'ConnTimeout',
    condition1: '',
    condition2: '',
    nbnCoValue: '30 sec',
    comments: 'Default timeout for urban deployments with high user density'
  },
  {
    id: 104,
    configId: 2, // Reference to LTE Rural Configuration
    moClassName: 'RadioNetwork',
    parameterName: 'TransmitPower',
    thorView: 'Radio',
    thorName: 'TxPower',
    condition1: 'CellType=Macro',
    condition2: 'Frequency=700MHz',
    nbnCoValue: '46 dBm',
    comments: 'Maximum power for rural macro cells on 700MHz for extended coverage'
  },
  {
    id: 105,
    configId: 2, // Reference to LTE Rural Configuration
    moClassName: 'RadioNetwork',
    parameterName: 'AccessClass',
    thorView: 'Radio',
    thorName: 'AccClass',
    condition1: 'CellType=Macro',
    condition2: '',
    nbnCoValue: '0-10',
    comments: 'All access classes allowed for rural coverage'
  },
  {
    id: 106,
    configId: 3, // Reference to 5G NSA Configuration
    moClassName: 'RadioNetwork',
    parameterName: 'DualConnectivity',
    thorView: 'System',
    thorName: 'DualConn',
    condition1: '',
    condition2: '',
    nbnCoValue: 'Enabled',
    comments: 'Enable dual connectivity for NSA deployments'
  },
  {
    id: 107,
    configId: 3, // Reference to 5G NSA Configuration
    moClassName: 'RadioNetwork',
    parameterName: 'SplitBearerThreshold',
    thorView: 'Radio',
    thorName: 'SplitBearer',
    condition1: '',
    condition2: '',
    nbnCoValue: '10 Mbps',
    comments: 'Threshold for split bearer activation in NSA mode'
  },
  {
    id: 108,
    configId: 4, // Reference to 5G SA Configuration
    moClassName: 'RadioNetwork',
    parameterName: 'BeamformingMode',
    thorView: 'Radio',
    thorName: 'BeamMode',
    condition1: 'FrequencyRange=FR2',
    condition2: '',
    nbnCoValue: 'Dynamic',
    comments: 'Dynamic beamforming for mmWave frequencies in SA mode'
  },
  {
    id: 109,
    configId: 5, // Reference to LTE Small Cell Configuration
    moClassName: 'RadioNetwork',
    parameterName: 'TransmitPower',
    thorView: 'Radio',
    thorName: 'TxPower',
    condition1: 'CellType=Small',
    condition2: 'Frequency=2600MHz',
    nbnCoValue: '24 dBm',
    comments: 'Reduced power for small cells in dense urban environments'
  },
  {
    id: 110,
    configId: 6, // Reference to mmWave 5G Configuration
    moClassName: 'RadioNetwork',
    parameterName: 'CarrierAggregation',
    thorView: 'Radio',
    thorName: 'CA',
    condition1: 'FrequencyRange=FR2',
    condition2: '',
    nbnCoValue: '8 Component Carriers',
    comments: 'Maximum carrier aggregation for mmWave to achieve high bandwidth'
  }
];

/**
 * API endpoint for fetching NSD configuration details
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
  const { configId, moClassName, parameterName } = req.query;
  
  // Filter configuration details based on query parameters
  let filteredDetails = [...mockConfigurationDetails];
  
  if (configId) {
    const configIdNum = parseInt(configId, 10);
    filteredDetails = filteredDetails.filter(
      detail => detail.configId === configIdNum
    );
  }
  
  if (moClassName) {
    filteredDetails = filteredDetails.filter(
      detail => detail.moClassName.toLowerCase() === moClassName.toLowerCase()
    );
  }
  
  if (parameterName) {
    filteredDetails = filteredDetails.filter(
      detail => detail.parameterName.toLowerCase().includes(parameterName.toLowerCase())
    );
  }
  
  // Add artificial delay to simulate network latency
  setTimeout(() => {
    // Return the filtered configuration details
    res.status(200).json(filteredDetails);
  }, 500);
} 
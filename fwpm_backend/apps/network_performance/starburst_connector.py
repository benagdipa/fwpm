import os
import pandas as pd
import logging
import trino
from contextlib import contextmanager
import ssl
import certifi
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache
import time
import threading
from django.conf import settings

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Starburst Enterprise config - load from environment variables
STARBURST_CONFIG = {
    "host": os.environ.get('STARBURST_HOST', 'dv.cdl.nbnco.net.au'),
    "port": int(os.environ.get('STARBURST_PORT', 443)),
    "http_scheme": os.environ.get('STARBURST_SCHEME', 'https'),
    "user": os.environ.get('STARBURST_USER', ''),
    "password": os.environ.get('STARBURST_PASSWORD', ''),
    "verify": os.environ.get('STARBURST_VERIFY', 'False').lower() == 'true',
    "catalog": os.environ.get('STARBURST_CATALOG', 'hive')
}

# Connection pool configuration
MAX_POOL_SIZE = int(os.environ.get('STARBURST_MAX_POOL_SIZE', 10))
connection_pool = []
pool_lock = threading.Lock()

class QueryTimeoutError(Exception):
    """Custom exception for query timeout"""
    pass

class ConnectionPoolError(Exception):
    """Custom exception for connection pool errors"""
    pass

class ConnectionError(Exception):
    """Custom exception for connection errors"""
    pass

# Sample dummy data for LTE metrics
DUMMY_LTE_DATA = [
    {
        "metrics_date_local": "2023-06-01 12:00:00",
        "site": "SITE001",
        "eutran_cell_id": "CELL001",
        "Cell Availability": 99.5,
        "Abnormal Release": 0.2,
        "E-RAB Retainability": 99.8,
        "ERAB Establishment Attempts": 150,
        "ERAB Establishment Successes": 148,
        "Avg RRC Conn UE": 45,
        "Avg Active UE DL": 35,
        "Avg Active UE UL": 25,
        "DL Cell Capacity": 85.5,
        "UL Cell Capacity": 75.2,
        "DL Cell Throughput": 65.3,
        "UL Cell Throughput": 45.1,
        "DL UE Throughput": 15.6,
        "UL UE Throughput": 8.2,
        "PDCP Volume DL": 1250.5,
        "PDCP Volume UL": 780.3,
        "DL PRB Usage": 68.4,
        "UL PRB Usage": 55.2,
        "DL 256QAM %": 24.5,
        "DL 64QAM %": 45.2,
        "DL 16QAM %": 22.6,
        "DL QPSK %": 7.7,
        "UL 64QAM %": 20.5,
        "UL 16QAM %": 35.7,
        "UL QPSK %": 43.8,
        "DL Latency": 23.5,
        "SF1 Interference": -105.2,
        "SF2 Interference": -104.8,
        "SF6 Interference": -106.1,
        "SF7 Interference": -105.7,
        "Interference PWR PUSCH": -95.6,
        "Interference PWR PUCCH": -96.3,
        "SINR PUSCH": 20.5,
        "SINR PUCCH": 21.7,
        "CQI Weighted": 9.5,
        "DL Packet Loss": 0.15,
        "UL Packet Loss": 0.12,
        "DL HARQ BLER": 1.2,
        "UL HARQ BLER": 0.9,
        "DL 2CC Configured": 45.5,
        "DL 3CC Configured": 25.3,
        "DL 4CC Configured": 10.2,
        "UL 2CC Configured": 35.8,
        "DL 2CC Scheduled": 40.2,
        "DL 3CC Scheduled": 22.5,
        "DL 4CC Scheduled": 8.7,
        "DL 2CC Activated": 38.4,
        "DL 3CC Activated": 20.1,
        "DL 4CC Activated": 7.5,
        "UL 2CC Scheduled": 30.5,
        "Handover Prep Success Rate (Intra-Freq)": 99.2,
        "Handover Exec Success Rate (Intra-Freq)": 98.7,
        "Handover Prep Success Rate (Inter-Freq)": 97.5,
        "Handover Exec Success Rate (Inter-Freq)": 96.8,
        "MIMO Rank 1 %": 25.5,
        "MIMO Rank 2 %": 45.2,
        "MIMO Rank 3 %": 20.1,
        "MIMO Rank 4 %": 9.2,
        "RACH CFRA Success Rate": 99.3,
        "RACH CBRA Success Rate": 98.7,
        "RACH Msg2 Congestion": 0.3,
        "Scheduled DL UE Activity": 78.4,
        "Scheduled UL UE Activity": 65.7
    }
]

# Sample dummy data for NR metrics
DUMMY_NR_DATA = [
    {
        "metrics_date_local": "2023-06-01 12:00:00",
        "gutran_cell_id": "CELL001",
        "site_name": "SITE001",
        "enodeb_name": "ENODEB001",
        "RRC_Conn_Sum": 250,
        "UE_Ctxt_Setup_Succ": 248,
        "ENDC_Setup_UE_Att": 150,
        "ENDC_Setup_UE_Succ": 148,
        "ENDC_Abnormal_Rel_MENB": 2,
        "MAC_DL_Thp_Max": 850.5,
        "MAC_UL_Thp_Max": 125.3,
        "Max_DL_Active_UE": 45,
        "Max_UL_Active_UE": 35,
        "SINR_PUSCH": 22.5,
        "SINR_PUCCH": 23.1,
        "CQI_Weighted": 10.2,
        "BLER_DL_QPSK": 0.8,
        "BLER_DL_16QAM": 1.2,
        "BLER_DL_64QAM": 1.5,
        "BLER_DL_256QAM": 2.1,
        "BLER_UL_QPSK": 0.7,
        "BLER_UL_16QAM": 1.0,
        "BLER_UL_64QAM": 1.3,
        "BLER_UL_256QAM": 1.8,
        "MCS_UL_Usage_QPSK": 20.5,
        "MCS_UL_Usage_16QAM": 35.2,
        "MCS_UL_Usage_64QAM": 30.1,
        "MCS_UL_Usage_256QAM": 14.2,
        "MCS_DL_Usage_QPSK": 15.3,
        "MCS_DL_Usage_16QAM": 25.4,
        "MCS_DL_Usage_64QAM": 40.2,
        "MCS_DL_Usage_256QAM": 19.1,
        "Intra_SGNB_HO_Succ_Rate": 99.1,
        "Inter_SGNB_HO_Succ_Rate": 98.3,
        "PRB_Util_DL": 72.5,
        "PRB_Util_UL": 65.3,
        "TTI_Util_DL": 80.2,
        "TTI_Util_UL": 75.5,
        "DL_Latency_Non_DRX_QoS_0": 12.3,
        "DL_Latency_DRX_QoS_0": 18.5,
        "DL_Data_Volume": 2250.5,
        "UL_Data_Volume": 850.3,
        "RRC_MSG2_Succ_Rate": 99.2,
        "DL_BLER_QPSK": 0.85,
        "RA_Att_Msg2": 180,
        "RA_Succ_Msg3": 178,
        "Cell_Downtime_Auto": 0.2,
        "Cell_Downtime_Manual": 0.1
    }
]

@contextmanager
def get_connection_from_pool(db_config=None, timeout=30):
    """
    Get a connection from the pool or create a new one if needed
    
    Args:
        db_config (dict): Database configuration
        timeout (int): Connection timeout in seconds
    
    Yields:
        trino.dbapi.Connection: Database connection
    
    Raises:
        ConnectionPoolError: If unable to get a connection
        QueryTimeoutError: If connection times out
    """
    if db_config is None:
        db_config = STARBURST_CONFIG.copy()
    
    conn = None
    start_time = time.time()
    
    try:
        with pool_lock:
            # Try to get an existing connection from the pool
            while len(connection_pool) > 0:
                conn = connection_pool.pop()
                try:
                    # Test if connection is still valid
                    cursor = conn.cursor()
                    cursor.execute("SELECT 1")
                    break
                except Exception:
                    conn.close()
                    conn = None
                
                if time.time() - start_time > timeout:
                    raise QueryTimeoutError("Timeout while waiting for connection")
            
            # Create new connection if none available
            if conn is None:
                # Create SSL context if using https
                if db_config.get('http_scheme') == 'https':
                    ssl_context = ssl.create_default_context(cafile=certifi.where())
                    if not db_config.get('verify', True):
                        ssl_context.check_hostname = False
                        ssl_context.verify_mode = ssl.CERT_NONE
                else:
                    ssl_context = None
                
                conn = trino.dbapi.connect(
                    host=db_config['host'],
                    port=db_config['port'],
                    user=db_config['user'],
                    catalog=db_config['catalog'],
                    http_scheme=db_config.get('http_scheme', 'http'),
                    auth=trino.auth.BasicAuthentication(
                        db_config['user'], 
                        db_config.get('password', '')
                    ),
                    ssl=ssl_context,
                    request_timeout=timeout
                )
        
        yield conn
        
        # Return connection to pool if still valid
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            with pool_lock:
                if len(connection_pool) < MAX_POOL_SIZE:
                    connection_pool.append(conn)
                    conn = None
        except Exception:
            pass
            
    finally:
        if conn:
            try:
                conn.close()
            except Exception:
                pass

@lru_cache(maxsize=128)
def get_query_template(query_type):
    """Cache and return query templates"""
    if query_type == 'LTE':
        return LTE_QUERY
    elif query_type == 'NR':
        return NR_QUERY
    raise ValueError(f"Unknown query type: {query_type}")

def execute_query(query, params=None, db_config=None, timeout=300):
    """
    Execute a query on Starburst Enterprise with enhanced error handling and performance optimizations
    
    Args:
        query (str): SQL query to execute
        params (dict): Query parameters
        db_config (dict): Database configuration
        timeout (int): Query timeout in seconds
    
    Returns:
        pandas.DataFrame: Query results
    
    Raises:
        QueryTimeoutError: If query execution times out
        ValueError: If query parameters are invalid
        ConnectionError: If database connection fails
    """
    if db_config is None:
        db_config = STARBURST_CONFIG.copy()
    
    start_time = time.time()
    logger.info(f"Starting query execution with timeout {timeout}s")
    
    try:
        with get_connection_from_pool(db_config, timeout=30) as conn:
            # Create cursor and execute query with timeout
            cursor = conn.cursor()
            
            # Log query execution start
            logger.info("Executing query with parameters: %s", 
                       {k: v for k, v in (params or {}).items() if not k.lower().startswith('password')})
            
            try:
                cursor.execute(query, params)
            except Exception as e:
                logger.error("Query execution failed: %s", str(e))
                if "Invalid credentials" in str(e):
                    raise ConnectionError("Authentication failed. Please check your credentials.")
                elif "Table not found" in str(e):
                    raise ValueError(f"Table not found: {str(e)}")
                elif "Syntax error" in str(e):
                    raise ValueError(f"SQL syntax error: {str(e)}")
                raise
            
            # Monitor query execution time
            while not cursor.finished:
                if time.time() - start_time > timeout:
                    cursor.cancel()  # Cancel the running query
                    raise QueryTimeoutError(f"Query execution exceeded timeout of {timeout} seconds")
                time.sleep(1)
            
            # Get column names
            if cursor.description is None:
                logger.warning("Query returned no results")
                return pd.DataFrame()
                
            columns = [desc[0] for desc in cursor.description]
            
            # Fetch results in chunks for memory efficiency
            chunk_size = 10000
            results = []
            total_rows = 0
            
            try:
                while True:
                    chunk = cursor.fetchmany(chunk_size)
                    if not chunk:
                        break
                    results.extend(chunk)
                    total_rows += len(chunk)
                    logger.debug(f"Fetched {total_rows} rows so far")
                    
                    # Check if we're still within timeout
                    if time.time() - start_time > timeout:
                        raise QueryTimeoutError(f"Data fetching exceeded timeout of {timeout} seconds")
            except Exception as e:
                logger.error(f"Error fetching results: {str(e)}")
                raise
            
            logger.info(f"Query completed successfully. Total rows: {total_rows}")
            
            # Convert to pandas DataFrame
            df = pd.DataFrame(results, columns=columns)
            
            # Convert metrics_date_local to datetime
            if 'metrics_date_local' in df.columns:
                try:
                    df['metrics_date_local'] = pd.to_datetime(df['metrics_date_local'])
                except Exception as e:
                    logger.warning(f"Failed to convert metrics_date_local to datetime: {str(e)}")
            
            # Optimize memory usage
            try:
                for col in df.select_dtypes(include=['float64']).columns:
                    df[col] = pd.to_numeric(df[col], downcast='float')
                for col in df.select_dtypes(include=['int64']).columns:
                    df[col] = pd.to_numeric(df[col], downcast='integer')
            except Exception as e:
                logger.warning(f"Failed to optimize DataFrame memory usage: {str(e)}")
            
            return df
            
    except QueryTimeoutError as e:
        logger.error("Query timeout: %s", str(e))
        raise
    except ValueError as e:
        logger.error("Invalid query parameters: %s", str(e))
        raise
    except ConnectionError as e:
        logger.error("Connection error: %s", str(e))
        raise
    except Exception as e:
        logger.error("Unexpected error executing query: %s", str(e), exc_info=True)
        raise

# Updated LTE query with proper datetime handling and hierarchical structure
LTE_QUERY = """
    WITH base_metrics AS (
        SELECT 
            metrics_date_local,
            site,
            cell_id,
            AVG(cell_availability) as cell_availability,
            AVG(abnormal_release) as abnormal_release,
            AVG(erab_retainability) as erab_retainability,
            SUM(erab_establishment_attempts) as erab_establishment_attempts,
            SUM(erab_establishment_successes) as erab_establishment_successes,
            AVG(avg_rrc_conn_ue) as avg_rrc_conn_ue,
            AVG(avg_active_ue_dl) as avg_active_ue_dl,
            AVG(avg_active_ue_ul) as avg_active_ue_ul,
            AVG(dl_cell_capacity) as dl_cell_capacity,
            AVG(ul_cell_capacity) as ul_cell_capacity,
            AVG(dl_cell_throughput) as dl_cell_throughput,
            AVG(ul_cell_throughput) as ul_cell_throughput,
            AVG(dl_ue_throughput) as dl_ue_throughput,
            AVG(ul_ue_throughput) as ul_ue_throughput,
            SUM(pdcp_volume_dl) as pdcp_volume_dl,
            SUM(pdcp_volume_ul) as pdcp_volume_ul,
            AVG(dl_prb_usage) as dl_prb_usage,
            AVG(ul_prb_usage) as ul_prb_usage,
            AVG(dl_256qam_ratio) as dl_256qam_ratio,
            AVG(dl_64qam_ratio) as dl_64qam_ratio,
            AVG(dl_16qam_ratio) as dl_16qam_ratio,
            AVG(dl_qpsk_ratio) as dl_qpsk_ratio,
            AVG(ul_64qam_ratio) as ul_64qam_ratio,
            AVG(ul_16qam_ratio) as ul_16qam_ratio,
            AVG(ul_qpsk_ratio) as ul_qpsk_ratio,
            AVG(dl_latency) as dl_latency,
            AVG(sinr_pusch) as sinr_pusch,
            AVG(sinr_pucch) as sinr_pucch,
            AVG(cqi_weighted) as cqi_weighted,
            AVG(dl_packet_loss) as dl_packet_loss,
            AVG(ul_packet_loss) as ul_packet_loss,
            AVG(dl_harq_bler) as dl_harq_bler,
            AVG(ul_harq_bler) as ul_harq_bler,
            AVG(dl_2cc_configured) as dl_2cc_configured,
            AVG(dl_3cc_configured) as dl_3cc_configured,
            AVG(dl_4cc_configured) as dl_4cc_configured,
            AVG(ul_2cc_configured) as ul_2cc_configured,
            AVG(handover_prep_success_rate_intra) as handover_prep_success_rate_intra,
            AVG(handover_exec_success_rate_intra) as handover_exec_success_rate_intra,
            AVG(handover_prep_success_rate_inter) as handover_prep_success_rate_inter,
            AVG(handover_exec_success_rate_inter) as handover_exec_success_rate_inter
        FROM network_performance.lte_metrics
        WHERE metrics_date_local BETWEEN TIMESTAMP %(StartDate)s AND TIMESTAMP %(EndDate)s
        {% if SITE %}
            AND site = %(SITE)s
        {% endif %}
        {% if CELL_ID %}
            AND cell_id = %(CELL_ID)s
        {% endif %}
        GROUP BY metrics_date_local, site, cell_id
    )
    SELECT *
    FROM base_metrics
    ORDER BY metrics_date_local DESC
"""

# NR query template
NR_QUERY = """
SELECT 
    pm.metrics_date_local,
    pm.gutran_cell_id,
    
    -- Accessibility KPIs
    pm.pm_rrc_conn_level_sum_en_dc AS "RRC_Conn_Sum", -- Total RRC connections
    pm.pm_ue_ctxt_setup_succ AS "UE_Ctxt_Setup_Succ", -- UE Context Setup Success

    -- ENDC Setup KPIs
    pm.pm_endc_setup_ue_att AS "ENDC_Setup_UE_Att", -- ENDC Setup Attempt
    pm.pm_endc_setup_ue_succ AS "ENDC_Setup_UE_Succ", -- ENDC Setup Success

    -- Retainability KPIs
    pm.pm_endc_rel_ue_abnormal_menb AS "ENDC_Abnormal_Rel_MENB", -- Abnormal ENDC releases on MENB

    -- Throughput KPIs in Mbps
    (pm.pm_mac_thp_dl_max * 8 / 1000000) AS "MAC_DL_Thp_Max",  -- Maximum Downlink Throughput (MAC Layer) in Mbps
    (pm.pm_mac_thp_ul_max * 8 / 1000000) AS "MAC_UL_Thp_Max",  -- Maximum Uplink Throughput (MAC Layer) in Mbps

    -- Active UEs KPIs
    pm.pm_active_ue_dl_max AS "Max_DL_Active_UE", -- Maximum Active UEs (Downlink)
    pm.pm_active_ue_ul_max AS "Max_UL_Active_UE", -- Maximum Active UEs (Uplink)

    -- Interference KPIs (SINR)
    pm.sinr_pusch AS "SINR_PUSCH",  -- Uplink Signal to Interference Noise Ratio (PUSCH)
    pm.sinr_pucch AS "SINR_PUCCH",  -- Uplink Signal to Interference Noise Ratio (PUCCH)

    -- Quality KPIs (CQI)
    pm.cqi_weighted AS "CQI_Weighted",  -- Weighted Channel Quality Indicator

    -- BLER (Block Error Rate) KPIs
    pm.dl_bler_qpsk AS "BLER_DL_QPSK",  -- Downlink BLER for QPSK
    pm.dl_bler_16qam AS "BLER_DL_16QAM",  -- Downlink BLER for 16QAM
    pm.dl_bler_64qam AS "BLER_DL_64QAM",  -- Downlink BLER for 64QAM
    pm.dl_bler_256qam AS "BLER_DL_256QAM",  -- Downlink BLER for 256QAM
    pm.ul_bler_qpsk AS "BLER_UL_QPSK",  -- Uplink BLER for QPSK
    pm.ul_bler_16qam AS "BLER_UL_16QAM",  -- Uplink BLER for 16QAM
    pm.ul_bler_64qam AS "BLER_UL_64QAM",  -- Uplink BLER for 64QAM
    pm.ul_bler_256qam AS "BLER_UL_256QAM",  -- Uplink BLER for 256QAM

    -- MCS Usage KPIs
    pm.ul_trans_perc_qpsk AS "MCS_UL_Usage_QPSK",  -- Uplink MCS Usage for QPSK
    pm.ul_trans_perc_16qam AS "MCS_UL_Usage_16QAM",  -- Uplink MCS Usage for 16QAM
    pm.ul_trans_perc_64qam AS "MCS_UL_Usage_64QAM",  -- Uplink MCS Usage for 64QAM
    pm.ul_trans_perc_256qam AS "MCS_UL_Usage_256QAM",  -- Uplink MCS Usage for 256QAM
    pm.dl_trans_perc_qpsk AS "MCS_DL_Usage_QPSK",  -- Downlink MCS Usage for QPSK
    pm.dl_trans_perc_16qam AS "MCS_DL_Usage_16QAM",  -- Downlink MCS Usage for 16QAM
    pm.dl_trans_perc_64qam AS "MCS_DL_Usage_64QAM",  -- Downlink MCS Usage for 64QAM
    pm.dl_trans_perc_256qam AS "MCS_DL_Usage_256QAM",  -- Downlink MCS Usage for 256QAM

    -- Mobility KPIs (Handover Success and Failure Rates)
    pm.intra_sgnb_pscell_change_succ_rate AS "Intra_SGNB_HO_Succ_Rate", -- Intra-SGNB handover success rate
    pm.inter_sgnb_pscell_change_succ_rate AS "Inter_SGNB_HO_Succ_Rate", -- Inter-SGNB handover success rate

    -- Utilization and Load KPIs
    pm.prb_util_dl AS "PRB_Util_DL", -- PRB Utilization Downlink
    pm.prb_util_ul AS "PRB_Util_UL", -- PRB Utilization Uplink
    pm.tti_util_dl AS "TTI_Util_DL", -- Time Transmission Interval (DL)
    pm.tti_util_ul AS "TTI_Util_UL", -- Time Transmission Interval (UL)

    -- Latency KPIs
    pm.dl_mac_drb_lat_non_drx_qos_0 AS "DL_Latency_Non_DRX_QoS_0", -- Downlink Latency for Non-DRX QoS 0
    pm.dl_mac_drb_lat_drx_qos_0 AS "DL_Latency_DRX_QoS_0", -- Downlink Latency for DRX QoS 0

    -- Traffic KPIs in MB
    (pm.pm_mac_vol_dl / 1000000) AS "DL_Data_Volume",  -- Total Downlink Data Volume in MB
    (pm.pm_mac_vol_ul / 1000000) AS "UL_Data_Volume",  -- Total Uplink Data Volume in MB

    -- Paging KPIs
    pm.rrc_msg2_succ_rate_gnodeb AS "RRC_MSG2_Succ_Rate", -- Paging Message Success Rate

    -- Additional NR KPIs
    pm.dl_init_bler_qpsk AS "DL_BLER_QPSK", -- Initial Downlink Block Error Rate for QPSK
    pm.pm_radio_ra_cb_att_msg2 AS "RA_Att_Msg2", -- Random Access Attempt (Message 2)
    pm.pm_radio_ra_cb_succ_msg3 AS "RA_Succ_Msg3", -- Random Access Success (Message 3)
    pm.pm_cell_downtime_auto AS "Cell_Downtime_Auto", -- Automatic Cell Downtime
    pm.pm_cell_downtime_man AS "Cell_Downtime_Manual", -- Manual Cell Downtime
    
    appian.site_name,
    appian.enodeb_name

FROM 
    hive.thor_fw.v_wireless_pm_gnodeb_nr_cell_hourly_local pm
LEFT JOIN 
    hive.thor_fw.v_cur_appian_cell_enrichment_all appian
ON 
    appian.nsoc_site_code = SUBSTRING(pm.gutran_cell_id, 1, 15)
WHERE 
    pm.dt >= cast(date_format(current_date - interval '<Parameters.Days>' day, '%Y%m%d') AS integer)
""" 
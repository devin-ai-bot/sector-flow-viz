"""
Sector Data Fetcher
Fetches price and volume data for sector ETFs using yfinance
"""

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

SECTOR_ETFS = ['XLK', 'XLF', 'XLV', 'XLE', 'XLI', 'XLP', 'XLU', 'XLRE', 'XLC', 'XLB', 'SPY']

def fetch_sector_data(start_date=None, end_date=None):
    """Fetch price and volume data for all sector ETFs"""
    if start_date is None:
        start_date = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')
    if end_date is None:
        end_date = datetime.now().strftime('%Y-%m-%d')
    
    print(f"Fetching sector data from {start_date} to {end_date}...")
    
    data = {}
    for symbol in SECTOR_ETFS:
        try:
            ticker = yf.Ticker(symbol)
            df = ticker.history(start=start_date, end=end_date)
            if not df.empty:
                data[symbol] = df
                print(f"  {symbol}: {len(df)} rows")
        except Exception as e:
            print(f"  {symbol}: Error - {e}")
    
    return data

def calculate_money_flow(prices, volumes):
    """Calculate money flow = price * volume"""
    return prices * volumes

def calculate_sector_flows(data):
    """Calculate sector-to-sector money flow"""
    flows = {}
    for symbol, df in data.items():
        df['money_flow'] = df['Close'] * df['Volume']
        df['flow_change'] = df['money_flow'].diff()
        flows[symbol] = df[['Close', 'Volume', 'money_flow', 'flow_change']]
    return flows

if __name__ == '__main__':
    data = fetch_sector_data()
    flows = calculate_sector_flows(data)
    print(f"\nProcessed {len(flows)} sectors")

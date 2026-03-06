/**
 * Sector Data Fetcher
 * Fetches ETF price and volume data using yfinance
 */

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

SECTOR_ETFS = ['XLK', 'XLF', 'XLV', 'XLE', 'XLI', 'XLP', 'XLU', 'XLRE', 'XLC', 'XLB', 'SPY']

def fetch_sector_data(period='1y', interval='1d'):
    """Fetch price and volume data for all sector ETFs"""
    data = {}
    
    for symbol in SECTOR_ETFS:
        print(f"Fetching {symbol}...")
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period, interval=interval)
        
        if df.empty:
            print(f"  No data for {symbol}")
            continue
        
        df = df.reset_index()
        df.columns = [c.lower().replace(' ', '_') for c in df.columns]
        data[symbol] = df
        print(f"  Got {len(df)} rows")
    
    return data

def calculate_money_flow(data):
    """Calculate money flow for each sector"""
    flows = {}
    
    for symbol, df in data.items():
        df = df.copy()
        # Money Flow = Close × Volume
        df['money_flow'] = df['close'] * df['volume']
        # Flow change
        df['flow_change'] = df['money_flow'].diff()
        df['flow_change_pct'] = df['flow_change'].pct_change() * 100
        flows[symbol] = df
    
    return flows

def aggregate_by_period(data, period='week'):
    """Aggregate data by time period"""
    aggregated = {}
    
    for symbol, df in data.items():
        df = df.copy()
        df['date'] = pd.to_datetime(df['date'] if 'date' in df.columns else df.index)
        df = df.set_index('date')
        
        if period == 'day':
            agg = df
        elif period == 'week':
            agg = df.resample('W').agg({
                'open': 'first',
                'high': 'max',
                'low': 'min',
                'close': 'last',
                'volume': 'sum',
                'money_flow': 'sum'
            })
        elif period == 'month':
            agg = df.resample('M').agg({
                'open': 'first',
                'high': 'max',
                'low': 'min',
                'close': 'last',
                'volume': 'sum',
                'money_flow': 'sum'
            })
        elif period == 'quarter':
            agg = df.resample('Q').agg({
                'open': 'first',
                'high': 'max',
                'low': 'min',
                'close': 'last',
                'volume': 'sum',
                'money_flow': 'sum'
            })
        elif period == 'year':
            agg = df.resample('Y').agg({
                'open': 'first',
                'high': 'max',
                'low': 'min',
                'close': 'last',
                'volume': 'sum',
                'money_flow': 'sum'
            })
        
        agg['flow_change'] = agg['money_flow'].diff()
        aggregated[symbol] = agg
    
    return aggregated

if __name__ == "__main__":
    print("Fetching sector data...")
    data = fetch_sector_data(period='2y', interval='1d')
    
    print("\nCalculating money flow...")
    flows = calculate_money_flow(data)
    
    print("\nAggregating by week...")
    weekly = aggregate_by_period(flows, 'week')
    
    print("\nSample output for XLK:")
    print(weekly['XLK'].tail())

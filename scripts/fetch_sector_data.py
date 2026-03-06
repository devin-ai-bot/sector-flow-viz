#!/usr/bin/env python3
"""
Sector ETF Data Fetcher
Fetches real data from yfinance and saves to JSON
Runs daily via GitHub Actions
"""

import json
import os
from datetime import datetime, timedelta
import yfinance as yf

SECTOR_ETFS = {
    'XLK': 'Technology',
    'XLF': 'Financials', 
    'XLV': 'Healthcare',
    'XLE': 'Energy',
    'XLI': 'Industrials',
    'XLP': 'Consumer Staples',
    'XLU': 'Utilities',
    'XLRE': 'Real Estate',
    'XLC': 'Communication',
    'XLB': 'Materials',
    'SPY': 'S&P 500'
}

def fetch_sector_data(period='1mo'):
    """Fetch sector ETF data from yfinance"""
    symbols = list(SECTOR_ETFS.keys())
    data = {}
    
    # Download data for all symbols
    for symbol in symbols:
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)
            
            if len(hist) > 0:
                latest = hist.iloc[-1]
                prev = hist.iloc[-2] if len(hist) > 1 else hist.iloc[-1]
                
                # Calculate metrics
                close = latest['Close']
                volume = latest['Volume']
                change = ((close - prev['Close']) / prev['Close']) * 100
                money_flow = close * volume * (change / 100)
                
                data[symbol] = {
                    'symbol': symbol,
                    'name': SECTOR_ETFS[symbol],
                    'close': round(close, 2),
                    'volume': int(volume),
                    'change': round(change, 2),
                    'moneyFlow': round(money_flow, 0),
                    'returns': hist['Close'].pct_change().fillna(0).round(4).tolist()[-30:]
                }
                
                print(f"✓ {symbol}: ${close:.2f}, {change:+.2f}%")
            else:
                print(f"✗ {symbol}: No data")
                
        except Exception as e:
            print(f"✗ {symbol}: Error - {e}")
    
    return data

def save_data(data):
    """Save data to JSON file"""
    output_dir = 'public/data'
    os.makedirs(output_dir, exist_ok=True)
    
    timestamp = datetime.utcnow().isoformat()
    
    output = {
        'timestamp': timestamp,
        'sectors': data
    }
    
    # Save latest data
    with open(f'{output_dir}/sectors.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n✓ Data saved to {output_dir}/sectors.json")
    return output

if __name__ == '__main__':
    print("Fetching sector ETF data...")
    print("=" * 50)
    
    data = fetch_sector_data(period='1mo')
    save_data(data)
    
    print(f"\nTotal symbols: {len(data)}")

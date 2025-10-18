#!/usr/bin/env python3
"""
Simple strategy generator wrapper.
Reads a textual prompt from stdin and attempts to call Google GenAI (gemini) if
GEMINI_API_KEY is configured. If not available, prints a safe fallback strategy
wrapped between ###CODE_START### and ###CODE_END### so the frontend/backend can
extract it reliably.

The generated code MUST define run_strategy(historical_data: pd.DataFrame) -> list
and include the required fields in each trade.
"""
import os
import sys
import json

PROMPT_STUB = "Please generate a Python trading strategy. The code must define a function named run_strategy(historical_data: pd.DataFrame) -> list. Wrap the code between ###CODE_START### and ###CODE_END###. Only output the code block and nothing else."


def fallback_strategy(prompt_text=''):
    # Include a short sanitized version of the prompt so fallback output varies by prompt
    safe_prompt = (prompt_text or '').strip().replace('\n', ' ')[:200]
    code = '###CODE_START###\n'
    code += '# Fallback-generated strategy\n'
    code += '# Prompt: ' + safe_prompt + '\n'
    code += '''import pandas as pd

def run_strategy(historical_data: pd.DataFrame) -> list:
    """A simple mean-reversion strategy for demonstration.

    Buys when price drops below its 10-bar moving average by 1%, exits after 5 bars.
    """
    trades = []
    if historical_data is None or historical_data.empty:
        return trades

    df = historical_data.copy()
    df['MA10'] = df['close'].rolling(10).mean()
    df['pct_vs_ma'] = (df['close'] - df['MA10']) / df['MA10']

    position = None
    entry_idx = None

    for i in range(len(df)):
        row = df.iloc[i]
        if position is None:
            # Entry: price is 1% below MA10
            if pd.notna(row['MA10']) and row['pct_vs_ma'] < -0.01:
                position = {
                    'Entry Date': row.name.isoformat() if hasattr(row.name, 'isoformat') else str(row.name),
                    'Entry Price': float(row['close']),
                    'Contracts': 1
                }
                entry_idx = i
        else:
            # Exit after 5 bars or if price crosses back above MA10
            if (i - entry_idx) >= 5 or (pd.notna(row['MA10']) and row['close'] > row['MA10']):
                position['Exit Date'] = row.name.isoformat() if hasattr(row.name, 'isoformat') else str(row.name)
                position['Exit Price'] = float(row['close'])
                position['PnL'] = position['Exit Price'] - position['Entry Price']
                position['Bars'] = i - entry_idx
                trades.append(position)
                position = None
                entry_idx = None

    return trades
###CODE_END###'''
    return code


def main():
    prompt_in = ''
    try:
        prompt_in = sys.stdin.read()
    except Exception:
        prompt_in = ''

    prompt = (prompt_in or '') + '\n' + PROMPT_STUB

    # If GEMINI_API_KEY present, attempt to use google genai
    api_key = os.environ.get('GEMINI_API_KEY')
    if api_key:
        try:
            # Lazy import so the script still works if the package isn't installed
            from google import genai
            import traceback, sys

            # Use a model name that's available for this project/account.
            # 'models/gemini-pro-latest' is present in the account's model list.
            client = genai.Client()
            resp = client.models.generate_content(model='models/gemini-pro-latest', contents=prompt)
            text = getattr(resp, 'text', None) or str(resp)
            # Try to find the code markers; if not present, still return the text
            if '###CODE_START###' in text and '###CODE_END###' in text:
                print(text)
                return
            else:
                # Wrap the returned text to be safe
                print('###CODE_START###')
                print(text)
                print('###CODE_END###')
                return
        except Exception as e:
            # Print detailed error to stderr for debugging, then fall back
            try:
                traceback.print_exc(file=sys.stderr)
                print(f"GENAI ERROR: {repr(e)}", file=sys.stderr)
            except Exception:
                pass
            # Fall back to safe template (include prompt)
            print(fallback_strategy(prompt_in))
            return
    else:
        # No API key, return fallback including prompt
        print(fallback_strategy(prompt_in))


if __name__ == '__main__':
    main()

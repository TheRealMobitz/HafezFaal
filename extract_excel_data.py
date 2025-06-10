import pandas as pd
import json

def extract_excel_to_json():
    """Extract data from Faal.xlsx and convert to JSON for embedding"""
    
    excel_file = 'Faal.xlsx'
    
    try:
        # Read all sheets from Excel file
        excel_data = pd.read_excel(excel_file, sheet_name=None)
        
        ghazals_data = []
        quotes_data = []
        
        print(f"Available sheets: {list(excel_data.keys())}")
        
        for sheet_name, df in excel_data.items():
            print(f"\nProcessing sheet: {sheet_name}")
            print(f"Columns: {list(df.columns)}")
            print(f"Rows: {len(df)}")
            
            for index, row in df.iterrows():
                try:
                    # Get data from your specific columns
                    ghazal_id = row.get('شناسه', None)
                    poetry_text = row.get('شعر', None)
                    meaning = row.get('معنی', None)
                    
                    if pd.notna(ghazal_id) and pd.notna(poetry_text):
                        # Clean and format the text
                        poetry_text = str(poetry_text).strip()
                        meaning = str(meaning).strip() if pd.notna(meaning) else ""
                        
                        # Add to ghazals
                        ghazal_data = {
                            'ghazal_number': int(ghazal_id),
                            'persian_text': poetry_text,
                            'english_translation': meaning
                        }
                        ghazals_data.append(ghazal_data)
                        
                        # Also add first line as a quote
                        first_line = poetry_text.split('\n')[0].strip()
                        if first_line:
                            quote_data = {
                                'text': first_line,
                                'author': "حافظ شیرازی",
                                'is_daily_quote': index < 10  # First 10 as daily quotes
                            }
                            quotes_data.append(quote_data)
                            
                except Exception as e:
                    print(f"Error processing row {index}: {e}")
                    continue
        
        # Save to JSON files
        with open('ghazals_data.json', 'w', encoding='utf-8') as f:
            json.dump(ghazals_data, f, ensure_ascii=False, indent=2)
        
        with open('quotes_data.json', 'w', encoding='utf-8') as f:
            json.dump(quotes_data, f, ensure_ascii=False, indent=2)
        
        print(f"\nExtracted {len(ghazals_data)} ghazals and {len(quotes_data)} quotes")
        return ghazals_data, quotes_data
        
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return [], []

if __name__ == "__main__":
    extract_excel_to_json()
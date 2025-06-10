import pandas as pd
import json
import re

def extract_quotes_from_excel():
    """Extract meaningful quotes from Hafez ghazals"""
    
    excel_file = 'Faal.xlsx'
    
    try:
        # Read Excel file
        excel_data = pd.read_excel(excel_file, sheet_name=None)
        
        all_quotes = []
        quote_id = 1
        
        for sheet_name, df in excel_data.items():
            print(f"Processing {sheet_name}...")
            
            for index, row in df.iterrows():
                # Get poetry text
                poetry_text = None
                for col in ['شعر', 'متن', 'text']:
                    if col in df.columns and pd.notna(row.get(col)):
                        poetry_text = str(row.get(col)).strip()
                        break
                
                if poetry_text:
                    # Split into lines
                    lines = [line.strip() for line in poetry_text.split('\n') if line.strip()]
                    
                    for line in lines:
                        # Filter meaningful quotes (longer than 15 characters, contains Persian text)
                        if len(line) > 15 and re.search(r'[\u0600-\u06FF]', line):
                            # Clean the line
                            cleaned_line = re.sub(r'[۰-۹]+[\.\-\s]*', '', line).strip()  # Remove numbers
                            cleaned_line = re.sub(r'^\s*[\-\*\•]\s*', '', cleaned_line)  # Remove bullet points
                            
                            if len(cleaned_line) > 15:
                                quote_data = {
                                    'text': cleaned_line,
                                    'author': "حافظ شیرازی",
                                    'is_daily_quote': quote_id <= 30,  # First 30 as daily quotes
                                }
                                all_quotes.append(quote_data)
                                quote_id += 1
        
        # Remove duplicates
        unique_quotes = []
        seen_texts = set()
        for quote in all_quotes:
            if quote['text'] not in seen_texts:
                seen_texts.add(quote['text'])
                unique_quotes.append(quote)
        
        # Save to file
        with open('extracted_quotes_detailed.json', 'w', encoding='utf-8') as f:
            json.dump(unique_quotes, f, ensure_ascii=False, indent=2)
        
        print(f"Extracted {len(unique_quotes)} unique quotes")
        
        # Show categories
        # categories = {}
        # for quote in unique_quotes:
        #     cat = quote['category']
        #     categories[cat] = categories.get(cat, 0) + 1
        
        # print("Quote categories:")
        # for cat, count in categories.items():
        #     print(f"  {cat}: {count}")
        
        return unique_quotes
        
    except Exception as e:
        print(f"Error: {e}")
        return []

def classify_quote(text):
    """Classify quote by content"""
    text_lower = text.lower()
    
    if any(word in text_lower for word in ['عشق', 'دل', 'جان', 'محبت']):
        return 'عشق و محبت'
    elif any(word in text_lower for word in ['خدا', 'الله', 'رب', 'حق']):
        return 'عرفان و معنویت'
    elif any(word in text_lower for word in ['دنیا', 'زمان', 'روزگار', 'فلک']):
        return 'زندگی و روزگار'
    elif any(word in text_lower for word in ['می', 'ساقی', 'جام', 'شراب']):
        return 'رندی و عیش'
    elif any(word in text_lower for word in ['حکمت', 'عقل', 'دانش', 'آگاه']):
        return 'حکمت و اندرز'
    else:
        return 'متفرقه'

if __name__ == "__main__":
    extract_quotes_from_excel()
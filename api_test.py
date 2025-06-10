#!/usr/bin/env python
"""
Simple API endpoint tester
"""

import requests
import json

def test_api(base_url):
    """Test API endpoints"""
    print(f"Testing API at: {base_url}")
    print("=" * 50)
    
    # Test endpoints
    endpoints = {
        "Health Check": "/api/health/",
        "CSRF Token": "/api/csrf/",
        "Ghazals": "/api/ghazals/",
        "Quotes": "/api/quotes/",
    }
    
    for name, endpoint in endpoints.items():
        try:
            url = f"{base_url}{endpoint}"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                print(f"✅ {name}: Working (200)")
                if endpoint == "/api/ghazals/":
                    data = response.json()
                    print(f"   📊 Found {len(data)} ghazals")
                elif endpoint == "/api/quotes/":
                    data = response.json()
                    print(f"   📊 Found {len(data)} quotes")
            else:
                print(f"❌ {name}: Failed ({response.status_code})")
                
        except requests.exceptions.ConnectionError:
            print(f"❌ {name}: Connection failed - server not running?")
        except requests.exceptions.Timeout:
            print(f"❌ {name}: Timeout")
        except Exception as e:
            print(f"❌ {name}: Error - {str(e)}")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    # Test local development server
    test_api("http://localhost:8000")
    
    # If you have a deployed backend, test it too
    # test_api("https://your-backend-url.vercel.app")
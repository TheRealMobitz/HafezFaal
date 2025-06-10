import requests
import sys
import time
from urllib.parse import urljoin

def test_backend(base_url):
    """Test backend API endpoints"""
    print(f"Testing backend: {base_url}")
    print("=" * 50)
    
    # Test health check first
    try:
        response = requests.get(urljoin(base_url, "/api/health/"), timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health Check: OK - {data}")
        else:
            print(f"❌ Health Check Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health Check Error: {e}")
    
    # Test other endpoints
    endpoints = [
        "/api/csrf/",
        "/api/quote/",
        "/api/quotes/",
        "/api/ghazals/",
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(urljoin(base_url, endpoint), timeout=10)
            if response.status_code == 200:
                print(f"✅ {endpoint}: Working")
            else:
                print(f"❌ {endpoint}: Status {response.status_code}")
        except Exception as e:
            print(f"❌ {endpoint}: Error {e}")

if __name__ == "__main__":
    # Test your deployed backend
    test_backend("https://hafez-faal-backend.vercel.app")
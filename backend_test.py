import requests
import sys
from datetime import datetime
import json

class ThinkFastAPITester:
    def __init__(self, base_url="https://biz-tech-solutions-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {json.dumps(response_data, indent=2)}")
                except:
                    print(f"Response text: {response.text[:200]}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text[:500]}")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test(
            "API Root",
            "GET",
            "api/",
            200
        )

    def test_health_check(self):
        """Test health check endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )

    def test_contact_form_valid(self):
        """Test contact form with valid data"""
        test_data = {
            "name": "Juan Pérez",
            "email": "juan.perez@example.com",
            "message": "Hola, me interesa conocer más sobre sus servicios de desarrollo web. ¿Podrían contactarme?"
        }
        
        return self.run_test(
            "Contact Form - Valid Data",
            "POST",
            "api/contact",
            200,
            data=test_data
        )

    def test_contact_form_missing_fields(self):
        """Test contact form with missing fields"""
        test_data = {
            "name": "Juan",
            "email": "juan@example.com"
            # Missing message field
        }
        
        return self.run_test(
            "Contact Form - Missing Fields",
            "POST",
            "api/contact",
            422,  # Validation error
            data=test_data
        )

    def test_contact_form_invalid_email(self):
        """Test contact form with invalid email"""
        test_data = {
            "name": "Juan Pérez",
            "email": "invalid-email",
            "message": "Test message"
        }
        
        return self.run_test(
            "Contact Form - Invalid Email",
            "POST",
            "api/contact",
            422,  # Validation error
            data=test_data
        )

    def test_contact_form_empty_fields(self):
        """Test contact form with empty fields"""
        test_data = {
            "name": "",
            "email": "",
            "message": ""
        }
        
        return self.run_test(
            "Contact Form - Empty Fields",
            "POST",
            "api/contact",
            422,  # Validation error
            data=test_data
        )

    def test_get_contact_messages(self):
        """Test getting contact messages (admin endpoint)"""
        return self.run_test(
            "Get Contact Messages",
            "GET",
            "api/contact",
            200
        )

def main():
    print("🚀 Starting Think Fast API Tests")
    print("=" * 50)
    
    # Setup
    tester = ThinkFastAPITester()
    
    # Run basic connectivity tests
    print("\n📡 Testing Basic Connectivity...")
    tester.test_api_root()
    tester.test_health_check()
    
    # Test contact form functionality
    print("\n📝 Testing Contact Form...")
    tester.test_contact_form_valid()
    tester.test_contact_form_missing_fields()
    tester.test_contact_form_invalid_email()
    tester.test_contact_form_empty_fields()
    
    # Test admin endpoints
    print("\n👨‍💼 Testing Admin Endpoints...")
    tester.test_get_contact_messages()
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failed in tester.failed_tests:
            print(f"  - {failed.get('test', 'Unknown')}: {failed}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
// Test script for authentication endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/auth';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'user'
};

async function testSignup() {
  console.log('\n=== Testing Signup ===');
  try {
    const response = await fetch(`${BASE_URL}/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    console.log('Signup Response:', response.status, data);
    
    return response.headers.get('set-cookie');
  } catch (error) {
    console.error('Signup Error:', error.message);
  }
}

async function testSignin() {
  console.log('\n=== Testing Signin ===');
  try {
    const response = await fetch(`${BASE_URL}/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    const data = await response.json();
    console.log('Signin Response:', response.status, data);
    
    return response.headers.get('set-cookie');
  } catch (error) {
    console.error('Signin Error:', error.message);
  }
}

async function testSignout(cookie) {
  console.log('\n=== Testing Signout ===');
  try {
    const response = await fetch(`${BASE_URL}/sign-out`, {
      method: 'POST',
      headers: {
        'Cookie': cookie || ''
      }
    });

    const data = await response.json();
    console.log('Signout Response:', response.status, data);
  } catch (error) {
    console.error('Signout Error:', error.message);
  }
}

async function runTests() {
  console.log('Starting Authentication Tests...\n');
  
  // Test signup
  const signupCookie = await testSignup();
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test signin
  const signinCookie = await testSignin();
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test signout
  await testSignout(signinCookie);
  
  console.log('\n=== Tests Complete ===');
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}
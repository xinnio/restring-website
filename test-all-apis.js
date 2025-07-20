const BASE_URL = 'http://localhost:3000';

async function testAPI(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`✅ ${method} ${endpoint}: ${response.status}`);
    return { success: true, data: result, status: response.status };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testAllAPIs() {
  console.log('🧪 Testing All APIs...\n');
  
  // Test GET endpoints
  await testAPI('/api/strings');
  await testAPI('/api/bookings');
  await testAPI('/api/availability');
  
  // Test POST endpoints
  await testAPI('/api/strings', 'POST', {
    name: 'Test String',
    type: 'tennis',
    color: 'White',
    quantity: 5,
    description: 'Test string for API testing'
  });
  
  await testAPI('/api/bookings', 'POST', {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '123-456-7890',
    racketBrand: 'Wilson',
    racketModel: 'Pro Staff',
    stringType: 'Polyester',
    stringBrand: 'Luxilon',
    stringColor: 'Black',
    tension: '55',
    grommetReplacement: false,
    notes: 'Test booking'
  });
  
  // Test seed endpoint
  await testAPI('/api/seed', 'POST', {});
  
  console.log('\n🎉 API Testing Complete!');
}

testAllAPIs().catch(console.error); 
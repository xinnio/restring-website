async function testEmailAPI() {
  console.log('🧪 Testing Email API...\n');

  const testEmail = {
    to: 'markhamrestring@gmail.com',
    subject: 'Test Email from Markham Restring Studio',
    html: `
      <h1>Test Email</h1>
      <p>This is a test email to verify the email functionality is working properly.</p>
      <p>Time: ${new Date().toLocaleString()}</p>
    `,
    text: 'Test Email - This is a test email to verify the email functionality is working properly.'
  };

  try {
    console.log('📧 Sending test email...');
    const response = await fetch('http://localhost:3000/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmail)
    });

    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Body:', JSON.stringify(result, null, 2));

    if (response.ok) {
      if (result.development) {
        console.log('✅ Email API working (Development Mode)');
        console.log('📝 In development, emails are logged but not actually sent');
      } else {
        console.log('✅ Email sent successfully!');
      }
    } else {
      console.log('❌ Email API error:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test with invalid email
async function testInvalidEmail() {
  console.log('\n🧪 Testing with invalid email...\n');

  const invalidEmail = {
    to: 'invalid-email',
    subject: 'Invalid Email Test',
    html: '<p>This should fail</p>',
    text: 'This should fail'
  };

  try {
    const response = await fetch('http://localhost:3000/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidEmail)
    });

    const result = await response.json();
    
    console.log('📊 Invalid Email Response Status:', response.status);
    console.log('📊 Invalid Email Response Body:', JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.log('✅ Invalid email properly rejected');
    } else {
      console.log('❌ Invalid email was not rejected');
    }

  } catch (error) {
    console.error('❌ Invalid email test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testEmailAPI();
  await testInvalidEmail();
  console.log('\n🏁 Email tests completed!');
}

runTests(); 
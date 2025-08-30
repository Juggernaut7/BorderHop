const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path'); // Added missing import for path

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, 'env.local') });

console.log('🧪 Testing BorderHop Backend Connections...\n');

// Test MongoDB Connection
async function testMongoDB() {
  console.log('📊 Testing MongoDB Connection...');
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/borderhop';
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

// Test Circle API Configuration
function testCircleAPI() {
  console.log('\n🔗 Testing Circle API Configuration...');
  
  const apiKey = process.env.CIRCLE_API_KEY;
  const clientKey = process.env.CIRCLE_CLIENT_KEY;
  const environment = process.env.CIRCLE_ENVIRONMENT;
  
  console.log(`Environment: ${environment || 'not set'}`);
  console.log(`API Key: ${apiKey ? '✅ Configured' : '❌ Missing'}`);
  console.log(`Client Key: ${clientKey ? '✅ Configured' : '❌ Missing'}`);
  
  return !!(apiKey && clientKey);
}

// Test Infura Configuration
function testInfura() {
  console.log('\n🌐 Testing Infura Configuration...');
  
  const infuraKey = process.env.INFURA_PROJECT_ID;
  
  console.log(`Infura Project ID: ${infuraKey ? '✅ Configured' : '❌ Missing'}`);
  
  return !!infuraKey;
}

// Main test function
async function runTests() {
  const mongoResult = await testMongoDB();
  const circleResult = testCircleAPI();
  const infuraResult = testInfura();
  
  console.log('\n📋 Test Results:');
  console.log(`MongoDB: ${mongoResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Circle API: ${circleResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Infura: ${infuraResult ? '✅ PASS' : '❌ FAIL'}`);
  
  if (mongoResult && circleResult && infuraResult) {
    console.log('\n🎉 All tests passed! Backend is ready to run.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check your configuration.');
  }
  
  // Close MongoDB connection
  if (mongoResult) {
    await mongoose.disconnect();
  }
}

// Run tests
runTests().catch(console.error); 
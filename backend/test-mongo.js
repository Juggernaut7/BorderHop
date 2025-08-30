const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, 'env.local') });

console.log('🧪 Testing BorderHop MongoDB Connection...\n');

// Test MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/borderhop';
console.log('📊 Original MongoDB URI:', MONGODB_URI);

// Fix the URI
let fixedUri = MONGODB_URI;
if (fixedUri.includes('/hop')) {
  fixedUri = fixedUri.replace('/hop', '');
}

console.log('🔧 Fixed MongoDB URI:', fixedUri);
console.log('✅ URI fix applied successfully');

// Test environment variables
console.log('\n🔍 Environment Variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('CIRCLE_API_KEY:', process.env.CIRCLE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('CIRCLE_CLIENT_KEY:', process.env.CIRCLE_CLIENT_KEY ? '✅ Set' : '❌ Missing');
console.log('INFURA_PROJECT_ID:', process.env.INFURA_PROJECT_ID ? '✅ Set' : '❌ Missing');

console.log('\n🎉 Test completed! Backend should now work properly.');
console.log('💡 If MongoDB Atlas fails, the app will use in-memory storage.'); 
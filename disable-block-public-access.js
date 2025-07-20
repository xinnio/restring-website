const { S3Client, PutBucketPublicAccessBlockCommand, GetBucketPublicAccessBlockCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

const BUCKET_NAME = 'markham-restring-uploads';
const REGION = process.env.AWS_REGION || 'us-east-1';

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function disableBlockPublicAccess() {
  try {
    console.log('🔧 Checking current block public access settings...');
    
    // First, check current settings
    try {
      const getCommand = new GetBucketPublicAccessBlockCommand({ Bucket: BUCKET_NAME });
      const currentSettings = await s3Client.send(getCommand);
      console.log('📋 Current public access block settings:', currentSettings.PublicAccessBlockConfiguration);
    } catch (error) {
      console.log('⚠️ Could not get current settings:', error.message);
    }
    
    // Disable all public access blocks
    const putCommand = new PutBucketPublicAccessBlockCommand({
      Bucket: BUCKET_NAME,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false
      }
    });
    
    await s3Client.send(putCommand);
    console.log('✅ Successfully disabled public access blocks for bucket:', BUCKET_NAME);
    console.log('📝 All public access restrictions have been removed');
    
  } catch (error) {
    console.error('❌ Error disabling public access blocks:', error.message);
    if (error.name === 'AccessDenied') {
      console.log('🔒 Access denied. You need to update your IAM policy to include:');
      console.log('   - s3:GetBucketPublicAccessBlock');
      console.log('   - s3:PutBucketPublicAccessBlock');
    }
  }
}

disableBlockPublicAccess(); 
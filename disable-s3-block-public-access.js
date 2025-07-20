const { S3Client, PutPublicAccessBlockCommand, GetPublicAccessBlockCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'markham-restring-uploads';

async function disableBlockPublicAccess() {
  try {
    console.log('🔧 Disabling S3 bucket block public access settings...');
    
    // Disable all block public access settings
    const putPublicAccessBlockCommand = new PutPublicAccessBlockCommand({
      Bucket: BUCKET_NAME,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false
      }
    });

    await s3Client.send(putPublicAccessBlockCommand);
    console.log('✅ Block public access settings disabled successfully!');
    
    // Verify the settings
    try {
      const getPublicAccessBlockCommand = new GetPublicAccessBlockCommand({
        Bucket: BUCKET_NAME
      });
      const result = await s3Client.send(getPublicAccessBlockCommand);
      console.log('📋 Current public access block settings:', result.PublicAccessBlockConfiguration);
    } catch (error) {
      console.log('⚠️ Could not retrieve current settings:', error.message);
    }

  } catch (error) {
    console.error('❌ Error disabling block public access:', error);
    
    if (error.name === 'AccessDenied') {
      console.log('🔑 You need S3 bucket permissions. Please run this manually in AWS Console:');
      console.log('1. Go to S3 Console → markham-restring-uploads bucket');
      console.log('2. Click "Permissions" tab');
      console.log('3. Click "Block public access (bucket settings)"');
      console.log('4. Click "Edit" and uncheck all 4 options:');
      console.log('   - Block all public access');
      console.log('   - Block public access to buckets and objects granted through new access control lists (ACLs)');
      console.log('   - Block public access to buckets and objects granted through any access control lists (ACLs)');
      console.log('   - Block public access to buckets and objects granted through new public bucket or access point policies');
      console.log('   - Block public access to buckets and objects granted through any public bucket or access point policies');
      console.log('5. Click "Save changes"');
    }
  }
}

disableBlockPublicAccess(); 
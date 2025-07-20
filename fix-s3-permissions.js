const { S3Client, PutBucketPolicyCommand, GetBucketPolicyCommand } = require('@aws-sdk/client-s3');
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

async function fixS3Permissions() {
  try {
    console.log('🔧 Fixing S3 bucket permissions...');
    
    // Create a public read bucket policy
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${BUCKET_NAME}/*`
        }
      ]
    };
    
    const putPolicyCommand = new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy)
    });
    
    await s3Client.send(putPolicyCommand);
    console.log('✅ Successfully set public read bucket policy!');
    console.log('📝 Images should now be publicly accessible');
    console.log('🔗 Test URL format: https://' + BUCKET_NAME + '.s3.' + REGION + '.amazonaws.com/filename.jpg');
    
  } catch (error) {
    console.error('❌ Error setting bucket policy:', error.message);
    if (error.name === 'AccessDenied') {
      console.log('🔒 Access denied. You need to update your IAM policy to include:');
      console.log('   - s3:GetBucketPolicy');
      console.log('   - s3:PutBucketPolicy');
    } else if (error.name === 'NoSuchBucket') {
      console.log('❌ Bucket does not exist. Please create the bucket first.');
    }
  }
}

fixS3Permissions(); 
require('dotenv').config({ path: '.env.local' });
const { S3Client, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'markham-restring-uploads';

async function setupBucketPolicy() {
  try {
    console.log(`Setting up bucket policy for: ${BUCKET_NAME}`);
    
    // Create bucket policy for public read access
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
        },
      ],
    };
    
    const policyCommand = new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy),
    });
    
    await s3Client.send(policyCommand);
    console.log(`✅ Bucket policy set successfully for ${BUCKET_NAME}`);
    console.log(`All objects in the bucket will now be publicly readable`);
    
  } catch (error) {
    console.error(`❌ Error setting bucket policy:`, error.message);
    console.error(`Full error:`, error);
  }
}

setupBucketPolicy().catch(console.error); 
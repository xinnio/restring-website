const { S3Client, PutBucketPolicyCommand, GetBucketPolicyCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'markham-restring-uploads';

async function fixS3Permissions() {
  try {
    console.log('🔧 Fixing S3 bucket permissions for image display...');
    
    // Create a bucket policy that allows public read access
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
    console.log('✅ S3 bucket policy updated successfully!');
    console.log('📸 Images should now be publicly accessible');
    
    // Test the current policy
    try {
      const getPolicyCommand = new GetBucketPolicyCommand({
        Bucket: BUCKET_NAME
      });
      const result = await s3Client.send(getPolicyCommand);
      console.log('📋 Current bucket policy:', result.Policy);
    } catch (error) {
      console.log('⚠️ Could not retrieve current policy:', error.message);
    }

  } catch (error) {
    console.error('❌ Error fixing S3 permissions:', error);
    
    if (error.name === 'AccessDenied') {
      console.log('🔑 You need S3 bucket policy permissions. Please run this manually in AWS Console:');
      console.log('1. Go to S3 Console → markham-restring-uploads bucket');
      console.log('2. Click "Permissions" tab');
      console.log('3. Click "Bucket policy"');
      console.log('4. Add this policy:');
      console.log(JSON.stringify({
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
      }, null, 2));
    }
  }
}

fixS3Permissions(); 
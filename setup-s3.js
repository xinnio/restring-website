require('dotenv').config({ path: '.env.local' });
const { S3Client, CreateBucketCommand, PutBucketCorsCommand, PutPublicAccessBlockCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'markham-restring-uploads';

async function setupS3Bucket() {
  try {
    console.log(`Creating S3 bucket: ${BUCKET_NAME}`);
    console.log(`Using region: ${process.env.AWS_REGION || 'us-east-1'}`);
    console.log(`Access Key ID: ${process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set'}`);
    console.log(`Secret Access Key: ${process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set'}`);
    
    // Create bucket
    const createBucketCommand = new CreateBucketCommand({
      Bucket: BUCKET_NAME,
    });
    
    await s3Client.send(createBucketCommand);
    console.log(`✅ Bucket ${BUCKET_NAME} created successfully`);
    
    // Configure CORS for web access
    const corsCommand = new PutBucketCorsCommand({
      Bucket: BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
            AllowedOrigins: ['*'],
            ExposeHeaders: ['ETag'],
          },
        ],
      },
    });
    
    await s3Client.send(corsCommand);
    console.log(`✅ CORS configured for bucket ${BUCKET_NAME}`);
    
    // Disable public access blocks to allow public read access
    const publicAccessCommand = new PutPublicAccessBlockCommand({
      Bucket: BUCKET_NAME,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false,
      },
    });
    
    await s3Client.send(publicAccessCommand);
    console.log(`✅ Public access blocks disabled for bucket ${BUCKET_NAME}`);
    
    console.log(`\n🎉 S3 bucket setup complete!`);
    console.log(`Bucket URL: https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/`);
    console.log(`\n📝 Note: Objects will be made public when uploaded with ACL: 'public-read'`);
    
  } catch (error) {
    if (error.name === 'BucketAlreadyExists') {
      console.log(`⚠️  Bucket ${BUCKET_NAME} already exists`);
    } else if (error.name === 'BucketAlreadyOwnedByYou') {
      console.log(`⚠️  Bucket ${BUCKET_NAME} already owned by you`);
    } else {
      console.error(`❌ Error creating bucket:`, error.message);
      console.error(`Full error:`, error);
    }
  }
}

setupS3Bucket().catch(console.error); 
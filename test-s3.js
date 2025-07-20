require('dotenv').config({ path: '.env.local' });
const { S3Client, ListBucketsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'markham-restring-uploads';

async function testS3Connection() {
  try {
    console.log('Testing S3 connection...');
    console.log(`Access Key ID: ${process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set'}`);
    console.log(`Secret Access Key: ${process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set'}`);
    console.log(`Region: ${process.env.AWS_REGION || 'us-east-1'}`);
    console.log(`Bucket: ${BUCKET_NAME}`);
    
    // Test listing buckets
    const listCommand = new ListBucketsCommand({});
    const buckets = await s3Client.send(listCommand);
    console.log('✅ Successfully listed buckets:', buckets.Buckets.map(b => b.Name));
    
    // Test uploading a simple file
    const testContent = 'Hello World!';
    const testFileName = 'test-file.txt';
    
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: testFileName,
      Body: testContent,
      ContentType: 'text/plain',
      ACL: 'public-read',
    });
    
    await s3Client.send(uploadCommand);
    console.log(`✅ Successfully uploaded test file: ${testFileName}`);
    
    const testUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${testFileName}`;
    console.log(`Test file URL: ${testUrl}`);
    
  } catch (error) {
    console.error('❌ S3 test failed:', error.message);
    console.error('Full error:', error);
  }
}

testS3Connection().catch(console.error); 
import { NextResponse } from 'next/server';
import * as S3 from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { awsCredentialsProvider } from '@vercel/functions/oidc';

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ROLE_ARN = process.env.AWS_ROLE_ARN;
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || 'markham-restring-uploads';

// Initialize S3 client with OIDC credentials
const s3Client = new S3.S3Client({
  region: AWS_REGION,
  credentials: awsCredentialsProvider({
    roleArn: AWS_ROLE_ARN,
  }),
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `string_${timestamp}_${randomString}.${fileExtension}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to S3
    const uploadCommand = new S3.PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(uploadCommand);

    // Generate a presigned URL for reading the image (valid for 1 week - max allowed)
    const getObjectCommand = new S3.GetObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: fileName,
    });

    const presignedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 604800 }); // 1 week (604800 seconds)
    
    return NextResponse.json({ 
      message: 'Image uploaded successfully',
      url: presignedUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Provide more specific error messages
    if (error.message && error.message.includes('Signature version')) {
      return NextResponse.json({ 
        error: 'Upload failed: Invalid signature configuration',
        details: error.message 
      }, { status: 500 });
    }
    
    if (error.name === 'AccessControlListNotSupported') {
      return NextResponse.json({ 
        error: 'Upload failed: S3 bucket configuration issue',
        details: 'The S3 bucket does not support the requested access control settings'
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Upload failed',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
} 
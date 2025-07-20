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

export async function GET(request, { params }) {
  try {
    const { filename } = params;
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }
    // Generate a presigned URL for reading the image (valid for 1 hour)
    const getObjectCommand = new S3.GetObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: filename,
    });
    const presignedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 }); // 1 hour
    return NextResponse.json({ 
      url: presignedUrl,
      filename: filename
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json({ error: 'Failed to generate image URL' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'markham-restring-uploads';

export async function GET(request, { params }) {
  try {
    const { filename } = await params;
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Generate a presigned URL for reading the image (valid for 1 hour)
    const getObjectCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
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
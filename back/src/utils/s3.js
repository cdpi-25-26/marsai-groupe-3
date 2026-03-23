import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function getS3Client() {
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

function getS3ObjectUrl(objectKey) {
  if (process.env.AWS_PUBLIC_BASE_URL) {
    return `${process.env.AWS_PUBLIC_BASE_URL.replace(/\/$/, "")}/${objectKey}`;
  }

  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  return `https://${bucketName}.s3.${region}.amazonaws.com/${objectKey}`;
}

function isS3Configured() {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID
      && process.env.AWS_SECRET_ACCESS_KEY
      && process.env.AWS_BUCKET_NAME
      && process.env.AWS_REGION,
  );
}

async function uploadBufferToS3({ buffer, mimeType, originalFilename }) {
  const s3Client = getS3Client();
  const folder = process.env.AWS_FOLDER || "videos";
  const safeName = sanitizeFilename(originalFilename || `video-${Date.now()}.bin`);
  const objectKey = `${folder.replace(/\/$/, "")}/${Date.now()}-${safeName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: objectKey,
      Body: buffer,
      ContentType: mimeType || "application/octet-stream",
    }),
  );

  return {
    objectKey,
    fileUrl: getS3ObjectUrl(objectKey),
  };
}

export { isS3Configured, uploadBufferToS3 };
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import crypto from "crypto";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function generateSignature(
  apiSecret: string,
  params: Record<string, string>
): string {
  const stringToSign = Object.entries(params)
    .sort()
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHmac("sha256", apiSecret)
    .update(stringToSign)
    .digest("hex");
}

export async function uploadImage(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Проверяем, что переменная apiSecret не undefined
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
      throw new Error("Cloudinary API secret is missing");
    }

    // Дополнительные параметры для подписи
    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
      folder: "ucafe",
      timestamp: timestamp.toString(),
    };

    const signature = generateSignature(apiSecret, params);

    const uploadPromise = new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ucafe",
          timestamp: timestamp,
          signature: signature, // Подпись
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result?.secure_url || "");
        }
      );

      const readable = new Readable();
      readable._read = () => {}; // _read is required but you can noop it
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });

    return await uploadPromise;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

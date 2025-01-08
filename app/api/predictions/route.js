import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("Missing REPLICATE_API_TOKEN environment variable.");
  }

  const { prompt, image } = await request.json();

  const options = {
    version: "467d062309da518648ba89d226490e02b8ed09b5abc15026e54e31c5a8cd0769",
    input: {
      prompt,
      input_image: image, // Assuming the base64 image is passed as `image`
      num_steps: 45,
      num_outputs: 1,
      guidance_scale: 8,
      negative_prompt:
        "cropped, partial figure, headshot only, bust only, shoulders only, cutoff body, realistic proportions, photorealistic, blurry, distorted features, double head, low quality, grainy, multiple heads, text, watermark",
    },
  };

  const prediction = await replicate.predictions.create(options);

  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 });
  }

  return NextResponse.json(prediction, { status: 201 });
}

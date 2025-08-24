import OpenAI from "openai";
import { NextResponse } from "next/server";

// Function to create a base64 color swatch image
function createColorSwatchBase64(hexColor) {
  return `https://hexcolorserver.replit.app/${hexColor.substring(1)}.png`;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { colors } = await request.json();

    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return NextResponse.json(
        { error: "Colors array is required and must not be empty" },
        { status: 400 }
      );
    }

    if (colors.length > 5) {
      return NextResponse.json(
        { error: "Maximum 5 colors allowed" },
        { status: 400 }
      );
    }

    // Validate hex colors
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    const invalidColors = colors.filter((color) => !hexColorRegex.test(color));

    if (invalidColors.length > 0) {
      return NextResponse.json(
        { error: `Invalid hex colors: ${invalidColors.join(", ")}` },
        { status: 400 }
      );
    }

    // Create base64 color swatches for each color
    const colorSwatches = colors.map((color) => createColorSwatchBase64(color));

    // Create a more precise prompt that references the base64 color swatches
    const colorList = colors.join(", ");
    const systemPrompt = `Create a modern digital artwork using ONLY the exact colors shown in the provided color reference images. Each reference image shows one specific color that must be used precisely.

CRITICAL REQUIREMENTS:
- Use ONLY the ${colors.length} exact colors shown in the color reference images: ${colorList}
- Match the colors EXACTLY as shown in the reference swatches - no variations, approximations, or interpretations
- Each color must be clearly visible and distinct in the final artwork
- NO additional colors, shades, tints, gradients, or color mixing allowed
- The background must use one of the specified reference colors
- The artwork should be modern and digital in style

The color reference images provided show the EXACT colors to use. Do not deviate from these colors in any way. The final result must be a precise composition using only the exact colors from the reference images, with no blending or additional colors introduced.`;

    console.log("Generating image with colors:", colors);
    console.log("Color swatches created:", colorSwatches.length);
    console.log("System prompt:", systemPrompt);

    // Use the latest model with responses.create endpoint
    console.log("Using latest model with responses.create endpoint...");

    // Prepare content array with text and color reference images
    const contentArray = [{ type: "input_text", text: systemPrompt }];

    // Add color swatch images
    colorSwatches.forEach((swatch, index) => {
      contentArray.push({
        type: "input_image",
        image_url: swatch,
      });
    });

    // return arrau of

    console.log("Content array:", contentArray);

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: contentArray,
        },
      ],
      tools: [{ type: "image_generation" }],
    });

    // Process the response
    const imageData = response.output
      .filter((output) => output.type === "image_generation_call")
      .map((output) => output.result);

    console.log(`Found ${imageData.length} image(s) in response`, imageData);
    const output = response.output_text;
    console.log("Output:", output);

    // Generate a unique title based on the colors
    const artTitle = `Harmony ${
      colors.length === 1
        ? "Mono"
        : colors.length === 2
        ? "Duo"
        : colors.length === 3
        ? "Trio"
        : colors.length === 4
        ? "Quartet"
        : "Quintet"
    }`;

    return NextResponse.json({
      success: true,
      imageUrl: `data:image/png;base64,${imageData[0]}`,
      title: artTitle,
      colors,
      prompt: systemPrompt,
      outputText: output,
      modelUsed: "gpt-4.1-mini",
      colorSwatchesProvided: colorSwatches.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);

    if (error.code === "insufficient_quota") {
      return NextResponse.json(
        { error: "OpenAI API quota exceeded. Please check your billing." },
        { status: 429 }
      );
    }

    if (error.code === "invalid_api_key") {
      return NextResponse.json(
        {
          error:
            "Invalid OpenAI API key. Please check your environment variables.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate artwork. Please try again." },
      { status: 500 }
    );
  }
}

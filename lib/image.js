// Utility functions for image processing and downloads

/**
 * Converts a base64 image to JPEG format and triggers download
 * @param base64Image - Base64 data URL of the image
 * @param filename - Desired filename for the download
 * @param quality - JPEG quality (0-1, default 0.9)
 */
export const downloadImageAsJPEG = (base64Image, filename, quality = 0.9) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Canvas context not available");
    return;
  }

  const img = new Image();

  img.onload = () => {
    try {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0);

      // Convert to JPEG blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download =
              filename.endsWith(".jpeg") || filename.endsWith(".jpg")
                ? filename
                : `${filename}.jpeg`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the object URL
            URL.revokeObjectURL(url);
          } else {
            console.error("Failed to create blob from canvas");
          }
        },
        "image/jpeg",
        quality
      );
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  img.onerror = (error) => {
    console.error("Error loading image:", error);
  };

  img.src = base64Image;
};

/**
 * Downloads a base64 image in its original format (PNG or JPEG)
 * @param base64Image - Base64 data URL of the image
 * @param filename - Desired filename for the download (without extension)
 */
export const downloadImage = (base64Image, filename) => {
  try {
    // Determine the format from the data URL
    const isJPEG = base64Image.includes('data:image/jpeg') || base64Image.includes('data:image/jpg');
    const isPNG = base64Image.includes('data:image/png');
    
    let fileExtension = 'png'; // Default to PNG
    if (isJPEG) {
      fileExtension = 'jpeg';
    }
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = filename.includes('.') ? filename : `${filename}.${fileExtension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading image:', error);
  }
};

/**
 * Converts a base64 image to PNG format and triggers download
 * @param base64Image - Base64 data URL of the image
 * @param filename - Desired filename for the download
 */
export const downloadImageAsPNG = (base64Image, filename) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Canvas context not available");
    return;
  }

  const img = new Image();

  img.onload = () => {
    try {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0);

      // Convert to PNG blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download =
              filename.endsWith(".png")
                ? filename
                : `${filename}.png`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the object URL
            URL.revokeObjectURL(url);
          } else {
            console.error("Failed to create blob from canvas");
          }
        },
        "image/png"
      );
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  img.onerror = (error) => {
    console.error("Error loading image:", error);
  };

  img.src = base64Image;
};

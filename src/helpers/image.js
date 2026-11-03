/**
 * Compresses and resizes an uploaded image file on the client side using an HTML5 Canvas.
 * Produces a lightweight Base64 Data URL suitable for avatar profiles.
 *
 * @param {File} file The raw file selected from an input element.
 * @param {number} [maxWidth=400] Maximum bounding width in pixels.
 * @param {number} [maxHeight=400] Maximum bounding height in pixels.
 * @param {number} [quality=0.85] JPEG compression quality factor (0.0 to 1.0).
 * @returns {Promise<string>} Resolves with the optimized Base64 Data URL.
 */
export const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.85) => {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith("image/")) {
            reject(new Error("Selected file must be a valid image"));
            return;
        }

        const reader = new FileReader();

        reader.onload = (readerEvent) => {
            const img = document.createElement("img");

            img.onload = () => {
                let { width, height } = img;

                // Scale down proportionally if larger than maximum bounds
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Unable to initialize canvas context"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL("image/jpeg", quality);
                resolve(dataUrl);
            };

            img.onerror = () => {
                reject(new Error("Failed to decode image data"));
            };

            img.src = readerEvent.target?.result;
        };

        reader.onerror = () => {
            reject(new Error("Failed to read image file"));
        };

        reader.readAsDataURL(file);
    });
};


const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const breakpoints = [
  { width: 320, suffix: "320w" },
  { width: 480, suffix: "480w" },
  { width: 768, suffix: "768w" },
  { width: 1024, suffix: "1024w" },
  { width: 1920, suffix: "1920w" },
];

const cardSizes = [
  { width: 124, suffix: "124w" },
  { width: 248, suffix: "248w" },
];

async function generateResponsiveImages() {
  const imagesDir = path.join(__dirname, "../src/assets/images");

  const files = fs
    .readdirSync(imagesDir)
    .filter((f) => f.match(/slide\d+\.png$/) || f.includes("image 18"));

  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const baseName = path.parse(file).name.replace(/\s+/g, "-");

    for (const size of breakpoints) {
      const outputPath = path.join(imagesDir, `${baseName}-${size.suffix}.png`);

      const metadata = await sharp(inputPath).metadata();
      if (metadata.width >= size.width) {
        await sharp(inputPath)
          .resize(size.width, null, { withoutEnlargement: true })
          .png({ quality: 80, compressionLevel: 9 })
          .toFile(outputPath);
      }
    }

    for (const size of breakpoints) {
      const outputPath = path.join(
        imagesDir,
        `${baseName}-${size.suffix}.webp`,
      );

      const metadata = await sharp(inputPath).metadata();
      if (metadata.width >= size.width) {
        await sharp(inputPath)
          .resize(size.width, null, { withoutEnlargement: true })
          .webp({ quality: 75 })
          .toFile(outputPath);
      }
    }
  }
}

generateResponsiveImages();

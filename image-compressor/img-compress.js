const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// * ===== CONFIGURATION ===== * //
const inputDir = path.join(__dirname, "../img-input");
const outputDir = path.join(__dirname, "../img");

const resizeOptions = {
  enabled: false,
  width: 1200,
};

const formats = [
  { ext: "webp", options: { quality: 80 } },
  // { ext: "jpeg", options: { quality: 80 } },
  // { ext: "png", options: {} },
];

const supportedExtensions = [".jpg", ".jpeg", ".png"];
// * ========================= * //

fs.readdir(inputDir, (err, files) => {
  if (err) return console.error("❌ Error reading input directory:", err);

  files.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    const name = path.basename(file, ext);

    if (!supportedExtensions.includes(ext)) return;

    formats.forEach((format) => {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, `${name}.${format.ext}`);
      const processor = sharp(inputPath);

      // Resize if enabled
      if (resizeOptions.enabled) {
        processor.resize(resizeOptions.width);
      }

      processor
        .toFormat(format.ext, format.options)
        .toFile(outputPath)
        .then(() => {
          console.log(
            `✅ ${file} → ${name}.${format.ext}` +
              (resizeOptions.enabled
                ? ` (resized to ${resizeOptions.width}px)`
                : "")
          );
        })
        .catch((err) => {
          console.error(`❌ Error processing ${file}:`, err);
        });
    });
  });
});

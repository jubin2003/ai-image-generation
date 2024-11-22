import https from "https";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required" });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "downloads", "ai-image.jpg");

    const file = fs.createWriteStream(filePath);

    https.get(imageUrl, (response) => {
      response.pipe(file);

      file.on("finish", () => {
        file.close(() => {
          // Send the file to the client for download
          res.setHeader("Content-Type", "application/octet-stream");
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${path.basename(filePath)}"`
          );
          fs.createReadStream(filePath).pipe(res);
        });
      });
    }).on("error", (err) => {
      fs.unlink(filePath, () => {
        console.error("File download error:", err.message);
        res.status(500).json({ message: "Error downloading the image." });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

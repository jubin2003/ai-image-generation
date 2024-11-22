import axios from 'axios';
import fs from 'fs';
import path from 'path';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get('fileUrl'); // Extract file URL from query parameters

    if (!fileUrl) {
        return new Response(
            JSON.stringify({ error: 'File URL is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Save the file in the public/downloads folder
    const publicFolder = path.join(process.cwd(), 'public');
    const downloadsFolder = path.join(publicFolder, 'downloads');
    const fileName = 'ai_image.jpg';
    const outputPath = path.join(downloadsFolder, fileName);

    try {
        // Ensure the downloads directory exists
        fs.mkdirSync(downloadsFolder, { recursive: true });

        // Make the request to the file URL
        const response = await axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'stream',
        });

        // Create a write stream to save the file locally
        const writer = fs.createWriteStream(outputPath);

        // Pipe the response data to the write stream
        response.data.pipe(writer);

        // Wait for the stream to finish
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Serve the file via a public URL
        const publicUrl = `/downloads/${fileName}`;
        return new Response(
            JSON.stringify({ message: 'File downloaded successfully', fileUrl: publicUrl }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Error downloading file', details: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

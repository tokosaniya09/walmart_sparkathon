import fs from 'fs';
import path from 'path';
import axios from 'axios';

const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));
const imagesDir = './images';
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);

async function downloadImages() {
    for (const product of products) {
        const filepath = path.join(imagesDir, product.filename);
        try {
            const response = await axios.get(product.image_url, {
                responseType: 'stream',
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
                }
            });

            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            console.log(`✅ Downloaded ${product.filename}`);
        } catch (err) {
            console.error(`❌ Failed to download ${product.filename}:`, err.message);
        }
    }
}

downloadImages();

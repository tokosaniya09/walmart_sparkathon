import fs from 'fs';
import path from 'path';
import axios from 'axios';
import pkg from 'pg';
const { Client } = pkg;

const DATABASE_URL = 'postgresql://postgres.gerrwhyvzwjjxhvbrzfs:Toshyn2109WeWillWin@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Supabase SSL
  },
});

const sanitizeFilename = (name, product_id) =>
  `${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${product_id}.jpg`;

const downloadImage = async (url, filepath) => {
  const writer = fs.createWriteStream(filepath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const run = async () => {
  try {
    await client.connect();
    console.log('✅ Connected to Supabase');

    const res = await client.query('SELECT * FROM product');
    const products = res.rows;

    if (!fs.existsSync('./images')) fs.mkdirSync('./images');

    for (const product of products) {
      const filename = sanitizeFilename(product.name || 'product', product.product_id || Date.now());
      const imagePath = path.join('./images', filename);

      try {
        await downloadImage(product.image_url, imagePath);
        product.filename = filename;
        console.log(`✅ Downloaded image: ${filename}`);
      } catch (err) {
        console.error(`❌ Failed to download ${product.image_url}: ${err.message}`);
      }
    }

    fs.writeFileSync('./products.json', JSON.stringify(products, null, 2));
    console.log('📦 Saved products.json with image filenames');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
    console.log('🔌 Disconnected from DB');
  }
};

run();
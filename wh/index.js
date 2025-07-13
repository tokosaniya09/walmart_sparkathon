import weaviate from 'weaviate-ts-client';
import fs from 'fs';
import path from 'path';

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

function toBase64(filePath) {
    try {
        const file = fs.readFileSync(filePath);
        return Buffer.from(file).toString('base64');
    } catch {
        return null; // file not found
    }
}

const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

const schemaConfig = {
    class: 'Product',
    vectorizer: 'img2vec-neural',
    vectorIndexType: 'hnsw',
    moduleConfig: {
        'img2vec-neural': {
            imageFields: ['image']
        }
    },
    properties: [
        { name: 'image', dataType: ['blob'] },
        { name: 'title', dataType: ['string'] },
        { name: 'description', dataType: ['text'] },
        { name: 'category', dataType: ['text'] },
        { name: 'price', dataType: ['number'] },
        { name: 'rating', dataType: ['number'] },
        { name: 'image_url', dataType: ['string'] },
        { name: 'product_id', dataType: ['int'] },
        { name: 'filename', dataType: ['string'] }
    ]
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const run = async () => {
    try {
        await client.schema.classDeleter().withClassName('Product').do();
        console.log('🗑 Old schema deleted');
    } catch {
        console.log('⚠ No previous schema to delete');
    }

    await client.schema.classCreator().withClass(schemaConfig).do();
    console.log('✅ Schema created');

    const failed = [];

    for (const product of products) {
        const imagePath = path.join('./images', product.filename);
        const image = toBase64(imagePath);

        if (!image) {
            console.warn(`⚠️ Skipping: ${product.filename} - image not found`);
            failed.push(product.filename);
            continue;
        }

        try {
            await client.data.creator()
                .withClassName('Product')
                .withProperties({
                    image,
                    title: product.title,
                    description: product.description,
                    category: product.category,
                    price: product.price,
                    rating: product.rating,
                    image_url: product.image_url,
                    product_id: product.id || product.product_id || 0,
                    filename: product.filename
                }).do();

            console.log(`✅ Uploaded: ${product.filename}`);
        } catch (err) {
            console.error(`❌ Failed: ${product.filename} → ${err.message}`);
            failed.push(product.filename);
            await delay(1000); // wait a bit before retrying next
        }
    }

    console.log(`\n📦 Upload complete. Total: ${products.length}`);
    console.log(`✅ Success: ${products.length - failed.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    fs.writeFileSync('./failed-uploads.json', JSON.stringify(failed, null, 2));
};

run();

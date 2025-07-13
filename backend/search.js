import weaviate from 'weaviate-ts-client';
import { readFileSync } from 'fs';

function toBase64(filePath) {
    const file = readFileSync(filePath);
    return Buffer.from(file).toString('base64');
}

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

const runSearch = async () => {
    const testImageB64 = toBase64('./earbuds.jpg');

    try {
        const res = await client.graphql.get()
            .withClassName('Product')
            .withFields([
                'title',
                'description',
                'category',
                'price',
                'rating',
                'image_url',
                '_additional { certainty }'
            ])
            .withNearImage({ image: testImageB64, certainty: 0.9 }) // ✅ Threshold here
            .withLimit(5)
            .do();

        const matches = res.data.Get.Product;
        if (!matches || matches.length === 0) {
            console.log('❌ No matches found above threshold');
            return;
        }

        console.log('\n🔍 Top Matching Products:');
        matches.forEach((product, index) => {
            console.log(`\n${index + 1}. ${product.title}`);
            console.log(`   Description: ${product.description}`);
            console.log(`   Category: ${product.category}`);
            console.log(`   Price: ₹${product.price}`);
            console.log(`   Rating: ${product.rating}`);
            console.log(`   Image URL: ${product.image_url}`);
            console.log(`   Certainty: ${product._additional.certainty.toFixed(3)}`);
        });

    } catch (err) {
        console.error('❌ Search failed:', err);
    }
};

runSearch();

import weaviate from 'weaviate-ts-client';

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080'
});

const run = async () => {
  try {
    const res = await client.graphql.get()
      .withClassName('Product')
      .withFields('filename image_url _additional { id }')
      .withLimit(1000)
      .do();

    const products = res.data.Get.Product;

    if (!products || products.length === 0) {
      console.log('⚠️ No products found in Weaviate.');
    } else {
      console.log(`📦 Total products stored: ${products.length}\n`);

      products.forEach((product, i) => {
        console.log(`${i + 1}. ${product.filename} (${product.image_url})`);
      });
    }
  } catch (err) {
    console.error('❌ Failed to fetch products:', err);
  }
};

run();

// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 const Firestore = require('@google-cloud/firestore');
const {
  dialogflow,
  Image,
  BrowseCarousel,
  BrowseCarouselItem
} = require('actions-on-google');

// Create an app instance
const app = dialogflow();
const db = new Firestore();

app.intent('Default Welcome Intent', (conv) => {
  conv.ask('Welcome to the Soft Serverless Ice Cream Shop. Don\'t waffle, order something already');
});

app.intent('trending', (conv, {}) => {
  conv.close('Every flavor of soft serverless is trending. Get them while they\'re... cold!');
});

app.intent('category.list', async (conv) => {
  console.log('category.list');
  return db.collection('products').get()
    .then((snapshot) => {
      let productLabels = new Set();
      snapshot.forEach((product) => {
        console.log(product.id, '=>', product.data());
        let productData = product.data();
        if (productData.labels) {
          productData.labels.forEach(label => {
            productLabels.add(label);
          });
        }
      });
      let allLabels = Array.from(productLabels).join(', ');
      console.log('Labels found:', allLabels);
      let response = `Types of products available include: `;
      response += allLabels;
      conv.ask(response);
    })
    .catch((err) => {
      console.log('Error querying Firestore', err);
    });
});

function deserialize(dbProduct) {
  console.log('dbProduct', JSON.stringify(dbProduct));
  let product = dbProduct.data();
  product.documentId = dbProduct.ref.id;
  product.productUrl = `https://www.soft-serverless.com/checkout?id=${product.documentId}`;
  return product;
}
app.intent('product.list', async (conv) => {
  let category = conv.parameters.category.toLowerCase();
  if (category.indexOf('ice cream') > 0) {
    category = category.replace('ice cream', '');
  }
  console.log(`Searching for ${category} products`);

  let productsRef = db.collection('products');
  let query = productsRef.where("labels", "array-contains", category);
  let results = await query.get();
  let promoQuery = productsRef.where("promo_label", "==", category);
  let promoResults = await promoQuery.get();
  let products = [];

  results.docs.forEach(dbProduct => {
    products.push(deserialize(dbProduct));
  });
  promoResults.docs.forEach(dbProduct => {
    products.push(deserialize(dbProduct));
  });

  console.log('all-products', JSON.stringify(products));

  // Return a text listing of product name if no visual output.
  let productNames = products.map(p => p.name).join(', ');
  if (products.length == 0) {
    return conv.ask(`Sorry, I couldn't find any ${category} products.`);
  }
  conv.ask(productNames);
  if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
    return;
  }

  let carousel = new BrowseCarousel();
  products.forEach(product => {
    console.log('product.url', product.productUrl);
    carousel.items.push(
      new BrowseCarouselItem({
        title: product.name,
        url: product.productUrl,
        description: product.description,
        image: new Image({
          url: `https://storage.cloud.google.com/soft-serverless-upload-images/${product.image}.png`,
          alt: product.description,
        }),
        footer: 'Item 1 footer',
      })
    );
  });
  // Create a browse carousel.
  conv.ask(carousel);
});

app.intent('Default Fallback Intent', (conv) => {
  conv.ask(`I didn't understand`);
  conv.ask(`I'm sorry, can you try again?`);
});

exports.actionsOnGoogle = app;
 
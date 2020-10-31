const mongoose = require('mongoose');
const Product = require('../models/Product');

const mapProduct = (product) => ({
  id: product._id,
  title: product.title,
  description: product.description,
  price: product.price,
  category: product.category,
  subcategory: product.subcategory,
  images: product.images,
});

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.request.query.query;

  if (!(query && typeof query === 'string' && query.trim())) {
    ctx.response.status = 401;
  }

  const products = await Product.find({$text: {$search: query}});

  if (products) {
    ctx.body = {products: products.map(mapProduct)};
  } else {
    ctx.response.status = 404;
    ctx.body = {products: []};
  }
};

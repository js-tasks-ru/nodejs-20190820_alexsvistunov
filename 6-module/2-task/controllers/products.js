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

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  ctx.productSearchOptions = {};

  if (!ctx.query.subcategory) {
    return next();
  }

  ctx.productSearchOptions.subcategory = ctx.query.subcategory;
  return next();
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find(ctx.productSearchOptions);

  if (!products) {
    ctx.body = {products: []};
  } else {
    ctx.body = {products: products.map(mapProduct)};
  }
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;

  if (!productId) {
    return next();
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    ctx.response.status = 400;
    ctx.body = {message: 'invalid id'};
    return next();
  }

  const product = await Product.findById(productId);

  if (product) {
    ctx.body = {product: mapProduct(product)};
  } else {
    ctx.response.status = 404;
    ctx.body = {message: 'not Found'};
  }
};


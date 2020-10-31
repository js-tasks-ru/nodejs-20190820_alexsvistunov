const Category = require('../models/Category');

const mapSubcategory = (subcategory) => ({
  id: subcategory._id,
  title: subcategory.title,
});

const mapCategory = (category) => ({
  id: category._id,
  title: category.title,
  subcategories: category.subcategories.map(mapSubcategory),
});

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  ctx.body = {categories: categories.map(mapCategory)};
};

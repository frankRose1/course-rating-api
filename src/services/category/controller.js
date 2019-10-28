import mongoose from 'mongoose';
import { HTTP400Error, HTTP404Error } from '../../utils/httpErrors';
import { validateCreateUpdateCategory } from '../../utils/validation';

const Category = mongoose.model('Category');

export const getCategoryList = async (req, res) => {
  let { pageSize, pageNum, searchTerm = null } = req.query;
  pageSize = Number(req.query.pageSize) > 30 ? 30 : Number(req.query.pageSize);
  pageNum = Number(req.query.pageNum) > 0 ? Number(req.query.pageNum) : 1;

  const skip = pageSize * (pageNum - 1);
  const query = {};

  if (searchTerm) {
    query['$text'] = { $search: searchTerm };
  }

  const categories = await Category.find(query)
    .skip(skip)
    .limit(pageSize);

  res.json({ categories });
};

export const getCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const { redis } = req;
  const redisKey = `category:${categoryId}`;

  let category = await redis.getAsync(redisKey);

  if (category) {
    return res.json({ category: JSON.parse(category) });
  } else {
    category = await Category.findById(categoryId);

    if (!category) {
      throw new HTTP404Error('Category not found');
    }

    await redis.setexAsync(redisKey, 1800, JSON.stringify(category));

    res.json({ category });
  }
};

export const createCategory = async (req, res) => {
  const { error, value } = validateCreateUpdateCategory(req.body);

  if (error) {
    throw new HTTP400Error(error.details);
  }

  const existingCategory = await Category.findOne({ name: value.name });

  if (existingCategory) {
    throw new HTTP400Error('Category already exists');
  }

  const category = new Category(value);

  await category.save();

  res.location(`/api/v1/categories/${category._id}`).sendStatus(201);
};

export const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new HTTP404Error('Category not found.');
  }

  const { error, value } = validateCreateUpdateCategory(req.body);

  if (error) {
    throw new HTTP400Error(error.details);
  }

  // if name is being updated make sure its not a duplicate
  const existingCategory = await Category.findOne({
    name: value.name,
    _id: { $ne: category._id }
  });

  if (existingCategory) {
    throw new HTTP400Error('Category already exists.');
  }

  category.set(value);
  await category.save();

  res.location(`/api/v1/categories/${category._id}`).sendStatus(204);
};

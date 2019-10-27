import { Router } from 'express';
import * as CategoryController from '../../services/category/controller';
import auth from '../../middleware/auth';
import admin from '../../middleware/admin';
import isValidMongoID from '../../middleware/isValidMongoID';
import checkPagination from '../../middleware/checkPagination';

const router = Router();

router.get('/', checkPagination, CategoryController.getCategoryList);

router.post('/', auth, admin, CategoryController.createCategory);

router.get('/:id', isValidMongoID, CategoryController.getCategory);

router.put(
  '/:id',
  isValidMongoID,
  auth,
  admin,
  CategoryController.updateCategory
);

// router.delete(
//   '/:id',
//   isValidMongoID,
//   auth,
//   admin,
//   CategoryController.deleteCategory
// );

export default router;

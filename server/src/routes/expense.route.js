import express from "express";
import {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenses,
  getTotalExpense,
  getExpenseByDepartment,
  getExpenseByCategory,
  getExpenseTrend,
  getExpensesByOrganization
} from "../controllers/expense.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createExpense);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);
router.get("/", protect, getExpenses);
router.get("/organization", protect ,  getExpensesByOrganization);

router.get("/analytics/total", protect, getTotalExpense);
router.get("/analytics/by-department", protect, getExpenseByDepartment);
router.get("/analytics/by-category", protect, getExpenseByCategory);
router.get("/analytics/trend", protect, getExpenseTrend);

export default router;
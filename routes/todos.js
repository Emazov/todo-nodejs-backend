import express from 'express';
import {
	addTask,
	deleteTask,
	getAllTasks,
} from '../controllers/todos.js';

const router = express.Router();

router.get('/', getAllTasks);
router.post('/', addTask);
router.delete('/:id', deleteTask);

export default router;

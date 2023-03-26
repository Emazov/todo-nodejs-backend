import { db } from '../db.js';
import jwt from 'jsonwebtoken';

export const getAllTasks = (req, res) => {
	const token = req.cookies.cookie_token;
	jwt.verify(token, 'secretKey', (err, userInfo) => {
		if (err) return res.status(403).json('Token is not valid!');

		const q = 'SELECT * FROM todos WHERE `user_id` = ?';

		db.query(q, [userInfo.id], (err, data) => {
			if (err) return res.json(err);
			return res.json(data);
		});
	});
};

export const addTask = (req, res) => {
	const token = req.cookies.cookie_token;
	if (!token) return res.status(401).json('Not authenticated!');
	jwt.verify(token, 'secretKey', (err, userInfo) => {
		if (err) return res.status(403).json('Token is not valid!');

		const q = 'INSERT INTO todos (`task`, `user_id`, `isDone`) VALUES (?)';

		const values = [req.body.task, userInfo.id, 0];

		db.query(q, [values], (err, data) => {
			if (err) return res.json(err);
			return res.json('task created');
		});
	});
};

export const deleteTask = (req, res) => {
	const id = req.params.id;
	const q = 'DELETE FROM todos WHERE id = ?';

	db.query(q, [id], (err, data) => {
		if (err) return res.json(err);
		return res.json('task deleted');
	});
};

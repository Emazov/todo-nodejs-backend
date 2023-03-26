import { db } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {
	const q = 'SELECT * FROM users WHERE email = ? OR username = ?';

	db.query(q, [req.body.email, req.body.username], (err, data) => {
		if (err) return res.status(500).json(err);

		const username = req.body.username;
		const email = req.body.email;
		const password = req.body.password;

		if (data.length) {
			return (
				res.status(409),
				data.map((el) => {
					if (el.username === username) {
						return res.json('This username is already taken');
					} else if (el.email === email) {
						return res.json('This mail is already taken');
					}
				})
			);
		}

		if (!email.endsWith('alatoo.edu.kg')) {
			return res.status(409).json('Mail should be from AIU');
		}

		if (password.length < 6) {
			return res.status(409).json('Password must be at least 6 characters');
		}

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		const q = 'INSERT INTO users(`username`,`email`,`password`) VALUES (?)';
		const values = [req.body.username, email, hash];

		db.query(q, [values], (err, data) => {
			if (err) return res.json(err);
			return res.json('User has been created.');
		});
	});
};

export const login = (req, res) => {
	const q = 'SELECT * FROM users WHERE username = ?';

	db.query(q, [req.body.username], (err, data) => {
		if (err) return res.status(500).json(err);
		if (!data.length) return res.status(404).json('User not found!');

		const isPasswordCorrect = bcrypt.compareSync(
			req.body.password,
			data[0].password
		);

		if (!isPasswordCorrect)
			return res.status(400).json('Wrong username or password!');

		const token = jwt.sign({ id: data[0].id }, 'secretKey');
		const { password, ...withoutPassword } = data[0];

		res
			.cookie('cookie_token', token, {
				httpOnly: true,
			})
			.status(200)
			.json(withoutPassword);
	});
};

export const logout = (req, res) => {
	res
		.clearCookie('cookie_token', {
			sameSite: 'none',
			secure: true,
		})
		.status(200)
		.json('User has been logged out.');
};

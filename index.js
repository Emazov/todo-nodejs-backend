import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import todosRoutes from './routes/todos.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todosRoutes);
app.get('/api/check-vercel', (req, res) => {
	res.send('It is working')
})

app.listen(8181, () => {
	console.log(`Server OK || 8181`);
});

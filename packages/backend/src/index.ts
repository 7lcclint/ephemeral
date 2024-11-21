import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import argon2 from 'argon2';

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3456;

app.use(cors({
  origin: '*',
  methods: ['GET','POST'],
  allowedHeaders: ['Content-Type'],
}));

const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  schema: process.env.schema,
  database: process.env.database,
  password: process.env.password,
  port: process.env.db_port,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express server!');
});

app.get('/getUsers', async (req: Request, res: Response) => {
  try {
    const query = 'SELECT user_id, email, first_name, last_name FROM users'; 
    const result = await pool.query(query);
    res.status(200).json(result.rows); 
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const query = 'SELECT user_id, email, password FROM users WHERE email = $1';
    const values = [email];
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const user = result.rows[0];
    const isPasswordValid = await argon2.verify(user.password, password);

    if (isPasswordValid) {
      res.status(200).json({ message: 'Login successful', userId: user.user_id, email: user.email });
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Login failed' });
  }
  
});

app.post('/register', async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await argon2.hash(password);

    const query = `
      INSERT INTO users (email, password, first_name, last_name)
      VALUES ($1, $2, $3, $4) RETURNING user_id;
    `;
    const values = [ email, hashedPassword, firstName, lastName];
    
    const result = await pool.query(query, values);
    const userId = result.rows[0].user_id;

    res.status(201).json({ message: 'User registered successfully!', userId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

(async () => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    const date = new Date(rows[0].now);

    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric', 
      hour12: true 
    };

    const formattedDate = `${date.toLocaleDateString('en-US', { weekday: 'long' })}, ${date.getDate()} ` +
                          `${date.toLocaleDateString('en-US', { month: 'short' })} ` +
                          `${date.toLocaleDateString('en-US', { year: 'numeric' })}`;
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    console.log(`Database connection successful: ${formattedDate} - ${formattedTime}`);
  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
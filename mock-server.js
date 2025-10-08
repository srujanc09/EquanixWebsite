const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = [];

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  const exists = users.find(u => u.email === email);
  if (exists) return res.status(400).json({ message: 'User already exists' });
  const user = { id: users.length + 1, email, name: name || 'User' };
  users.push({ ...user, password });
  return res.json({ data: { user, tokens: { accessToken: 'mock-access', refreshToken: 'mock-refresh' } } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const { password: _p, ...publicUser } = user;
  return res.json({ data: { user: publicUser, tokens: { accessToken: 'mock-access', refreshToken: 'mock-refresh' } } });
});

app.get('/api/auth/me', (req, res) => {
  // return a first user or null
  if (users.length === 0) return res.status(404).json({ message: 'No user' });
  const { password, ...publicUser } = users[0];
  return res.json({ data: { user: publicUser } });
});

const PORT = process.env.MOCK_SERVER_PORT || 5001;
app.listen(PORT, () => console.log(`Mock server listening on http://localhost:${PORT}`));

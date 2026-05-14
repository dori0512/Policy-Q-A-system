const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.validateToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '未提供令牌' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [decoded.email]);
    
    if (!users.length) return res.status(404).json({ error: '用户不存在' });
    res.json({ 
      data: {data: {
        email: users[0].email,
        id: users[0].id
      }}
    });
  } catch (error) {
    res.status(401).json({ error: '无效的令牌' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!users.length || !(await bcrypt.compare(password, users[0].password_hash))) {
      return res.status(401).json({ error: '无效的账号或密码' });
    }

    const user = users[0];
    const token = jwt.sign(
      { id: user.id, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '登录失败' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length) {
      return res.status(409).json({ error: '邮箱已被注册' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, hashedPassword]
    );

    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '注册失败' });
  }
};
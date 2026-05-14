const express = require('express');
const router = express.Router();
const { authenticate } = require('../module/middlewares/authMiddleware');
const {
  createSession,
  sendQuery,
  validateSession,
  getUserSessions,
  getSessionMessages
} = require('../module/controllers/chatController'); // 导入 validateSession

router.use(authenticate);
router.get('/history', getUserSessions);
router.get('/messages/:sessionId', getSessionMessages);
router.post('/new', createSession);
router.post(
  '/query',
  authenticate,
  validateSession,
  sendQuery
);

module.exports = router;
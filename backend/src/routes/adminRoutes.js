import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Admin from '../models/Admin.js';
import { 
  loginAdmin, 
  getAllSupervisors, 
  getSupervisorById,
  updateSupervisor,
  deleteSupervisor,
  approveSupervisor, 
  rejectSupervisor 
} from '../controllers/adminController.js';

const router = express.Router();

// Admin authentication
router.post('/login', loginAdmin);

// Forgot Password (request)
router.post('/request-reset', async (req, res) => {
  try {
    const email = (req.body?.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const admin = await Admin.findOne({ email });
    // Do not reveal user existence
    if (!admin) return res.json({ success: true, message: 'If that email exists, a reset link has been generated.' });
    const token = crypto.randomBytes(20).toString('hex');
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    admin.passwordResetToken = hashed;
    admin.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await admin.save({ validateBeforeSave: false });
    // Dev mode: return token in response body
    return res.json({ success: true, message: 'Reset token generated', token });
  } catch (err) {
    console.error('admin request-reset error:', err);
    return res.status(500).json({ success: false, message: 'Failed to initiate reset' });
  }
});

// Forgot Password (reset)
router.post('/reset', async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) return res.status(400).json({ success: false, message: 'Token and new password are required' });
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const admin = await Admin.findOne({ passwordResetToken: hashed, passwordResetExpires: { $gt: new Date() } });
    if (!admin) return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    admin.password = await bcrypt.hash(password, 12);
    admin.passwordResetToken = null;
    admin.passwordResetExpires = null;
    await admin.save();
    return res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('admin reset error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
});

// Supervisor management
router.get('/supervisors', getAllSupervisors);
router.get('/supervisors/:id', getSupervisorById);
router.put('/supervisors/:id', updateSupervisor);
router.delete('/supervisors/:id', deleteSupervisor);
router.patch('/supervisors/:id/approve', approveSupervisor);
router.patch('/supervisors/:id/reject', rejectSupervisor);

export default router;

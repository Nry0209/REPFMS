import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Supervisor from "../models/Supervisor.js";
import Supervision from "../models/Supervision.js";
import Research from "../models/Research.js";
import Notification from "../models/Notification.js";

// 🔑 Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// List admin notifications (unread first, recent first)
export const getAdminNotifications = async (req, res) => {
  try {
    const items = await Notification.find({ forRole: "admin" })
      .sort({ read: 1, createdAt: -1 })
      .limit(200)
      .lean();
    return res.json({ success: true, data: items });
  } catch (err) {
    console.error("Admin get notifications error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark admin notification as read
export const markAdminNotificationRead = async (req, res) => {
  try {
    const n = await Notification.findOneAndUpdate(
      { _id: req.params.id, forRole: "admin" },
      { $set: { read: true } },
      { new: true }
    );
    if (!n) return res.status(404).json({ success: false, message: "Notification not found" });
    return res.json({ success: true, data: n });
  } catch (err) {
    console.error("Admin mark notification read error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// List supervisions pending admin verification
export const listPendingSupervisions = async (req, res) => {
  try {
    const items = await Supervision.find({ status: "Pending", verifiedByMinistry: false })
      .populate("supervisor", "name email domains")
      .populate("researcher", "fullName email")
      .sort({ createdAt: -1 })
      .lean();

    const ids = items.map(i => i._id);
    const researches = await Research.find({ supervisionRef: { $in: ids } })
      .select("domains supervisionRef title")
      .lean();
    const bySupRef = new Map(researches.map(r => [String(r.supervisionRef), r]));
    const data = items.map(i => ({ ...i, research: bySupRef.get(String(i._id)) || null }));

    return res.json({ success: true, data });
  } catch (err) {
    console.error("Admin listPendingSupervisions error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Approve a specific supervision if domains match
export const approveSupervision = async (req, res) => {
  try {
    const supervision = await Supervision.findById(req.params.id);
    if (!supervision) return res.status(404).json({ success: false, message: "Supervision not found" });

    const supervisor = await Supervisor.findById(supervision.supervisor).select("domains");
    if (!supervisor) return res.status(404).json({ success: false, message: "Supervisor not found" });

    const research = await Research.findOne({ supervisionRef: supervision._id }).select("domains title");
    let candidateDomains = research?.domains || [];
    if (!candidateDomains.length) {
      const { default: Researcher } = await import("../models/Researcher.js");
      const researcher = await Researcher.findById(supervision.researcher).select("domains");
      candidateDomains = researcher?.domains || [];
    }

    const overlap = (candidateDomains || []).filter(d => (supervisor.domains || []).includes(d));
    if (overlap.length === 0) {
      return res.status(400).json({ success: false, message: "Domain mismatch" });
    }

    supervision.verifiedByMinistry = true;
    await supervision.save();

    // Notify supervisor that a new admin-verified request is available
    try {
      await Notification.create({
        forRole: "supervisor",
        forRoleRef: "Supervisor",
        forUser: supervision.supervisor,
        type: "supervision_admin_approved",
        message: "A new supervision request has been approved by admin",
        payload: { supervisionId: String(supervision._id) },
      });
    } catch (e) {
      console.error("Notify supervisor on admin approval error:", e);
    }

    return res.json({ success: true, message: "Supervision approved and sent to supervisor", supervisionId: supervision._id });
  } catch (err) {
    console.error("Admin approveSupervision error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Reject a specific supervision (admin)
export const rejectSupervision = async (req, res) => {
  try {
    const supervision = await Supervision.findById(req.params.id);
    if (!supervision) return res.status(404).json({ success: false, message: "Supervision not found" });

    // Clear research link so the researcher can re-request
    try {
      const research = await Research.findOne({ supervisionRef: supervision._id });
      if (research) {
        research.supervisionRef = undefined;
        await research.save();
      }
    } catch (e) {
      console.error("Clear research.supervisionRef on reject error:", e);
    }

    await supervision.deleteOne();

    // Notify researcher and admin
    try {
      await Notification.create([
        {
          forRole: "researcher",
          forRoleRef: "Researcher",
          forUser: supervision.researcher,
          type: "supervision_admin_rejected",
          message: "Your supervision request was rejected by admin",
          payload: { supervisionId: String(supervision._id) },
        },
        {
          forRole: "admin",
          forRoleRef: "Admin",
          type: "supervision_admin_rejected",
          message: "A supervision request was rejected",
          payload: { supervisionId: String(supervision._id) },
        },
      ]);
    } catch (e) {
      console.error("Notify on admin reject error:", e);
    }

    return res.json({ success: true, message: "Supervision rejected and removed" });
  } catch (err) {
    console.error("Admin rejectSupervision error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Admin Login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(admin._id);

    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: "admin",
      token,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get all supervisors with optional status filter
export const getAllSupervisors = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const supervisors = await Supervisor.find(query)
      .select('-password -loginAttempts -lockUntil -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      count: supervisors.length,
      data: supervisors
    });
  } catch (error) {
    console.error('Error getting supervisors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single supervisor by ID
export const getSupervisorById = async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.params.id)
      .select('-password -loginAttempts -lockUntil -resetPasswordToken -resetPasswordExpire');
      
    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: supervisor
    });
  } catch (error) {
    console.error('Error getting supervisor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update supervisor
export const updateSupervisor = async (req, res) => {
  try {
    const { name, email, title, affiliation, phone, status, rejectionReason } = req.body;
    
    const updateData = {
      name,
      email,
      title,
      affiliation,
      phone,
      status,
      rejectionReason
    };

    // Handle status updates
    if (status === 'approved') {
      updateData.approvedAt = Date.now();
      updateData.rejectedAt = undefined;
      updateData.rejectionReason = undefined;
      // Make supervisor selectable for requests after approval
      updateData.availability = 'Available';
      updateData.isVerified = true;
    } else if (status === 'rejected') {
      updateData.rejectedAt = Date.now();
      updateData.approvedAt = undefined;
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is required when rejecting a supervisor'
        });
      }
    } else if (status === 'pending') {
      updateData.approvedAt = undefined;
      updateData.rejectedAt = undefined;
      updateData.rejectionReason = undefined;
    }
    
    const supervisor = await Supervisor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil -resetPasswordToken -resetPasswordExpire');
    
    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Supervisor updated successfully',
      data: supervisor
    });
  } catch (error) {
    console.error('Error updating supervisor:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete supervisor
export const deleteSupervisor = async (req, res) => {
  try {
    const supervisor = await Supervisor.findByIdAndDelete(req.params.id);
    
    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Supervisor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting supervisor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Approve a supervisor
export const approveSupervisor = async (req, res) => {
  try {
    const supervisor = await Supervisor.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved',
        approvedAt: Date.now(),
        availability: 'Available',
        isVerified: true,
      },
      { new: true, runValidators: true }
    );

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found'
      });
    }

    // TODO: Send approval email to supervisor

    res.status(200).json({
      success: true,
      data: supervisor
    });
  } catch (error) {
    console.error('Error approving supervisor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Reject a supervisor
export const rejectSupervisor = async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for rejection'
      });
    }

    const supervisor = await Supervisor.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found'
      });
    }

    // TODO: Send rejection email to supervisor with reason

    res.status(200).json({
      success: true,
      data: supervisor
    });
  } catch (error) {
    console.error('Error rejecting supervisor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

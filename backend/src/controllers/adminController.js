import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Supervisor from "../models/Supervisor.js";

// 🔑 Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
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
        approvedAt: Date.now()
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

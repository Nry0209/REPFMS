import express from 'express';
import mongoose from 'mongoose';
import FundingRequest from '../models/FundingRequest.js';
import Researcher from '../models/Researcher.js';
import Supervisor from '../models/Supervisor.js';
import Supervision from '../models/Supervision.js';

const router = express.Router();

// @desc    Get all funding requests
// @route   GET /api/funding
// @access  Private/Admin
router.get('/', async (req, res) => {
  console.log('Fetching funding requests...');
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected');
      return res.status(503).json({ 
        success: false, 
        message: 'Database connection error',
        error: 'Database not connected'
      });

// @desc    Supervisor validates/invalidates a funding request (pre-approval gate)
// @route   PATCH /api/funding/:id/supervisor-validate
// @access  Private/Supervisor (NOTE: add auth middleware when available)
router.patch('/:id/supervisor-validate', async (req, res) => {
  try {
    const { validated, note } = req.body || {};
    const fr = await FundingRequest.findById(req.params.id);
    if (!fr) return res.status(404).json({ message: 'Funding request not found' });

    fr.validatedBySupervisor = !!validated;
    fr.supervisorValidationNote = note || '';
    fr.supervisorValidatedAt = new Date();
    await fr.save();

    const populated = await FundingRequest.findById(req.params.id)
      .populate('researcher', 'fullName email')
      .populate('supervisor', 'name email');
    return res.json({ success: true, data: populated });
  } catch (error) {
    console.error('Supervisor validate funding error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

  // @desc    Supervisor validates/invalidates a funding request (pre-approval gate)
  // @route   PATCH /api/funding/:id/supervisor-validate
  // @access  Private/Supervisor (NOTE: add auth middleware when available)
  router.patch('/:id/supervisor-validate', async (req, res) => {
    try {
      const { validated, note } = req.body || {};
      const fr = await FundingRequest.findById(req.params.id);
      if (!fr) return res.status(404).json({ message: 'Funding request not found' });

      fr.validatedBySupervisor = !!validated;
      fr.supervisorValidationNote = note || '';
      fr.supervisorValidatedAt = new Date();
      await fr.save();

      const populated = await FundingRequest.findById(req.params.id)
        .populate('researcher', 'fullName email')
        .populate('supervisor', 'name email');
      return res.json({ success: true, data: populated });
    } catch (error) {
      console.error('Supervisor validate funding error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });
    }

    console.log('Database connection status:', mongoose.connection.readyState);
    
    const requests = await FundingRequest.find({})
      .populate({
        path: 'researcher',
        select: 'fullName email',
        model: 'Researcher'
      })
      .populate('supervisor', 'name email')
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JavaScript objects
    
    console.log(`Found ${requests.length} funding requests`);
    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching funding requests:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch funding requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// @desc    Get budget allocation summary
// @route   GET /api/funding/budget
// @access  Private/Admin
router.get('/budget', async (req, res) => {
  try {
    const totalBudget = 1000000; // This should come from your config
    const approvedRequests = await FundingRequest.find({ status: 'approved' });
    
    const allocated = approvedRequests.reduce(
      (sum, request) => sum + (request.recommendedAmount || 0), 
      0
    );
    
    res.json({
      totalBudget,
      allocated,
      remaining: totalBudget - allocated
    });
  } catch (error) {
    console.error('Error fetching budget data:', error);
    res.status(500).json({ message: 'Error fetching budget data' });
  }
});

// @desc    Update funding request status
// @route   PATCH /api/funding/status/:id
// @access  Private/Admin
router.patch('/status/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { status, recommendedAmount, override, overrideReason } = req.body;
    
    // Validate status
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Find and update the funding request
    const request = await FundingRequest.findById(req.params.id).session(session);
    
    if (!request) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Funding request not found' });
    }
    
    // If approving, ensure supervisor validated unless override
    if (status === 'approved') {
      if (!request.validatedBySupervisor && !override) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Supervisor validation required before approval. Provide override with reason to proceed.' });
      }
      if (!request.validatedBySupervisor && override && !overrideReason) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Override reason is required when bypassing supervisor validation.' });
      }
      if (override && overrideReason) {
        request.rejectionReason = `Override: ${overrideReason}`;
      }
    }

    // Update status and recommended amount if provided
    request.status = status;
    if (recommendedAmount !== undefined) {
      request.recommendedAmount = recommendedAmount;
    }
    
    await request.save({ session });
    await session.commitTransaction();
    session.endSession();
    
    // Populate the updated request for the response
    const updatedRequest = await FundingRequest.findById(req.params.id)
      .populate('researcher', 'name email')
      .populate('supervisor', 'name email');
    
    res.json({
      success: true,
      data: updatedRequest
    });
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error updating funding request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update funding request status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @desc    Get single funding request
// @route   GET /api/funding/:id
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const request = await FundingRequest.findById(req.params.id)
      .populate('researcher', 'name email')
      .populate('supervisor', 'name email');
    
    if (!request) {
      return res.status(404).json({ message: 'Funding request not found' });
    }
    
    res.json(request);
  } catch (error) {
    console.error('Error fetching funding request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a new funding request
// @route   POST /api/funding-requests
// @access  Private/Admin

router.post('/', async (req, res) => {
  try {
    const {
      projectTitle,
      researcher: researcherId,
      supervisor: supervisorId,
      department,
      requestedAmount,
      recommendedAmount,
      budgetBreakdown,
      justification,
      documents = []
    } = req.body;

    // Basic validation
    if (!projectTitle || !researcherId || !supervisorId || !department || !requestedAmount) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['projectTitle', 'researcher', 'supervisor', 'department', 'requestedAmount']
      });
    }

    // Simple validation of IDs
    if (!mongoose.Types.ObjectId.isValid(researcherId) || !mongoose.Types.ObjectId.isValid(supervisorId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Server-side preconditions: ensure supervision is Finished and Feasible
    const supervision = await Supervision.findOne({
      researcher: researcherId,
      supervisor: supervisorId,
      projectTitle: projectTitle,
    });

    if (!supervision) {
      return res.status(400).json({ message: 'No supervision found for this researcher, supervisor and project title' });
    }

    if (supervision.status !== 'Finished' || supervision.feasibility !== 'Feasible') {
      return res.status(400).json({ message: 'Funding allowed only for Finished and Feasible supervisions' });
    }

    if (supervision.fundingRequested) {
      return res.status(409).json({ message: 'Funding already requested for this supervision' });
    }

    const newRequest = new FundingRequest({
      projectTitle,
      researcher: researcherId,
      supervisor: supervisorId,
      department,
      requestedAmount: parseFloat(requestedAmount),
      recommendedAmount: recommendedAmount ? parseFloat(recommendedAmount) : null,
      status: 'pending',
      budgetBreakdown: {
        personnel: parseFloat(budgetBreakdown?.personnel) || 0,
        equipment: parseFloat(budgetBreakdown?.equipment) || 0,
        materials: parseFloat(budgetBreakdown?.materials) || 0,
        travel: parseFloat(budgetBreakdown?.travel) || 0,
        other: parseFloat(budgetBreakdown?.other) || 0
      },
      justification: justification || '',
      documents: Array.isArray(documents) ? documents : []
    });

    const createdRequest = await newRequest.save();
    // Mark supervision as fundingRequested to prevent duplicates
    supervision.fundingRequested = true;
    await supervision.save();
    
    // Populate the response with basic details
    const response = createdRequest.toObject();
    response.researcher = { _id: researcherId };
    response.supervisor = { _id: supervisorId };
      
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating funding request:', error);
    res.status(500).json({ message: 'Error creating funding request', error: error.message });
  }
});

// @desc    Update a funding request
// @route   PUT /api/funding/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const {
      projectTitle,
      researcher: researcherId,
      supervisor: supervisorId,
      department,
      requestedAmount,
      status,
      recommendedAmount,
      budgetBreakdown,
      justification,
      documents,
      reason
    } = req.body;

    // Validate required fields
    if (!projectTitle || !researcherId || !supervisorId || !department || !requestedAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate budget breakdown sum matches requested amount if provided
    if (budgetBreakdown) {
      const totalBreakdown = Object.values(budgetBreakdown).reduce(
        (sum, amount) => sum + (parseFloat(amount) || 0), 0
      );
      
      if (Math.abs(totalBreakdown - requestedAmount) > 0.01) { // Allow for floating point precision
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          message: 'Budget breakdown total must match the requested amount',
          totalBreakdown,
          requestedAmount
        });
      }
    }

    // Check if researcher exists
    const researcher = await Researcher.findById(researcherId).session(session);
    if (!researcher) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Researcher not found' });
    }

    // Check if supervisor exists
    const supervisor = await Supervisor.findById(supervisorId).session(session);
    if (!supervisor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    // Find and update the funding request
    const request = await FundingRequest.findById(req.params.id).session(session);
    if (!request) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Funding request not found' });
    }

    // Update fields
    request.projectTitle = projectTitle;
    request.researcher = researcherId;
    request.supervisor = supervisorId;
    request.department = department;
    request.requestedAmount = requestedAmount;
    request.status = status || request.status;
    request.recommendedAmount = recommendedAmount !== undefined ? recommendedAmount : request.recommendedAmount;
    request.budgetBreakdown = budgetBreakdown || request.budgetBreakdown;
    request.justification = justification || request.justification;
    request.documents = documents || request.documents;
    request.reason = reason || request.reason;

    // If status is being updated to approved and not already approved
    if (status === 'approved' && request.status !== 'approved') {
      request.approvedAt = new Date();
      request.approvedBy = req.user?.id; // Assuming you have user authentication
    }

    // Save the updated request
    const updatedRequest = await request.save({ session });
    
    // If status changed to approved, update researcher's funding history
    if (status === 'approved' && request.status !== 'approved') {
      researcher.fundingHistory = researcher.fundingHistory || [];
      researcher.fundingHistory.push({
        requestId: updatedRequest._id,
        amount: updatedRequest.recommendedAmount || updatedRequest.requestedAmount,
        date: updatedRequest.approvedAt,
        projectTitle: updatedRequest.projectTitle
      });
      await researcher.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    // Populate the response with researcher and supervisor details
    const populatedRequest = await FundingRequest.findById(updatedRequest._id)
      .populate('researcher', 'fullName email')
      .populate('supervisor', 'name email')
      .lean();

    res.json({
      success: true,
      message: 'Funding request updated successfully',
      data: populatedRequest
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error updating funding request:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating funding request', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @desc    Delete a funding request
// @route   DELETE /api/funding-requests/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const request = await FundingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Funding request not found' });
    }

    // Use deleteOne() instead of remove()
    await FundingRequest.deleteOne({ _id: req.params.id });
    res.json({ message: 'Funding request removed' });
  } catch (error) {
    console.error('Error deleting funding request:', error);
    res.status(500).json({ message: 'Error deleting funding request', error: error.message });
  }
});

// @desc    Update funding request status
// @route   PUT /api/funding-requests/:id/status
// @access  Private/Admin
router.put('/:id/status', async (req, res) => {
  try {
    const { status, recommendedAmount } = req.body;
    const request = await FundingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Funding request not found' });
    }

    request.status = status;
    if (recommendedAmount !== undefined) {
      request.recommendedAmount = recommendedAmount;
    }
    
    if (status === 'approved' && !request.approvedAt) {
      request.approvedAt = Date.now();
    }

    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating funding request status:', error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
});

// @desc    Get budget allocation
// @route   GET /api/funding-requests/budget
// @access  Private/Admin
router.get('/budget', async (req, res) => {
  try {
    // Calculate total allocated budget from approved requests
    const approvedRequests = await FundingRequest.find({ status: 'approved' });
    const allocated = approvedRequests.reduce(
      (total, request) => total + (request.recommendedAmount || 0),
      0
    );

    // This is a placeholder - you might want to store the total budget in a separate collection
    const totalBudget = 1000000; // Example value, replace with your actual total budget
    
    res.json({
      totalBudget,
      allocated,
      remaining: Math.max(0, totalBudget - allocated)
    });
  } catch (error) {
    console.error('Error fetching budget allocation:', error);
    res.status(500).json({ message: 'Error getting budget allocation', error: error.message });
  }
});

export default router;

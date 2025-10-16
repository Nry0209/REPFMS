import mongoose from 'mongoose';
import Research from '../models/Research.js';
import ResearchApproval from '../models/ResearchApproval.js';

// @desc    Debug endpoint to list all collections
// @route   GET /api/researches/debug/collections
// @access  Public
export const listCollections = async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Available collections:', collectionNames);
    res.json({
      success: true,
      collections: collectionNames
    });
  } catch (error) {
    console.error('Error listing collections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list collections',
      error: error.message
    });
  }
};

// @desc    Get all researches
// @route   GET /api/researches
// @access  Public
export const getResearches = async (req, res) => {
  try {
    const researches = await Research.find()
      .populate({
        path: 'researcher',
        select: 'fullName email',
        model: 'Researcher'
      })
      .populate({
        path: 'supervisor',
        select: 'name email',
        model: 'Supervisor'
      })
      .sort({ createdAt: -1 });
    
    res.json(researches);
  } catch (error) {
    console.error('Error fetching researches:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single research
// @route   GET /api/researches/:id
// @access  Public
export const getResearchById = async (req, res) => {
  try {
    const research = await Research.findById(req.params.id)
      .populate({
        path: 'researcher',
        select: 'fullName email',
        model: 'Researcher'
      })
      .populate({
        path: 'coResearchers',
        select: 'fullName email',
        model: 'Researcher'
      })
      .populate({
        path: 'supervisor',
        select: 'name email title',
        model: 'Supervisor'
      });
    
    if (!research) {
      return res.status(404).json({ message: 'Research not found' });
    }
    
    res.json(research);
  } catch (error) {
    console.error('Error fetching research:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Assign/Update supervisor for a research
// @route   PUT /api/researches/:id/supervisor
// @access  Private/Admin
export const assignSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.body;
    
    // Check if research exists
    const research = await Research.findById(req.params.id);
    if (!research) {
      return res.status(404).json({ message: 'Research not found' });
    }

    // If supervisorId is provided, verify supervisor exists
    if (supervisorId) {
      const supervisor = await mongoose.model('Supervisor').findById(supervisorId);
      if (!supervisor) {
        return res.status(404).json({ message: 'Supervisor not found' });
      }
    }

    // Update supervisor
    research.supervisor = supervisorId || null;
    await research.save();

    // Populate the supervisor data in the response
    const populatedResearch = await Research.findById(research._id)
      .populate('supervisor', 'name email title');

    res.json({
      message: 'Supervisor assignment updated successfully',
      research: populatedResearch
    });
  } catch (error) {
    console.error('Error assigning supervisor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update supervisor status for a research and create approval record
// @route   PUT /api/researches/:id/status
// @access  Private/Admin
export const updateSupervisorStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { status, comments = '' } = req.body;
    
    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Status must be either "accepted" or "rejected"' });
    }

    // Find and lock the research document with necessary populations
    const research = await Research.findById(req.params.id)
      .populate('researcher', 'fullName email')
      .populate('supervisor', 'name email')
      .session(session);

    if (!research) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Research not found' });
    }

    if (!research.supervisor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'No supervisor assigned to this research' });
    }

    // Create approval record
    const approvalRecord = new ResearchApproval({
      research: research._id,
      researchTitle: research.title,
      researcher: {
        id: research.researcher._id,
        name: research.researcher.fullName,
        email: research.researcher.email
      },
      supervisor: {
        id: research.supervisor._id,
        name: research.supervisor.name,
        email: research.supervisor.email
      },
      status,
      comments,
      decisionDate: new Date()
    });

    // Update research status
    research.supervisorStatus = status;

    // Save both in a transaction
    await Promise.all([
      research.save({ session }),
      approvalRecord.save({ session })
    ]);

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: `Supervisor ${status} successfully`,
      research,
      approvalRecord
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error updating supervisor status:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete a research
// @route   DELETE /api/researches/:id
// @access  Private/Admin
export const deleteResearch = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the research
    const research = await Research.findByIdAndDelete(id);

    if (!research) {
      return res.status(404).json({ 
        success: false, 
        message: 'Research not found' 
      });
    }

    // Delete associated approval records if they exist
    await ResearchApproval.deleteMany({ research: id });

    res.json({ 
      success: true, 
      message: 'Research deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting research:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete research',
      error: error.message 
    });
  }
};

// @desc    Get available supervisors
// @route   GET /api/supervisors/available
// @access  Private/Admin
export const getAvailableSupervisors = async (req, res) => {
  try {
    const supervisors = await mongoose.model('Supervisor')
      .find({})
      .select('name email title domains')
      .sort({ name: 1 });
    
    res.json(supervisors);
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

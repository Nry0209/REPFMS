import mongoose from 'mongoose';

const researchApprovalSchema = new mongoose.Schema({
  // Reference to the research
  research: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Research',
    required: true,
    index: true
  },
  
  // Research details
  researchTitle: {
    type: String,
    required: true
  },
  
  // Researcher information
  researcher: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Researcher',
      required: true
    },
    name: String,
    email: String
  },
  
  // Supervisor information
  supervisor: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supervisor',
      required: true
    },
    name: String,
    email: String
  },
  
  // Approval status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    required: true,
    index: true
  },
  
  // Additional details
  comments: {
    type: String,
    default: ''
  },
  
  // Timestamps
  decisionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for faster querying
researchApprovalSchema.index({ 'researcher.id': 1, status: 1 });
researchApprovalSchema.index({ 'supervisor.id': 1, status: 1 });
researchApprovalSchema.index({ decisionDate: -1 });

const ResearchApproval = mongoose.model('ResearchApproval', researchApprovalSchema);

export default ResearchApproval;

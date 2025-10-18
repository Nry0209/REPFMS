import mongoose from 'mongoose';

const FundingRequestSchema = new mongoose.Schema(
  {
    projectTitle: { 
      type: String, 
      required: [true, 'Project title is required'] 
    },
    researcher: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Researcher', 
      required: [true, 'Researcher is required'] 
    },
    supervisor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Supervisor',
      required: [true, 'Supervisor is required']
    },
    department: { 
      type: String, 
      required: [true, 'Department is required'] 
    },
    requestedAmount: { 
      type: Number, 
      required: [true, 'Requested amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    recommendedAmount: { 
      type: Number,
      min: [0, 'Amount cannot be negative']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    budgetBreakdown: {
      personnel: { type: Number, default: 0 },
      equipment: { type: Number, default: 0 },
      materials: { type: Number, default: 0 },
      travel: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    justification: {
      type: String,
      required: [true, 'Justification is required']
    },
    documents: [{
      name: String,
      url: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: {
      type: Date
    },
    rejectionReason: {
      type: String
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
FundingRequestSchema.index({ status: 1 });
FundingRequestSchema.index({ researcher: 1 });
FundingRequestSchema.index({ supervisor: 1 });
FundingRequestSchema.index({ department: 1 });

// Virtual for total recommended amount
FundingRequestSchema.virtual('totalRecommended').get(function() {
  return this.recommendedAmount || this.requestedAmount;
});

// Pre-save hook to ensure recommendedAmount is set
FundingRequestSchema.pre('save', function(next) {
  if (!this.recommendedAmount) {
    this.recommendedAmount = this.requestedAmount;
  }
  next();
});

export default mongoose.model('FundingRequest', FundingRequestSchema);

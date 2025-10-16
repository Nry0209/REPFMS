// import mongoose from "mongoose";

// const researchSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     domains: {
//       type: [String],
//       required: true,
//       validate: {
//         validator: function (arr) {
//           return arr.length > 0 && arr.length <= 3;
//         },
//         message: "A research must have between 1 and 3 domains"
//       }
//     },
//     researcher: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Researcher",
//       required: true
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now
//     },
//     updatedAt: {
//       type: Date
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// export default mongoose.model("Research", researchSchema);



// import mongoose from "mongoose";

// const researchSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     domains: {
//       type: [String],
//       required: true,
//       validate: {
//         validator: function (arr) {
//           return arr.length > 0 && arr.length <= 3;
//         },
//         message: "A research must have between 1 and 3 domains",
//       },
//     },
//     status: {
//       type: String,
//       enum: ["Pending", "Current", "Finished"],
//       default: "Pending",
//     },
//     feasibility: {
//       type: String,
//       enum: ["Feasible", "Not Feasible", null],
//       default: null,
//     },
//     researcher: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Researcher",
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model("Research", researchSchema);

import mongoose from "mongoose";

const researchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    // Optional: path or URL to the research paper file
    paperUrl: {
      type: String,
      trim: true
    },
    domains: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0 && arr.length <= 3;
        },
        message: "A research must have between 1 and 3 domains"
      }
    },
    researcher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Researcher",
      required: true
    },
    // Status used by dashboard grouping
    status: {
      type: String,
      enum: ["Pending", "Current", "Finished"],
      default: "Pending",
    },
    // Optional feasibility for funding flow
    feasibility: {
      type: String,
      enum: ["Feasible", "Not Feasible", null],
      default: null,
    },
    // Co-actors (other researchers in same project)
    coResearchers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Researcher" }],
    // Optional reference to supervision if linked
    supervisionRef: { type: mongoose.Schema.Types.ObjectId, ref: "Supervision" },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Research", researchSchema);

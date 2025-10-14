// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import path from "path";
// import bcrypt from "bcryptjs";
// import Researcher from "../models/Researcher.js";
// import Research from "../models/Research.js";
// import fs from "fs";

// // Ensure .env loads correctly even if run from different folder
// dotenv.config({ path: path.resolve("../../.env") });

// // Debug: Check if MONGO_URI is loaded
// console.log("Mongo URI:", process.env.MONGO_URI);

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Connected to MongoDB");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   }
// };

// const researchersData = [
//   {
//     fullName: "Dr. Alice Johnson",
//     email: "alice.johnson@example.com",
//     password: "password123",
//     degree: "PhD in AI",
//     domains: ["Information Technology", "Healthcare & Medicine"],
//     grants: "Grant-A1",
//     collaborations: "Dr. Bob Smith",
//     cv: "uploads/researchers/cv/cv-alice.pdf",
//     linkedin: "https://linkedin.com/in/alicejohnson",
//     scopus: "https://scopus.com/alicejohnson",
//     googleScholar: "https://scholar.google.com/alicejohnson",
//     transcripts: {
//       "PhD in AI": "uploads/researchers/transcripts/transcript-alice-phd.pdf",
//     },
//     researches: [
//       {
//         title: "AI for Healthcare Diagnostics",
//         description: "Research on AI-based diagnosis systems for healthcare.",
//         domains: ["Information Technology", "Healthcare & Medicine"],
//       },
//       {
//         title: "AI Ethics",
//         description: "Exploring ethical considerations in AI systems.",
//         domains: ["Information Technology"],
//       },
//     ],
//   },
//   {
//     fullName: "Dr. Bob Smith",
//     email: "bob.smith@example.com",
//     password: "password123",
//     degree: "PhD in Biotechnology",
//     domains: ["Biotechnology & Life Sciences", "Healthcare & Medicine"],
//     grants: "Grant-B2",
//     collaborations: "Dr. Alice Johnson",
//     cv: "uploads/researchers/cv-bob.pdf",
//     linkedin: "https://linkedin.com/in/bobsmith",
//     scopus: "https://scopus.com/bobsmith",
//     googleScholar: "https://scholar.google.com/bobsmith",
//     transcripts: {
//       "PhD in Biotechnology": "uploads/researchers/transcript-bob-phd.pdf",
//     },
//     researches: [
//       {
//         title: "Biotech in Medicine",
//         description: "Using biotechnology for advanced healthcare solutions.",
//         domains: ["Biotechnology & Life Sciences", "Healthcare & Medicine"],
//       },
//       {
//         title: "Genetic Engineering Ethics",
//         description: "Ethics of genetic modification.",
//         domains: ["Biotechnology & Life Sciences"],
//       },
//     ],
//   },
//   {
//     fullName: "Dr. Clara Zhang",
//     email: "clara.zhang@example.com",
//     password: "password123",
//     degree: "PhD in Agriculture",
//     domains: ["Agriculture & Food Security"],
//     grants: "Grant-C3",
//     collaborations: "Dr. David Lee",
//     cv: "uploads/researchers/cv-clara.pdf",
//     linkedin: "https://linkedin.com/in/clarazhang",
//     scopus: "https://scopus.com/clarazhang",
//     googleScholar: "https://scholar.google.com/clarazhang",
//     transcripts: {
//       "PhD in Agriculture": "uploads/researchers/transcript-clara-phd.pdf",
//     },
//     researches: [
//       {
//         title: "Sustainable Farming",
//         description: "Techniques for sustainable farming practices.",
//         domains: ["Agriculture & Food Security"],
//       },
//       {
//         title: "Soil Health",
//         description: "Impact of crop rotation on soil health.",
//         domains: ["Agriculture & Food Security"],
//       },
//     ],
//   },
//   {
//     fullName: "Dr. David Lee",
//     email: "david.lee@example.com",
//     password: "password123",
//     degree: "PhD in Renewable Energy",
//     domains: ["Engineering & Technology", "Information Technology"],
//     grants: "Grant-D4",
//     collaborations: "Dr. Clara Zhang",
//     cv: "uploads/researchers/cv-david.pdf",
//     linkedin: "https://linkedin.com/in/davidlee",
//     scopus: "https://scopus.com/davidlee",
//     googleScholar: "https://scholar.google.com/davidlee",
//     transcripts: {
//       "PhD in Renewable Energy": "uploads/researchers/transcript-david-phd.pdf",
//     },
//     researches: [
//       {
//         title: "Solar Energy Optimization",
//         description: "Improving efficiency of solar panels.",
//         domains: ["Engineering & Technology", "Information Technology"],
//       },
//       {
//         title: "Smart Grids",
//         description: "Integrating renewable energy into smart grids.",
//         domains: ["Engineering & Technology"],
//       },
//     ],
//   },
// ];

// const seedResearchers = async () => {
//   try {
//     await connectDB();

//     await Researcher.deleteMany();
//     await Research.deleteMany();

//     for (const r of researchersData) {
//       const hashedPassword = await bcrypt.hash(r.password, 10);

//       const researcher = new Researcher({
//         fullName: r.fullName,
//         email: r.email,
//         password: hashedPassword,
//         degree: r.degree,
//         domains: r.domains,
//         grants: r.grants,
//         collaborations: r.collaborations,
//         cvFile: r.cv,
//         linkedin: r.linkedin,
//         scopus: r.scopus,
//         googleScholar: r.googleScholar,
//         transcripts: r.transcripts,
//         researches: [],
//       });

//       await researcher.save();

//       for (const res of r.researches) {
//         const research = new Research({
//           title: res.title,
//           description: res.description,
//           domains: res.domains,
//           researcher: researcher._id,
//         });
//         await research.save();
//         researcher.researches.push(research._id);
//       }

//       await researcher.save();
//       console.log(`✅ Researcher created: ${researcher.fullName}`);
//     }

//     console.log("✅ Researchers seeding completed!");
//     process.exit();
//   } catch (error) {
//     console.error("❌ Seeding error:", error);
//     process.exit(1);
//   }
// };

// seedResearchers();

// // backend/seed/seedResearchers.js
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import bcrypt from "bcryptjs";
// import Researcher from "../models/Researcher.js";
// import Research from "../models/Research.js";

// // Get __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load .env from root directory
// dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// console.log("Mongo URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Connected to MongoDB");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   }
// };

// const researchersData = [
//   {
//     fullName: "Dr. Alice Johnson",
//     email: "alice.johnson@example.com",
//     password: "password123",
//     degree: "PhD in AI",
//     domains: ["Information Technology", "Healthcare & Medicine"],
//     grants: "Grant-A1",
//     collaborations: "Dr. Bob Smith",
//     cvFile: "uploads/researcher/cv/cv-alice.pdf",
//     linkedin: "https://linkedin.com/in/alicejohnson",
//     scopus: "https://scopus.com/alicejohnson",
//     googleScholar: "https://scholar.google.com/alicejohnson",
//     transcripts: {
//       "PhD in AI": "uploads/researcher/transcripts/transcript-alice-phd.pdf",
//     },
//     researches: [
//       {
//         title: "AI for Healthcare Diagnostics",
//         description: "Research on AI-based diagnosis systems for healthcare.",
//         domains: ["Information Technology", "Healthcare & Medicine"],
//         status: "Finished",
//         feasibility: "Feasible",
//       },
//       {
//         title: "AI Ethics in Medical Systems",
//         description: "Exploring ethical considerations in AI systems.",
//         domains: ["Information Technology"],
//         status: "Current",
//       },
//     ],
//   },
//   {
//     fullName: "Dr. Bob Smith",
//     email: "bob.smith@example.com",
//     password: "password123",
//     degree: "PhD in Biotechnology",
//     domains: ["Biotechnology & Life Sciences", "Healthcare & Medicine"],
//     grants: "Grant-B2",
//     collaborations: "Dr. Alice Johnson",
//     cvFile: "uploads/researcher/cv/cv-bob.pdf",
//     linkedin: "https://linkedin.com/in/bobsmith",
//     scopus: "https://scopus.com/bobsmith",
//     googleScholar: "https://scholar.google.com/bobsmith",
//     transcripts: {
//       "PhD in Biotechnology": "uploads/researcher/transcripts/transcript-bob-phd.pdf",
//     },
//     researches: [
//       {
//         title: "Biotech in Medicine",
//         description: "Using biotechnology for advanced healthcare solutions.",
//         domains: ["Biotechnology & Life Sciences", "Healthcare & Medicine"],
//         status: "Current",
//       },
//       {
//         title: "Genetic Engineering Ethics",
//         description: "Ethics of genetic modification.",
//         domains: ["Biotechnology & Life Sciences"],
//         status: "Pending",
//       },
//     ],
//   },
//   {
//     fullName: "Dr. Clara Zhang",
//     email: "clara.zhang@example.com",
//     password: "password123",
//     degree: "PhD in Agriculture",
//     domains: ["Agriculture & Food Security"],
//     grants: "Grant-C3",
//     collaborations: "Dr. David Lee",
//     cvFile: "uploads/researcher/cv/cv-clara.pdf",
//     linkedin: "https://linkedin.com/in/clarazhang",
//     scopus: "https://scopus.com/clarazhang",
//     googleScholar: "https://scholar.google.com/clarazhang",
//     transcripts: {
//       "PhD in Agriculture": "uploads/researcher/transcripts/transcript-clara-phd.pdf",
//     },
//     researches: [
//       {
//         title: "Sustainable Farming Techniques",
//         description: "Techniques for sustainable farming practices.",
//         domains: ["Agriculture & Food Security"],
//         status: "Finished",
//         feasibility: "Feasible",
//       },
//       {
//         title: "Soil Health Analysis",
//         description: "Impact of crop rotation on soil health.",
//         domains: ["Agriculture & Food Security"],
//         status: "Pending",
//       },
//     ],
//   },
//   {
//     fullName: "Dr. David Lee",
//     email: "david.lee@example.com",
//     password: "password123",
//     degree: "PhD in Renewable Energy",
//     domains: ["Engineering & Technology", "Information Technology"],
//     grants: "Grant-D4",
//     collaborations: "Dr. Clara Zhang",
//     cvFile: "uploads/researcher/cv/cv-david.pdf",
//     linkedin: "https://linkedin.com/in/davidlee",
//     scopus: "https://scopus.com/davidlee",
//     googleScholar: "https://scholar.google.com/davidlee",
//     transcripts: {
//       "PhD in Renewable Energy": "uploads/researcher/transcripts/transcript-david-phd.pdf",
//     },
//     researches: [
//       {
//         title: "Solar Energy Optimization",
//         description: "Improving efficiency of solar panels.",
//         domains: ["Engineering & Technology", "Information Technology"],
//         status: "Current",
//       },
//       {
//         title: "Smart Grid Integration",
//         description: "Integrating renewable energy into smart grids.",
//         domains: ["Engineering & Technology"],
//         status: "Pending",
//       },
//     ],
//   },
//   {
//     fullName: "Dr. Emma Wilson",
//     email: "emma.wilson@example.com",
//     password: "password123",
//     degree: "PhD in Environmental Science",
//     domains: ["Environmental Science & Climate"],
//     grants: "Grant-E5",
//     collaborations: "Dr. Clara Zhang",
//     cvFile: "uploads/researcher/cv/cv-emma.pdf",
//     linkedin: "https://linkedin.com/in/emmawilson",
//     scopus: "https://scopus.com/emmawilson",
//     googleScholar: "https://scholar.google.com/emmawilson",
//     transcripts: {
//       "PhD in Environmental Science": "uploads/researcher/transcripts/transcript-emma-phd.pdf",
//     },
//     researches: [
//       {
//         title: "Climate Change Impact Assessment",
//         description: "Assessing climate change impact on coastal ecosystems.",
//         domains: ["Environmental Science & Climate"],
//         status: "Finished",
//         feasibility: "Feasible",
//       },
//     ],
//   },
// ];

// const seedResearchers = async () => {
//   try {
//     await connectDB();

//     console.log("\n🗑️  Clearing existing data...");
//     await Researcher.deleteMany();
//     await Research.deleteMany();

//     for (const r of researchersData) {
//       console.log(`\n📝 Creating researcher: ${r.fullName}`);
      
//       const hashedPassword = await bcrypt.hash(r.password, 10);

//       const researcher = new Researcher({
//         fullName: r.fullName,
//         email: r.email,
//         password: hashedPassword,
//         degree: r.degree,
//         domains: r.domains,
//         grants: r.grants,
//         collaborations: r.collaborations,
//         cvFile: r.cvFile,
//         linkedin: r.linkedin,
//         scopus: r.scopus,
//         googleScholar: r.googleScholar,
//         transcripts: r.transcripts,
//         researches: [],
//       });

//       await researcher.save();
//       console.log(`  ✅ Researcher saved: ${researcher.fullName}`);

//       // Create researches for this researcher
//       for (const res of r.researches) {
//         const research = new Research({
//           title: res.title,
//           description: res.description,
//           domains: res.domains,
//           researcher: researcher._id,
//           status: res.status || "Pending",
//           feasibility: res.feasibility || null,
//         });
        
//         await research.save();
//         researcher.researches.push(research._id);
//         console.log(`    ✅ Research created: ${research.title} (${research.status})`);
//       }

//       await researcher.save();
//     }

//     console.log("\n🎉 Researchers seeding completed successfully!\n");
//     process.exit(0);
//   } catch (error) {
//     console.error("\n❌ Seeding error:", error);
//     process.exit(1);
//   }
// };

// seedResearchers();


import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import Researcher from "../models/Researcher.js";
import Research from "../models/Research.js";

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("Mongo URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

const researchersData = [
  {
    fullName: "Dr. Alice Johnson",
    email: "alice.johnson@example.com",
    password: "password123",
    degree: "PhD in AI",
    domains: ["Information Technology", "Healthcare & Medicine"],
    grants: "Grant-A1",
    collaborations: "Dr. Bob Smith",
    cvFile: "uploads/researcher/cv/cv-alice.pdf",
    linkedin: "https://linkedin.com/in/alicejohnson",
    scopus: "https://scopus.com/alicejohnson",
    googleScholar: "https://scholar.google.com/alicejohnson",
    transcripts: {
      "PhD in AI": "uploads/researcher/transcripts/transcript-alice-phd.pdf",
    },
    profileImage: "uploads/researcher/profile/alice.jpg",
    skills: ["Artificial Intelligence", "Machine Learning", "Data Analysis"],
    awards: ["Best Researcher 2023", "AI Innovation Grant"],
    researches: [
      {
        title: "AI for Healthcare Diagnostics",
        description: "Research on AI-based diagnosis systems for healthcare.",
        domains: ["Information Technology", "Healthcare & Medicine"],
        status: "Finished",
        feasibility: "Feasible",
      },
      {
        title: "AI Ethics in Medical Systems",
        description: "Exploring ethical considerations in AI systems.",
        domains: ["Information Technology"],
        status: "Current",
      },
    ],
  },
  {
    fullName: "Dr. Bob Smith",
    email: "bob.smith@example.com",
    password: "password123",
    degree: "PhD in Biotechnology",
    domains: ["Biotechnology & Life Sciences", "Healthcare & Medicine"],
    grants: "Grant-B2",
    collaborations: "Dr. Alice Johnson",
    cvFile: "uploads/researcher/cv/cv-bob.pdf",
    linkedin: "https://linkedin.com/in/bobsmith",
    scopus: "https://scopus.com/bobsmith",
    googleScholar: "https://scholar.google.com/bobsmith",
    transcripts: {
      "PhD in Biotechnology": "uploads/researcher/transcripts/transcript-bob-phd.pdf",
    },
    profileImage: "uploads/researcher/profile/bob.jpg",
    skills: ["Genetic Engineering", "Lab Research", "Medical Biotechnology"],
    awards: ["Biotech Excellence Award"],
    researches: [
      {
        title: "Biotech in Medicine",
        description: "Using biotechnology for advanced healthcare solutions.",
        domains: ["Biotechnology & Life Sciences", "Healthcare & Medicine"],
        status: "Current",
      },
      {
        title: "Genetic Engineering Ethics",
        description: "Ethics of genetic modification.",
        domains: ["Biotechnology & Life Sciences"],
        status: "Pending",
      },
    ],
  },
  {
    fullName: "Dr. Clara Zhang",
    email: "clara.zhang@example.com",
    password: "password123",
    degree: "PhD in Agriculture",
    domains: ["Agriculture & Food Security"],
    grants: "Grant-C3",
    collaborations: "Dr. David Lee",
    cvFile: "uploads/researcher/cv/cv-clara.pdf",
    linkedin: "https://linkedin.com/in/clarazhang",
    scopus: "https://scopus.com/clarazhang",
    googleScholar: "https://scholar.google.com/clarazhang",
    transcripts: {
      "PhD in Agriculture": "uploads/researcher/transcripts/transcript-clara-phd.pdf",
    },
    profileImage: "uploads/researcher/profile/clara.jpg",
    skills: ["Crop Science", "Soil Analysis", "Sustainable Agriculture"],
    awards: ["Agriculture Research Fellowship"],
    researches: [
      {
        title: "Sustainable Farming Techniques",
        description: "Techniques for sustainable farming practices.",
        domains: ["Agriculture & Food Security"],
        status: "Finished",
        feasibility: "Feasible",
      },
      {
        title: "Soil Health Analysis",
        description: "Impact of crop rotation on soil health.",
        domains: ["Agriculture & Food Security"],
        status: "Pending",
      },
    ],
  },
  {
    fullName: "Dr. David Lee",
    email: "david.lee@example.com",
    password: "password123",
    degree: "PhD in Renewable Energy",
    domains: ["Engineering & Technology", "Information Technology"],
    grants: "Grant-D4",
    collaborations: "Dr. Clara Zhang",
    cvFile: "uploads/researcher/cv/cv-david.pdf",
    linkedin: "https://linkedin.com/in/davidlee",
    scopus: "https://scopus.com/davidlee",
    googleScholar: "https://scholar.google.com/davidlee",
    transcripts: {
      "PhD in Renewable Energy": "uploads/researcher/transcripts/transcript-david-phd.pdf",
    },
    profileImage: "uploads/researcher/profile/david.jpg",
    skills: ["Renewable Systems", "Smart Grids", "Solar Energy"],
    awards: ["Green Tech Research Award"],
    researches: [
      {
        title: "Solar Energy Optimization",
        description: "Improving efficiency of solar panels.",
        domains: ["Engineering & Technology", "Information Technology"],
        status: "Current",
      },
      {
        title: "Smart Grid Integration",
        description: "Integrating renewable energy into smart grids.",
        domains: ["Engineering & Technology"],
        status: "Pending",
      },
    ],
  },
  {
    fullName: "Dr. Emma Wilson",
    email: "emma.wilson@example.com",
    password: "password123",
    degree: "PhD in Environmental Science",
    domains: ["Environmental Science & Climate"],
    grants: "Grant-E5",
    collaborations: "Dr. Clara Zhang",
    cvFile: "uploads/researcher/cv/cv-emma.pdf",
    linkedin: "https://linkedin.com/in/emmawilson",
    scopus: "https://scopus.com/emmawilson",
    googleScholar: "https://scholar.google.com/emmawilson",
    transcripts: {
      "PhD in Environmental Science": "uploads/researcher/transcripts/transcript-emma-phd.pdf",
    },
    profileImage: "uploads/researcher/profile/emma.jpg",
    skills: ["Climate Modeling", "Sustainability", "Ecosystem Studies"],
    awards: ["Climate Science Excellence Medal"],
    researches: [
      {
        title: "Climate Change Impact Assessment",
        description: "Assessing climate change impact on coastal ecosystems.",
        domains: ["Environmental Science & Climate"],
        status: "Finished",
        feasibility: "Feasible",
      },
    ],
  },
];

const seedResearchers = async () => {
  try {
    await connectDB();

    console.log("\n🗑️  Clearing existing data...");
    await Researcher.deleteMany();
    await Research.deleteMany();

    for (const r of researchersData) {
      console.log(`\n📝 Creating researcher: ${r.fullName}`);

      const hashedPassword = await bcrypt.hash(r.password, 10);

      const researcher = new Researcher({
        fullName: r.fullName,
        email: r.email,
        password: hashedPassword,
        degree: r.degree,
        domains: r.domains,
        grants: r.grants,
        collaborations: r.collaborations,
        cvFile: r.cvFile,
        linkedin: r.linkedin,
        scopus: r.scopus,
        googleScholar: r.googleScholar,
        transcripts: r.transcripts,
        profileImage: r.profileImage,
        skills: r.skills,
        awards: r.awards,
        researches: [],
      });

      await researcher.save();
      console.log(`  ✅ Researcher saved: ${researcher.fullName}`);

      // Create linked research works
      for (const res of r.researches) {
        const research = new Research({
          title: res.title,
          description: res.description,
          domains: res.domains,
          researcher: researcher._id,
          status: res.status || "Pending",
          feasibility: res.feasibility || null,
        });

        await research.save();
        researcher.researches.push(research._id);
        console.log(`    ✅ Research created: ${research.title} (${research.status})`);
      }

      await researcher.save();
    }

    console.log("\n🎉 Researchers seeding completed successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding error:", error);
    process.exit(1);
  }
};

seedResearchers();

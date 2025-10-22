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

// --- CLI args parsing (no external deps) ---
const argv = (() => {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) {
      const key = a.replace(/^--/, "");
      const next = args[i + 1];
      if (!next || next.startsWith("--")) {
        out[key] = true;
      } else {
        out[key] = next;
        i++;
      }
    }
  }
  return out;
})();

const MODE = (argv.mode || "upsert").toLowerCase(); // upsert|append|reset
const SOURCE_COLLECTION = argv.sourceCollection || "users"; // source collection name
const RESEARCH_COLLECTION = argv.researchCollection || null; // optional separate research collection
const RESEARCH_FK = (argv.researchFk || "email").toLowerCase(); // email|id
const DRY_RUN = Boolean(argv["dry-run"] || argv.dry || false);
const FORCE_YES = Boolean(argv.yes || false);
const LIMIT = argv.limit ? parseInt(argv.limit, 10) : 0;
let SOURCE_QUERY = {};
if (argv.query) {
  try { SOURCE_QUERY = JSON.parse(argv.query); } catch { console.warn("⚠️  --query is not valid JSON; ignoring"); }
}

const TARGET_URI = process.env.MONGO_URI;
const SOURCE_URI = process.env.SOURCE_MONGO_URI || TARGET_URI;

if (!TARGET_URI) {
  console.error("❌ Missing MONGO_URI for target DB");
  process.exit(1);
}

if (MODE === "reset" && !FORCE_YES && !DRY_RUN) {
  console.error("❌ --mode reset requires --yes to proceed (destructive)");
  process.exit(1);
}

const connect = async (uri, label) => {
  try {
    const conn = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).asPromise();
    console.log(`✅ Connected to ${label}`);
    return conn;
  } catch (err) {
    console.error(`❌ Connection error (${label}):`, err.message);
    process.exit(1);
  }
};

const hashPasswordOrDefault = async (raw) => {
  const pwd = raw && String(raw).length >= 6 ? String(raw) : "ChangeMe123!";
  return bcrypt.hash(pwd, 10);
};

const mapResearcher = async (src) => {
  // Minimal, safe mapping with fallbacks
  const fullName = src.fullName || src.name || `${src.firstName || ""} ${src.lastName || ""}`.trim();
  const email = (src.email || "").toLowerCase();
  const department = src.department || src.dept || "General"; // required in schema
  const passwordHash = await hashPasswordOrDefault(src.password);

  return {
    fullName,
    email,
    password: passwordHash,
    department,
    isActive: src.isActive !== undefined ? !!src.isActive : true,
    degree: src.degree || src.highestDegree || undefined,
    domains: Array.isArray(src.domains) ? src.domains.slice(0, 3) : (src.domains ? [src.domains].slice(0, 3) : []),
    grants: src.grants || undefined,
    collaborations: src.collaborations || undefined,
    profilePhoto: src.profilePhoto || src.avatar || undefined,
    cvFile: src.cvFile || src.cv || undefined,
    transcripts: src.transcripts || {},
    linkedin: src.linkedin || undefined,
    scopus: src.scopus || undefined,
    googleScholar: src.googleScholar || src.google_scholar || undefined,
    skills: Array.isArray(src.skills) ? src.skills : [],
    awards: Array.isArray(src.awards) ? src.awards : [],
    qualifications: Array.isArray(src.qualifications) ? src.qualifications : [],
  };
};

const fetchResearchItems = (srcDoc, researchCol, researcherEmail) => {
  // Prefer embedded list if present
  if (Array.isArray(srcDoc.researches) && srcDoc.researches.length) {
    return Promise.resolve(srcDoc.researches);
  }
  if (!researchCol) return Promise.resolve([]);
  if (RESEARCH_FK === "email") {
    return researchCol.find({ researcherEmail }).toArray();
  }
  // RESEARCH_FK === 'id' (match by source _id)
  return researchCol.find({ researcherId: String(srcDoc._id) }).toArray();
};

const upsertResearch = async ({ researcherId, item, dryRun }) => {
  const filter = { title: item.title, researcher: researcherId };
  const update = {
    $set: {
      description: item.description || "",
      domains: Array.isArray(item.domains) ? item.domains : (item.domains ? [item.domains] : []),
      status: item.status || "Pending",
      feasibility: item.feasibility || null,
    },
    $setOnInsert: { researcher: researcherId },
  };
  if (dryRun) return { acknowledged: true, upsertedId: null };
  return Research.findOneAndUpdate(filter, update, { upsert: true, new: true }).lean();
};

const run = async () => {
  console.log("\n▶️  Migrator starting with mode:", MODE);
  console.log("   Source URI:", SOURCE_URI ? "set" : "missing");
  console.log("   Target URI:", TARGET_URI ? "set" : "missing");
  console.log("   Source collection:", SOURCE_COLLECTION);
  if (RESEARCH_COLLECTION) console.log("   Research collection:", RESEARCH_COLLECTION, `(fk=${RESEARCH_FK})`);
  if (DRY_RUN) console.log("   DRY RUN enabled (no writes)");

  // Connections
  const sourceConn = await connect(SOURCE_URI, "SOURCE DB");
  const targetConn = await connect(TARGET_URI, "TARGET DB");
  const sourceDb = sourceConn.db;
  const sourceCol = sourceDb.collection(SOURCE_COLLECTION);
  const researchCol = RESEARCH_COLLECTION ? sourceDb.collection(RESEARCH_COLLECTION) : null;

  // Destructive mode
  if (MODE === "reset") {
    console.log("\n🗑️  Reset mode: clearing target collections Researcher and Research");
    if (!DRY_RUN) {
      await targetConn.model("Researcher", Researcher.schema).deleteMany();
      await targetConn.model("Research", Research.schema).deleteMany();
    }
  }

  // Fetch source docs
  let cursor = sourceCol.find(SOURCE_QUERY || {});
  if (LIMIT > 0) cursor = cursor.limit(LIMIT);
  const total = await cursor.count();
  console.log(`\n📦 Source documents to process: ${total}${LIMIT > 0 ? ` (limited to ${LIMIT})` : ""}`);

  // Use target models bound to target connection
  const TargetResearcher = targetConn.model("Researcher", Researcher.schema);
  const TargetResearch = targetConn.model("Research", Research.schema);

  let processed = 0, created = 0, updated = 0, researchLinked = 0;

  for await (const src of cursor) {
    processed++;
    const email = (src.email || "").toLowerCase();
    if (!email) {
      console.warn(`⚠️  Skipping source doc without email: _id=${src._id}`);
      continue;
    }

    const mapped = await mapResearcher(src);

    const existing = await TargetResearcher.findOne({ email }).select("_id email").lean();
    if (!existing) {
      if (DRY_RUN) {
        created++;
        console.log(`+ would create researcher: ${mapped.fullName} <${email}>`);
      } else {
        const doc = new TargetResearcher(mapped);
        await doc.save();
        created++;
        console.log(`✅ created researcher: ${mapped.fullName} <${email}>`);
      }
    } else {
      if (MODE === "append") {
        console.log(`↩️  exists (append mode): ${email}`);
      } else {
        if (DRY_RUN) {
          updated++;
          console.log(`~ would update researcher: ${email}`);
        } else {
          await TargetResearcher.updateOne({ _id: existing._id }, { $set: { ...mapped, password: undefined } });
          updated++;
          console.log(`🛠️  updated researcher: ${email}`);
        }
      }
    }

    // Resolve current target _id (for linking)
    const targetResearcher = existing || (DRY_RUN ? { _id: null } : await TargetResearcher.findOne({ email }).select("_id").lean());

    // Link research items
    const items = await fetchResearchItems(src, researchCol, email);
    if (items && items.length) {
      for (const item of items) {
        if (!item || !item.title) continue;
        if (DRY_RUN) {
          researchLinked++;
          console.log(`  + would upsert research: ${item.title}`);
          continue;
        }
        const resDoc = await TargetResearch.findOneAndUpdate(
          { title: item.title, researcher: targetResearcher._id },
          {
            $set: {
              description: item.description || "",
              domains: Array.isArray(item.domains) ? item.domains : (item.domains ? [item.domains] : []),
              status: item.status || "Pending",
              feasibility: item.feasibility || null,
            },
            $setOnInsert: { researcher: targetResearcher._id },
          },
          { upsert: true, new: true }
        );
        researchLinked++;
        console.log(`  🔗 upserted research: ${resDoc.title}`);
      }
    }
  }

  console.log("\n✅ Migration complete.");
  console.log(`   processed: ${processed}`);
  console.log(`   created:   ${created}`);
  console.log(`   updated:   ${updated}`);
  console.log(`   research:  ${researchLinked} linked/upserted`);

  await sourceConn.close();
  await targetConn.close();
  process.exit(0);
};

run().catch((e) => {
  console.error("❌ Migration failed:", e);
  process.exit(1);
});

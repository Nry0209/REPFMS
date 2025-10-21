import 'dotenv/config';
import mongoose from 'mongoose';
import Researcher from '../models/Researcher.js';
import Research from '../models/Research.js';

async function main() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!uri) {
    console.error('Missing MONGO_URI in environment');
    process.exit(1);
  }
  console.log('Connecting to MongoDB:', uri.split('@').pop());
  await mongoose.connect(uri, { dbName: process.env.DB_NAME || undefined });

  try {
    // Pick up to 4 researchers to attach sample researches
    const researchers = await Researcher.find({}).limit(4).lean();
    if (researchers.length === 0) {
      console.log('No researchers found. Seed researchers first.');
      return;
    }

    const samples = [];
    for (const r of researchers) {
      const rDomains = Array.isArray(r.domains) && r.domains.length ? r.domains.slice(0, 3) : ['Information Technology'];

      // Pending research (for supervision discovery)
      samples.push({
        title: `${r.fullName.split(' ')[0]}: Emerging Trends in ${rDomains[0]}`,
        description: `Exploration of current trends in ${rDomains.join(', ')}.`,
        domains: rDomains,
        researcher: r._id,
        status: 'Pending',
      });

      // Current research (for dashboard Active)
      samples.push({
        title: `${r.fullName.split(' ')[0]}: Applied ${rDomains[0]} Study`,
        description: `Applied research within ${rDomains.join(', ')} domain(s).`,
        domains: rDomains,
        researcher: r._id,
        status: 'Current',
      });

      // Finished research (for funding flow testing)
      samples.push({
        title: `${r.fullName.split(' ')[0]}: ${rDomains[0]} Outcomes`,
        description: `Final outcomes and evaluation within ${rDomains.join(', ')}.`,
        domains: rDomains,
        researcher: r._id,
        status: 'Finished',
        feasibility: Math.random() > 0.5 ? 'Feasible' : 'Not Feasible',
      });
    }

    // Insert samples and attach to researchers
    const inserted = await Research.insertMany(samples);
    const byResearcher = new Map();
    for (const doc of inserted) {
      const arr = byResearcher.get(String(doc.researcher)) || [];
      arr.push(doc._id);
      byResearcher.set(String(doc.researcher), arr);
    }

    for (const [rid, ids] of byResearcher.entries()) {
      await Researcher.updateOne({ _id: rid }, { $addToSet: { researches: { $each: ids } } });
    }

    console.log(`Inserted ${inserted.length} research documents and linked to researchers.`);
  } catch (err) {
    console.error('Seed research error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

main();

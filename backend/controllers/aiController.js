const pdfParse = require('pdf-parse');
const Job = require('../models/Job');
const natural = require('natural');

exports.matchResumeToJobs = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    // Fetch all jobs
    const jobs = await Job.find();

    // Prepare TF-IDF
    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();

    jobs.forEach(job => {
      tfidf.addDocument(job.description + ' ' + job.title + ' ' + job.companyName);
    });

    // Compare resume to each job
    const results = jobs.map((job, idx) => {
      const score = tfidf.tfidf(resumeText, idx);
      return {
        jobId: job._id,
        title: job.title,
        companyName: job.companyName,
        score: score
      };
    });

    // Normalize scores to percentage
    const maxScore = Math.max(...results.map(r => r.score)) || 1;
    const matches = results.map(r => ({
      ...r,
      percent: Math.round((r.score / maxScore) * 100)
    }));

    matches.sort((a, b) => b.percent - a.percent);

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
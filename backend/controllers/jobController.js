const Job = require('../models/Job');

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const recruiterId = req.query.recruiterId;
    const filter = recruiterId ? { recruiter: recruiterId } : {};
    const jobs = await Job.find(filter);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new job
exports.createJob = async (req, res) => {
  console.log('Request body:', req.body); // Log the request body

  const { title, description, companyName, recruiter } = req.body;

  if (!title || !description || !companyName || !recruiter) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const job = new Job({
    title,
    description,
    companyName,
    recruiter,
  });

  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await Job.deleteOne({ _id: req.params.id });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
import React, { useState } from "react";
import { Fab, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleAddJob = () => {
    setShowForm(true);
  };

  const handleSaveJob = () => {
    const newJob = {
      id: jobs.length + 1,
      title: jobTitle,
      description: jobDescription,
    };
    setJobs([...jobs, newJob]);
    setJobTitle("");
    setJobDescription("");
    setShowForm(false);
  };

  const handleDeleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  return (
    <MDBox p={3}>
      <MDTypography variant="h4" fontWeight="medium" mb={3}>
        Recruiter Dashboard
      </MDTypography>
      <Fab color="primary" aria-label="add" onClick={handleAddJob}>
        <AddIcon />
      </Fab>
      {showForm && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6">Add Job</Typography>
            <TextField
              label="Job Title"
              fullWidth
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Job Description"
              fullWidth
              multiline
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveJob}
              sx={{ mt: 2 }}
              disabled={!jobTitle || !jobDescription} // Disable button if fields are empty
            >
              Save
            </Button>
          </CardContent>
        </Card>
      )}
      {jobs.map((job) => (
        <Card key={job.id} sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6">{job.title}</Typography>
            <Typography variant="body2">{job.description}</Typography>
            <Button variant="contained" color="secondary" onClick={() => handleDeleteJob(job.id)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </MDBox>
  );
};

export default RecruiterDashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Fab, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Fetch jobs from the database when the component mounts
    axios
      .get("http://localhost:5000/api/jobs")
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the jobs!", error);
      });
  }, []);

  const handleAddJob = () => {
    setShowForm(true);
  };

  const handleSaveJob = () => {
    const recruiterId = localStorage.getItem("recruiterId"); // Retrieve recruiter ID from local storage
    if (!recruiterId) {
      console.error("Recruiter ID not found!");
      return;
    }

    const newJob = {
      title: jobTitle,
      description: jobDescription,
      recruiter: recruiterId, // Use the recruiter ID from local storage
    };

    // Save the new job to the database
    axios
      .post("http://localhost:5000/api/jobs", newJob)
      .then((response) => {
        setJobs([...jobs, response.data]);
        setJobTitle("");
        setJobDescription("");
        setShowForm(false);
      })
      .catch((error) => {
        console.error("There was an error saving the job!", error);
      });
  };

  const handleDeleteJob = (id) => {
    // Delete the job from the database
    axios
      .delete(`http://localhost:5000/api/jobs/${id}`)
      .then(() => {
        setJobs(jobs.filter((job) => job._id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the job!", error);
      });
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
        <Card key={job._id} sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6">{job.title}</Typography>
            <Typography variant="body2">{job.description}</Typography>
            <Button variant="contained" color="secondary" onClick={() => handleDeleteJob(job._id)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </MDBox>
  );
};

export default RecruiterDashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const CandidateDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs")
      .then((response) => setJobs(response.data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  const handleFileChange = (event) => setSelectedFile(event.target.files[0]);
  const handleCancel = () => setSelectedFile(null);

  const handleSubmit = (jobId) => {
    if (!selectedFile) {
      console.error("No file selected!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", selectedFile);

    axios
      .post(`http://localhost:5000/api/jobs/${jobId}/apply`, formData)
      .then((response) => {
        console.log("Resume submitted successfully:", response.data);
        setSelectedFile(null);
      })
      .catch((error) => console.error("Error submitting resume:", error))
      .finally(() => setUploading(false));
  };

  return (
    <MDBox p={3}>
      <MDTypography variant="h4" fontWeight="medium" mb={3}>
        Candidate Dashboard
      </MDTypography>
      {jobs.map((job) => (
        <Card key={job._id} sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6">{job.title}</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {job.description}
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <TextField type="file" onChange={handleFileChange} sx={{ mt: 1 }} />
              <Box>
                <IconButton
                  color="primary"
                  onClick={() => handleSubmit(job._id)}
                  sx={{ mt: 1 }}
                  disabled={uploading}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </MDBox>
  );
};

export default CandidateDashboard;

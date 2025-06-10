import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Snackbar,
  LinearProgress,
  Grid,
  Chip,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";

const CandidateDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [matchResults, setMatchResults] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5000/api/jobs");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch jobs");
        setJobs(data);
      } catch (err) {
        setError(err.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setUploadSuccess(false);
      setMatchResults([]);
    } else {
      setError("Please upload a PDF file");
    }
  };

  const handleUpload = async () => {
    if (!resumeFile) {
      setError("Please select a PDF file first");
      return;
    }
    setLoading(true);
    setError(null);
    setUploadSuccess(false);
    setMatchResults([]);
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const res = await fetch("http://localhost:5000/api/ai/analyze-resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to analyze resume");
      setMatchResults(data);
      setUploadSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setUploadSuccess(false);
    setMatchResults([]);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Typography variant="h4" gutterBottom>
          All Job Descriptions
        </Typography>
        <Paper elevation={3} sx={{ p: 2, minWidth: 300 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Upload Your Resume</Typography>
            {resumeFile && (
              <IconButton size="small" onClick={handleRemoveFile}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          {!resumeFile ? (
            <Box>
              <Button variant="outlined" component="label" startIcon={<UploadIcon />} fullWidth>
                Select PDF
                <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
              </Button>
              <Typography variant="caption" color="text.secondary" mt={1} display="block">
                PDF files only
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" mb={2}>
                Selected: {resumeFile.name}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={loading || uploadSuccess}
                fullWidth
              >
                {uploadSuccess ? "Analyzed Successfully" : "Analyze Resume"}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {matchResults.length > 0 && (
        <Box mb={3}>
          <Typography variant="h5" gutterBottom>
            Resume Match Results
          </Typography>
          <Grid container spacing={2}>
            {matchResults.map((result) => (
              <Grid item xs={12} md={6} lg={4} key={result.jobId}>
                <Card elevation={4}>
                  <CardContent>
                    <Typography variant="h6">
                      {result.title} ({result.companyName})
                    </Typography>
                    <Typography color="primary" fontWeight="bold">
                      Match: {result.percent}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {matchResults.length === 0 && (
        <Grid container spacing={3}>
          {jobs.length > 0
            ? jobs.map((job) => (
                <Grid item xs={12} md={6} lg={4} key={job._id}>
                  <Card elevation={4} sx={{ height: "100%" }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                          {job.title}
                        </Typography>
                        <Chip label={job.companyName} color="primary" size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {job.description}
                      </Typography>
                      {job.recruiter && (
                        <Typography variant="caption" color="text.secondary">
                          Recruiter ID: {job.recruiter}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : !loading && (
                <Grid item xs={12}>
                  <Typography>No jobs found.</Typography>
                </Grid>
              )}
        </Grid>
      )}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CandidateDashboard;

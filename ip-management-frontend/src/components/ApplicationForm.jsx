import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { createApplication } from "../services/api";
import "../styles/Form.css";
import "../styles/Buttons.css";

function ApplicationForm({ user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!user || !user.id) {
      setError("You must be logged in to submit an application.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("userId", user.id);
    if (files.length > 0) {
      files.forEach((file) => formData.append("files", file));
    }


    try {
      const res = await createApplication(formData);
      console.log("Application submitted:", res.data);
      setMessage("Application submitted successfully!");
      // Clear form
      setTitle("");
      setDescription("");
      setFiles([]);
      e.target.reset(); // Reset file input
    } catch (err) {
      console.error(err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", err.response.data);
        console.error("Error status:", err.response.status);
        console.error("Error headers:", err.response.headers);
        const errorMsg = (err.response.data && (err.response.data.message || err.response.data)) || "An unexpected error occurred.";
        setError(`Failed to submit application: ${errorMsg}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Error request:", err.request);
        setError("Failed to submit application: No response from server. Is the backend running?");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', err.message);
        setError(`Failed to submit application: ${err.message}`);
      }
    }
  };

  return (
    <div className="form-container">
        <div className="back-link-container">
            <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Submit New Application</h2>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
            <label>Title:</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
            <label>Files:</label>
            <input type="file" multiple onChange={handleFileChange} />
        </div>
        <button type="submit">Submit Application</button>
        </form>
    </div>
  );
}

export default ApplicationForm;
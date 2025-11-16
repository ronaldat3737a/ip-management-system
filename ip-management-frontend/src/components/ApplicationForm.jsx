import React, { useState } from "react";
import axios from "axios";

function ApplicationForm({ userId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("userId", userId);
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await axios.post("http://localhost:8080/api/applications", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Application submitted:", res.data);
      alert("Application submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit application");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
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
  );
}

export default ApplicationForm;

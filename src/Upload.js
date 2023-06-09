import React, { useState } from 'react';
import { uploadFile } from 'react-s3';
import AWS from 'aws-sdk';
import { Button, Container, Divider, IconButton, Paper, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';


const myBucket = new AWS.S3({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  sessionToken:TOKEN,
  Bucket: S3_BUCKET,
  region: 'us-east-1',
});



const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fullName, setFullName] = useState("");
  const [website, setWebsite] = useState("");

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  

  const handleUpload = () => {
    if (!selectedFile) return;

    const fileName = `${Date.now()}-${selectedFile.name}`;
    const params = {
      ACL: 'public-read',
      Bucket: 'mypicturesbucket',
      Key: fileName,
      ContentType: 'image/jpeg',
      Body: selectedFile,
    };

    myBucket.putObject(params)
      .on('httpUploadProgress', (evt) => { })
      .send((err) => {
        if (err) {
          console.log(err);
        } else {
          toast.success('Image uploaded successfully!');
        }

      });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, marginTop: "3%" }}>

        <Container maxWidth="sm">
          <Paper style={{ padding: '20px' }} elevation={7}>
            <Typography variant='h6'>Upload Photo</Typography>
            <Divider />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CloudUploadIcon style={{ height: "200px", width: "200px", marginTop: "5%", color: "#DDDDDD" }} />
            </div>
            {preview && (
              <img src={preview} alt="preview" style={{ maxWidth: '100%', marginBottom: '20px' }} />
            )}
            <div style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
              <Typography variant='h6'>Select a photo to verify!</Typography>
            </div>


            <div style={{ display: "flex", justifyContent: "center", marginTop: "2%" }}>
              <Button variant="contained" component="label" sx={{mr: 1}}>
                Upload
                <input hidden accept="image/*" multiple type="file" onChange={handleFileInput} />
              </Button>
              <Button variant="contained" component="label" color='success' onClick={handleUpload} disabled={!selectedFile} endIcon={<TaskAltIcon />}>
                Submit
              </Button>
            </div>
            <ToastContainer position="bottom-center" style={{ background: "", color: "#F8E9D6" }} />
          </Paper>
        </Container>
      </div>

    </div>
  );


};

export default UploadImage;

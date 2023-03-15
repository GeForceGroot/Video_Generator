import React from 'react'
import { useState } from 'react';
import axios from 'axios';
// import CategorySelect from './CategorySelect';
// import { CategoryID, folderName } from './CategorySelect';
import { useLocation } from 'react-router-dom';
import { useHistory } from "react-router-dom";

const UploadImage = (props) => {

  const [selectedFiles, setSelectedFiles] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [text, setText] = useState('');
  const [selectedAudio, setSelectedAudio] = useState('');
  const [fps, setFps] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [images, setImages] = useState([]);
  const [framerate, setFramerate] = useState('30');
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [videoUrl, setVideoUrl] = useState(null);

  const location = useLocation();
  // const history = useHistory();
  const categoryId = location.state.categoryId;
  const folderName = location.state.folderName;

  const handleUpload = async () => {

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    try {
      const response = await axios.post(`http://localhost:8000/allCategories/${categoryId}/folders/${folderName}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadStatus(response.data);

    } catch (error) {
      console.log('Error uploading images', error);
      setUploadStatus('Error uploading images');
    }
  }
  const handleFileSelect = (event) => {
    setSelectedFiles(event.target.files);
  };


  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleFpsChange = (event) => {
    setFps(event.target.value);
  };

  const handleHeightChange = (event) => {
    setHeight(event.target.value);
  };

  const handleWidthChange = (event) => {
    setWidth(event.target.value);
  };
  const handleFramerateChange = (event) => {
    setFramerate(event.target.value);
  }
  const handleOutputFormatChange = (event) => {
    setOutputFormat(event.target.value);
  }




  const handleGetCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/allCategories');
      setCategories(response.data);
    } catch (error) {
      console.log('Error getting categories', error);
    }
  };


  const handleConvertClick = () => {

    // Send a POST request to server to convert text

    axios.post(`http://localhost:8000/allCategories/${categoryId}/folders/${folderName}/tts`, {
      category: categoryId,
      folder: folderName,
      text: text
    })
      .then(response => {
        console.log('Conversion successful', response.data);

        // Clear text input

        setText('');
      })
      .catch(error => console.log('Error converting text', error));
  }
  const handleAudioSelect = (event) => {
    setSelectedAudio(event.target.files[0]);
  };
  const handleVideoGen = (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    formData.append('framerate', framerate);
    formData.append('outputFormat', outputFormat);
    
    axios.post(`http://localhost:8000/allCategories/${categoryId}/folders/${folderName}/generateVideo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      setVideoUrl(URL.createObjectURL(response.data));
    }).catch((error) => {
      console.error(error);
    });
  }



  return (
    <>
      <div className="container" id='mainPage'>
        <div className="container" id='secat1'>
          <div className="uploadImage text-center">
            <div className="contaier text-center my-5" id='upImg'>
              <div className="container text-center my-5">
                <div className="card my-5" id='uploadImg'>
                  <img src="https://media.istockphoto.com/id/468616451/photo/abstract-background-defocused-green-and-blue.jpg?s=612x612&w=0&k=20&c=DLYcr3yaWPX0ZXvQG_Yy3PxvG1D1ubV-57FO2Al_-WY=" height='225' className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Upload Images here...</h5>
                    <p className="card-text">Choose Images form your storage nad upload using upload button.</p>
                    <div className="input-group mb-3" id='chooseFile'>
                      <input className="form-control mx-3" id="images" type="file" multiple onChange={handleFileSelect} />
                      <button className="input-group-text" id='loadUp' onClick={handleUpload}>Upload Images</button>
                    </div>
                    <p>{uploadStatus}</p>
                    <button onClick={handleGetCategories} id='upImgLoad'>Refresh Categories</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="contanier my-5 " id='textIn'>
          <div className="container" >
            <div className="mb-3 my-4" >
              <label htmlFor="text-input" className="form-label" id='EnterText' >Enter text here...</label>
              <textarea className="form-control" id="text-input" rows="10" value={text} onChange={handleTextChange}></textarea>
            </div>
            <button onClick={handleConvertClick} className="btn btn-primary " id='converText'>Upload Text...</button>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="audio-input" className="form-label" id='selectAudio'>Select an audio file</label>
        <input className="form-control" id="audio-input" type="file" accept="audio/*" onChange={handleAudioSelect} />
        <div className="mb-3">
          <div className="text-center">
          <label htmlFor="fps">FPS:</label>
          <input type="number" value={framerate} onChange={handleFramerateChange} />

          <label>
          Output Format:
          <select value={outputFormat} onChange={handleOutputFormatChange}>
            <option value="mp4">MP4</option>
            <option value="webm">WebM</option>
            <option value="gif">GIF</option>
          </select>
        </label>
      <label htmlFor="width">Width:</label>
      <input type="text" name="width" value={width} onChange={handleWidthChange} /><br />
            <button className="btn btn-primary" onClick={handleVideoGen} id='genVid'>Generate Video</button>
            {videoUrl && <video src={videoUrl} controls />}
          </div>
        </div>
      </div>
    </>
  )
}

export default UploadImage;


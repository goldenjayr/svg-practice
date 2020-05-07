import React, {useState} from 'react'
import axios from 'axios'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleUploadFile = async (event) => {
    const formData = new FormData()

    formData.append('file', file);
    try {
      const res = await axios.post('/upload', formData)

      const { fileName, file } = res.data
      console.log("handleUploadFile -> res", res)
      setUploadedFile({ fileName, file })

    } catch (err) {
      console.log('Error: ', err)
    }
  }

  return (
    <div>
      <h2>Upload File</h2>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUploadFile}>Upload</button>
      </div>
      {
        uploadedFile ? (
          <div>
            <h3>{uploadedFile.fileName}</h3>
            <img src={uploadedFile.filePath}/>
          </div>
        ) : null
      }
    </div>
  )
}
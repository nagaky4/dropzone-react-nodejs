import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import request from "superagent";
import "./Dropzone.css";

const apiBaseUrl = "http://localhost:3000";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box"
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden"
};

const img = {
  display: "block",
  width: "auto",
  height: "100%"
};

function Dropzone(props) {
  const [files, setFiles] = useState([]);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    paramName: "imgUpload",
    accept: "image/*",
    onDrop: acceptedFiles => {

      setFiles(
        acceptedFiles.map(file => {
          return Object.assign(file, {
            preview: URL.createObjectURL(file)
          });
        })
      );

      var req = request.post(apiBaseUrl + "/upload");
      req.attach("imgUpload", acceptedFiles[0]);
      req.end(function(err, res) {
        if (err) {
          console.log("error ocurred");
        }
        console.log("res", res);
        alert("File printing completed");
      });

    }
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} alt="" />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input name="imgUpload" {...getInputProps()} />
        {isDragActive ? (
          <p>Drop it like it's hot!</p>
        ) : (
          <p>Click me or drag a file to upload!</p>
        )}
        {isDragReject && "File type not accepted, sorry!"}
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
}

export default Dropzone;

//
// axios
//       .post("http://localhost:3000/upload", acceptedfile)
//       .then(res => {
//         console.log(res);
//       })
//       .catch(err => {
//         console.log(err);
//       });

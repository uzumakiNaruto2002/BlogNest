import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    ['link', 'image'],
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                       // remove formatting button'
  ]
};

const CreatePost = () => {

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setReadirect] = useState(false);

  const createNewPost = async (e) => {
      e.preventDefault();
      
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('file', files[0]);
      
      const response = await fetch("http://localhost:4000/post", {
          method: 'POST',
          body: data,
          credentials: 'include',
      })

      if(response.ok){
        setReadirect(true);
      }
      else{
        alert("Please Login to create the post");
      }
  }

  if(redirect){
      return < Navigate to = {'/'} />
  }

  return (
      <form onSubmit={createNewPost}>
        <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Title'
        />
        <input 
            type="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder='Summary'
        />
        <input 
            type="file" 
            onChange={(e) => setFiles(e.target.files)}
        />
        <ReactQuill 
            value={content}
            onChange={newValue => setContent(newValue)}
            modules={modules}
        />
        <button style={{marginTop: '10px'}} type="submit">Create post</button>
      </form>
  )
}

export default CreatePost
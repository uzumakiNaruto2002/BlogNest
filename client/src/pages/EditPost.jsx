import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate, useParams } from 'react-router-dom';



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

const EditPost = () => {

    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setReadirect] = useState(false);

    useEffect(() => {
        fetch('http://localhost:4000/post/'+id)
            .then(response => {
                response.json().then(postInfo => {
                    setTitle(postInfo.title);
                    setSummary(postInfo.summary);
                    setContent(postInfo.content);

                })
            })
    }, [])

    const updatePost = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if(files?.[0]){
            data.set('file', files?.[0]);
        }
        const response = await fetch("http://localhost:4000/post", {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });

        if(response.ok){
            setReadirect(true);
        }
        else{
            alert("You are not the owner, You can not update the blog")
        }
    }

    if(redirect){
        return < Navigate to = {'/post/'+ id} />
    }
  
    return (
        <form onSubmit={updatePost}>
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
          <button style={{marginTop: '10px'}} type="submit">Update post</button>
        </form>
    )
}

export default EditPost
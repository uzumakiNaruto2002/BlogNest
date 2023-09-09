import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'

const DeletePost = () => {

    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch('http://localhost:4000/post/'+id)
            .then(response => {
                response.json().then(postInfo => {
                    setTitle(postInfo.title);
                    setSummary(postInfo.summary);
                })
            })
    }, [])

    const deletePost = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('id', id);
        const response = await fetch('http://localhost:4000/delete/'+id, {
            method: 'DELETE',
            body: data,
            credentials: 'include',
        })
        console.log(response);
        if(response.ok){
            setRedirect(true);
        }
        else{
            alert("You are not the owner, You can not delete the blog")
        }
    }

    const returnTo = async () => {
        window.history.back();
    }

    if(redirect){
        return < Navigate to = {'/'} />
    }

    return (
        <>
            <h3>Are you sure you want to delete the post</h3>
            <button className='confirm-btn' onClick={deletePost}>Yes</button>
            <button className='confirm-btn' onClick={returnTo}>No</button>
        </>
    )
}

export default DeletePost
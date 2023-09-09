import React from 'react'
import './App.css';
import {formatISO9075} from "date-fns";
import { Link } from 'react-router-dom'

const Post = ({_id,title, summary, content, cover, createdAt, author}) => {
  const datetime = createdAt.split("T");
  const date = datetime[0];
  const time = datetime[1].slice(0,8);
  return (
    <div className="post">
        <div className="image">
          <Link to = {`/post/${_id}`}>
              <img className='init' src={"http://localhost:4000/" +cover} alt="No Image available" />
          </Link>
        </div>
        <div className="texts">
          <Link to = {`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>
            <p className="info">
                <a className="author">{author.username}</a>
                <time>{date} {time}</time>
            </p>
            <p className='summary'>{summary}</p>
        </div>
    </div>
  )
}

export default Post
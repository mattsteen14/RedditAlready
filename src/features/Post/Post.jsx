import { React, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import './Post.css';
import {
  TiMessage
} from 'react-icons/ti';
import {
  PiArrowFatUpLight
} from "react-icons/pi";
import subredditLogo from '../../subredditLogo.svg';
import { toggleComments } from '../../reddit/redditSlice';
import { Avatar } from '../Avatar/Avatar';
import { Comment } from '../Comment/Comment';

export const Post = ({ post }) => {
  const dispatch = useDispatch();
  const [isOverflowing, setIsOverflowing] = useState(false);
  const postBodyRef = useRef(null);
  useEffect(() => {
    const element = postBodyRef.current;
    if (element.scrollHeight > element.clientHeight) {
      setIsOverflowing(true);
    }
  }, [post.selftext]);
  const commentsVisible = useSelector((state) => state.reddit.commentsVisible[post.id]);
  const handleToggleComments = () => {
    dispatch(toggleComments(post.id));
  }
  return (
    <div className='post'>
      <div className='post-header'>
        <div className='post-subreddit-info'>
          <img
            src={post.subreddit_icon || subredditLogo}
            onError={(e) => { e.target.src = subredditLogo }}
            alt={`(${post.subreddit} icon)`}
            className='post-subreddit-icon'
          />
          <span 
          className='post-subreddit-name'
          data-testid={'post-subreddit-name'}
          >
            {post.subreddit_name_prefixed}
          </span>
        </div>

        <span
          className='timestamp'
        >
          {moment(post.created_utc * 1000).fromNow()}
        </span>

        <div className='author-info'>
          <Avatar author={post.author} />
          <span className='author-name'>
            u/{post.author}
          </span>
        </div>

      </div>
      <div className='post-container'>
        <h2 className='post-title'>
          {post.title}
        </h2>
        <p
          className={`post-body ${isOverflowing ? 'has-more-content' : ''}`}
          ref={postBodyRef}
        >
          {post.selftext}
          {isOverflowing &&
            <div className='ellipsis-indicator'>
            </div>}
        </p>
        <div className='post-image-container'>
          <img
            src={post.url}
            alt=""
            className="post-image"
          />
        </div>
      </div>
      <div className='post-footer'>
        <span
        data-testid={`post-score-${post.id}`}
        >
          <PiArrowFatUpLight className='score-icon' />
          {post.score}
        </span>
        <button
          type='button'
          className={'comments-button'}
          onClick={handleToggleComments}
          data-testid={`post-comments-${post.id}`}
        >
          <TiMessage className={`comments-icon ${commentsVisible ? 'active' : ''}`} />
          {post.num_comments}
        </button>
      </div>
      {commentsVisible &&
        <div>
          <Comment permalink={post.permalink}
          />
        </div>
      }
    </div>
  )
}


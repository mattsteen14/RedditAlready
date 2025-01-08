import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import './Header.css';
import { HiOutlineSearch } from "react-icons/hi";
import { FaReddit } from "react-icons/fa";
import { setSearch, delSearch } from '../Search/searchSlice';
import { setView } from '../View/viewSlice';

export const Header = () => {
  const [ searchInputLocal, setSearchInputLocal ] = useState('')
  const dispatch = useDispatch();
  
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(delSearch())
    dispatch(setView('search'))
    dispatch(setSearch(searchInputLocal))
  }
  
  return (
    <header>
        <div className='logo'>
            <FaReddit 
            className='logo-icon'
            role='img'
            />
            <p><span className='reddit-span'>Reddit</span>Already</p>
        </div>
        <form className='search' onSubmit={handleSearch}>
            <input 
            className='search-input'
            type='text' 
            placeholder='Search' 
            aria-label='Search posts'
            value={searchInputLocal}
            onChange={(e) => setSearchInputLocal(e.target.value)} />
            <button type='submit' aria-label='Search'>
                <HiOutlineSearch />
            </button>
        </form>
    </header>
  )
}

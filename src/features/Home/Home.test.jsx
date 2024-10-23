import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { useSelector, useDispatch } from "react-redux";
import { useGetAuthorIconQuery, useGetSubredditPostsQuery } from "../../reddit/redditApiSlice";
import { Home } from "./Home";

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

jest.mock('../../reddit/redditApiSlice', () => ({
    useGetSubredditPostsQuery: jest.fn(),
    useGetAuthorIconQuery: jest.fn(),
}));

// describe('Home Component', () => {
//     beforeEach(() => {
//         useSelector.mockReturnValue('popular');
//     });

test('renders loading state', () => {
    useGetSubredditPostsQuery.mockReturnValue({
        isLoading: true,
        data: null,
        error: null,
        isSuccess: false
    });
    render(<Home />);
    expect(screen.getByTestId('post-loading')).toBeInTheDocument();
});

test('renders error state', () => {
    useGetSubredditPostsQuery.mockReturnValue({
        isLoading: false,
        data: null,
        error: {
            status: 500,
            message: 'Server Error'
        },
        isSuccess: false
    });
    render(<Home />);
    expect(screen.getByText('Failed to load content.')).toBeInTheDocument();
    expect(screen.getByText('Error: 500')).toBeInTheDocument();
    expect(screen.getByText('Server Error')).toBeInTheDocument();
});

test('renders posts on success', () => {
    const mockPosts = [
        {
            id: 1,
            title: 'First Post',
            subreddit: 'popular',
            subreddit_icon: 'https://www.redditstatic.com/desktop2x/img/favicon.ico',
            created_utc: Date.now() / 1000,
            author: 'user1',
            selftext: 'This is some content.',
            url: 'https://www.reddit.com',
            score: 10,
            num_comments: 5,
            // permalink: 'https://www.reddit.com',
            // subreddit_name_prefixed: 'r/popular'
        },
        {
            id: 2,
            title: 'Second Post',
            subreddit: 'popular',
            subreddit_icon: 'https://www.redditstatic.com/desktop2x/img/favicon.ico',
            created_utc: Date.now() / 1000,
            author: 'user2',
            selftext: 'Yes it is.',
            url: 'https://www.reddit.com',
            score: 20,
            num_comments: 10,
            // permalink: 'https://www.reddit.com',
            // subreddit_name_prefixed: 'r/popular'
        },
    ];

    useGetSubredditPostsQuery.mockReturnValue({
        isLoading: false,
        data: mockPosts,
        error: null,
        isSuccess: true
    });

    useGetAuthorIconQuery.mockReturnValue({
        data: { icon_img: 'https://www.redditstatic.com/desktop2x/img/favicon.ico' },
    });

    render(<Home />);

    // Using alternative assertions like alt text and test IDs
    expect(screen.getByText('u/user1')).toBeInTheDocument();
    expect(screen.getByText('u/user2')).toBeInTheDocument();

    // Check for post titles using their alt texts or any other identifiers
    expect(screen.getByText('This is some content.')).toBeInTheDocument();
    expect(screen.getByText('Yes it is.')).toBeInTheDocument();

    // Checking for scores, comments, and subreddit name using data-testid attributes if available
    expect(screen.getByTestId('post-score-1')).toHaveTextContent('10');
    expect(screen.getByTestId('post-score-2')).toHaveTextContent('20');
    expect(screen.getByTestId('post-comments-1')).toHaveTextContent('5');
    expect(screen.getByTestId('post-comments-2')).toHaveTextContent('10');
    // expect(screen.getByTestId('post-subreddit-name')).toHaveTextContent('r/popular');

    // Check the URLs with some identifiers or text
    // expect(screen.getByText('https://www.reddit.com')).toBeInTheDocument();
});
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import Root from './routes/root';
import Game from './routes/game';
import ReactDOM from 'react-dom/client';
import './index.css';

export const apiURI = 'https://api.metern.no';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/game',
    element: <Game />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);

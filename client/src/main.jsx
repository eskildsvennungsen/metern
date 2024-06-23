import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import Root from './routes/root';
import Game from './routes/game';
import ReactDOM from 'react-dom/client';
import './index.css';

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

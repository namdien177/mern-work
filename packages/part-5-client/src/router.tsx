import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
} from 'react-router-dom';
import React, { lazy } from 'react';
import Navbar from './layout/navbar';

const SchedulePage = lazy(() => import('./app/schedule'));
const ScheduleCreatePage = lazy(() => import('./app/schedule/create'));
const ScheduleUpdatePage = lazy(() => import('./app/schedule/update'));
const BlogsPage = lazy(() => import('./app/blogs'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <React.Suspense fallback={<>loading...</>}>
          <Navbar />
          <Outlet />
        </React.Suspense>
      }
    >
      <Route path="/" element={<Navigate to={'/schedule'} />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/schedule/create" element={<ScheduleCreatePage />} />
      <Route path="/schedule/update" element={<ScheduleUpdatePage />} />
      <Route path="/blogs" element={<BlogsPage />} />
    </Route>
  )
);

export default router;

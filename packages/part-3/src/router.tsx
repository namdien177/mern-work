import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
} from 'react-router-dom';
import React, { lazy } from 'react';
import Navbar from './layout/navbar';

const ListUser = lazy(() => import('./app/list-user'));
const GenerateList = lazy(() => import('./app/generate-list'));
const ContactPage = lazy(() => import('./app/contact'));

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
      <Route path="/" element={<ListUser />} />
      <Route path="/generate-list" element={<GenerateList />} />
      <Route path="/contact-form" element={<ContactPage />} />
    </Route>
  )
);

export default router;

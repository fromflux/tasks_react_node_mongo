import React from 'react';
import { Route, Routes } from 'react-router-dom';

import UsersList from './task-manager';
import UserDetail from './user-detail';

export default function Home() {
  return (
    <Routes>
      <Route index element={<UsersList />} />
      <Route path="/:userID" element={<UserDetail />} />
    </Routes>
  );
}

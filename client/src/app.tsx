import React from 'react';
import {
  Routes, Route,
} from 'react-router-dom';

import './theme/reset.css';
import './theme/globals.css';

import styles from './app.module.css';

import NotFound from './routes/not-found';
import TaskManager from './routes/task-manager';

export default function App() {
  return (
    <div className={styles.app}>

      <header className={styles.appHeader}>
        <h1>Task Manager</h1>
      </header>

      <main className={styles.appMain}>

        <Routes>
          <Route path="/" element={<TaskManager />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </main>

      <footer className={styles.appFooter}>
        <nav>Rod Melo 2023</nav>
      </footer>
    </div>
  );
}

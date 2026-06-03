/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BirthdayCard from './components/BirthdayCard';
import AdminCp from './components/AdminCp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BirthdayCard />} />
        <Route path="/admincp" element={<AdminCp />} />
      </Routes>
    </BrowserRouter>
  );
}

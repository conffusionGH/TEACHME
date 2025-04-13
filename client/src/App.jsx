

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Users/Profile';
import SignIn from './pages/Authentication/SignIn';
import Layout from './layout/layout';
import SignUp from './pages/Forms/SignUp';
import RestrictedRoute from './components/RestrictedRoute';
import Managers from './pages/RolesManagement/Managers';
import Teachers from './pages/RolesManagement/Teachers';
import Students from './pages/RolesManagement/Students';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/sign-in" element={<SignIn />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />

            {/* Restricted to admin/manager only */}
            <Route element={<RestrictedRoute allowedRoles={['admin', 'manager']} />}>
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/managers" element={<Managers />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/students" element={<Students />} />

            </Route>

            {/* Add other protected routes here */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
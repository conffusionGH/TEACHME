import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Users/Profile';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Layout from './layout/layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp/>} />
          <Route path='/about' element={<About />} />
          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
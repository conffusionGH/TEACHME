import { Link } from 'react-router-dom';
import logo from '../assets/images/logo/teachMeLogo.png';
import Navbar from './Navbar';
import { FiMenu } from 'react-icons/fi';

export default function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className='bg-tertiary shadow-md'>
      <div className='flex justify-between items-center max-w-full mx-auto p-3'>
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 text-primary lg:hidden"
          >
            <FiMenu size={24} />
          </button>
          <Link to='/' className=''>
            <div className='flex lg:hidden font-bold text-sm sm:text-xl  flex-wrap items-center gap-2 '>
              <div className='flex justify-around items-center'>
                <div className='w-10 h-10 rounded-full border-2 border-primary overflow-hidden'>
                  <img
                    src={logo}
                    alt='logo'
                    className='object-cover w-full h-full'
                  />
                </div>
              </div>
            </div>
          </Link>
        </div>
        <Navbar />
      </div>
    </header>
  );
}
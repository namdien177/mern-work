import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className={'sticky w-full top-0 inset-x-0 h-20'}>
      <div className="container mx-auto flex items-center h-full px-8 space-x-2">
        <Link className={'p-2 rounded min-w-32 hover:bg-black/20'} to={'/'}>
          Schedules
        </Link>
        <Link
          className={'p-2 rounded min-w-32 hover:bg-black/20'}
          to={'/blogs'}
        >
          Blogs
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

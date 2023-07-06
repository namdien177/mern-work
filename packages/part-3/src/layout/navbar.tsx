import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className={'sticky w-full top-0 inset-x-0 h-20'}>
      <div className="container mx-auto flex items-center h-full px-8 space-x-2">
        <Link className={'p-2 rounded min-w-32 hover:bg-black/20'} to={'/'}>
          List User
        </Link>
        <Link
          className={'p-2 rounded min-w-32 hover:bg-black/20'}
          to={'/generate-list'}
        >
          Generate List
        </Link>
        <Link
          className={'p-2 rounded min-w-32 hover:bg-black/20'}
          to={'/contact-form'}
        >
          Contact Form
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

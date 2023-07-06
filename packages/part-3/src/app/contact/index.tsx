import React, { useState } from 'react';
import ContactForm from '../../component/contact-form';

const Page = () => {
  const [showForm, setShowForm] = useState(true);

  const handleClose = () => {
    setShowForm(false);
  };

  return (
    <>
      {showForm && <ContactForm onClose={handleClose} />}
      {!showForm && (
        <div
          className={
            'flex flex-col justify-center items-center space-y-4 container px-auto p-4'
          }
        >
          <p className={'text-center'}>The form has been closed.</p>

          <button
            onClick={() => setShowForm(true)}
            className={
              'py-2 px-4 rounded justify-center flex items-center bg-transparent hover:bg-slate-100'
            }
          >
            Open Form
          </button>
        </div>
      )}
    </>
  );
};

export default Page;

import { FormEventHandler, useState } from 'react';
import { createPortal } from 'react-dom';

type FormProps = {
  onClose?: () => void;
};

const ContactForm = ({ onClose }: FormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    console.log(`Name: ${name}, Email: ${email}, Phone: ${phone}`);
  };

  return createPortal(
    <form
      className={
        'p-4 shadow-lg border border-slate-200 fixed flex flex-col space-y-2 max-h-11/12 max-w-11/12 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md'
      }
      onSubmit={handleSubmit}
    >
      <label className={'flex space-x-4 items-center'}>
        <span className={'font-semibold'}>Name:</span>
        <input
          className={'border p-2 rounded'}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label className={'flex space-x-4 items-center'}>
        <span className={'font-semibold'}>Email:</span>
        <input
          className={'border p-2 rounded'}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <label className={'flex space-x-4 items-center'}>
        <span className={'font-semibold'}>Phone:</span>
        <input
          className={'border p-2 rounded'}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <hr className={'my-4'} />
      <button
        className={
          'py-2 px-4 font-semibold rounded justify-center flex items-center bg-green-600 hover:bg-green-700 text-white'
        }
        type="submit"
      >
        Submit
      </button>
      <button
        onClick={onClose}
        className={
          'py-2 px-4 text-red-600 rounded justify-center flex items-center bg-transparent hover:bg-slate-100'
        }
        type="button"
      >
        close
      </button>
    </form>,
    document.body
  );
};

export default ContactForm;

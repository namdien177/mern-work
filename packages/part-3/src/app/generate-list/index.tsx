import useDebounce from '../../hooks/use-debounce';
import { ChangeEventHandler, useState } from 'react';

const GenerateList = () => {
  const [amountItem, setAmountItem] = useState(5);
  const [amountRender, debouncing] = useDebounce(amountItem);

  const onValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.value;
    if (!Number.isNaN(value) && Number(value) > 0) {
      setAmountItem(Number(value));
    } else {
      setAmountItem(0);
    }
  };

  const randomNumb = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  return (
    <div className={'flex flex-col space-y-4 container p-8 mx-auto'}>
      <div className="flex items-center space-x-2">
        <span className={'font-semibold'}>Generate</span>
        <input
          defaultValue={amountItem}
          type="number"
          max={64}
          className={'border py-1 px-2 rounded w-32'}
          onChange={onValueChange}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {debouncing
          ? 'debouncing...'
          : new Array(amountRender).fill(0).map((item, index) => (
              <div
                className={'rounded-md hover:bg-slate-100 p-2 border'}
                key={index}
              >
                {item} - Random: {randomNumb()}
              </div>
            ))}
      </div>
    </div>
  );
};

export default GenerateList;

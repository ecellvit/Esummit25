import React, { FC } from 'react';
import LoadingIcons from 'react-loading-icons';

const Loader: FC = () => {
  return (
    <main className='fixed top-0 left-0 right-0 bottom-0 h-full w-full bg-[#11111175] z-[100] flex justify-center items-center overflow-hidden'>
      <LoadingIcons.Oval />
    </main>
  );
};

export default Loader;

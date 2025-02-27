import React, { FC } from 'react';

const QuizEnd: FC = () => {
  return (
    <main className="text-white  flex flex-col justify-center items-center min-h-screen">
      <div className="m-40 border bg-red-800 rounded-xl flex flex-col items-center">
        <h1 className="text-2xl p-6 leading-3  font-[PoppinsSemibold]">
          Congratulations on completing the Qualifier Quiz!
        </h1>
        <h1 className="text-2xl p-6 text-center font-[PoppinsRegular]">
          Your enthusiasm is highly commendable. We appreciate your efforts and
          dedication and hope you found it both challenging and enjoyable.
        </h1>
        <h1 className="text-2xl p-6 font-[PoppinsRegular]">
          Stay tuned for further updates, and hope to see you on the 5th of October, 2024.
        </h1>
      </div>
    </main>
  );
};

export default QuizEnd;

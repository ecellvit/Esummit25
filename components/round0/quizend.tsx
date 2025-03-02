// import React, { FC, useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// const QuizEnd: FC = () => {
//   const [isClient, setIsClient] = useState(false);
//   const router = isClient ? useRouter() : null;
//   useEffect(() => {
//     setIsClient(true);
//   }, []);
//   if (!isClient) {
//     return null;
//   }
//   return (
//     <main className="text-white flex justify-center items-center h-screen">
//       <div className="border p-10 bg-red-800 rounded-xl flex flex-col items-center w-5/6 text-center">
//         <h1 className="text-2xl p-6 leading-3 font-[PoppinsSemibold]">
//           Congratulations on completing the Qualifier Quiz!
//         </h1>
//         <h1 className="text-2xl p-6 font-[PoppinsRegular]">
//           Your enthusiasm is highly commendable. We appreciate your efforts and
//           dedication and hope you found it both challenging and enjoyable.
//         </h1>
//         <h1 className="text-2xl p-6 font-[PoppinsRegular]">
//           Stay tuned for further updates, and hope to see you on the 4th of March, 2025.
//         </h1>
//         <button
//           className="bg-white text-black p-4 rounded-lg font-[PoppinsSemibold]"
//           onClick={() => router?.push('/')}
//         >
//           Return to Home
//         </button>
//       </div>
//     </main>
//   );
// };

// export default QuizEnd;



import React, { FC } from 'react';
import Link from 'next/link';
import Loader from '../loader';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const QuizEnd: FC = () => {
  const router=useRouter();
  const [loading, setLoading] = useState<Boolean>(false);
  const handleReturn = async () => {
    setLoading(true);
    router.push("/");
  }

  return (
    <main className="text-white flex justify-center items-center h-screen">
      {loading && <Loader />}
      {!loading && <div className="border p-10 bg-red-800 rounded-xl flex flex-col items-center w-5/6 text-center">
        <h1 className="text-2xl p-6 leading-3 font-[PoppinsSemibold]">
          Congratulations on completing the Qualifier Quiz!
        </h1>
        <h1 className="text-2xl p-6 font-[PoppinsRegular]">
          Your enthusiasm is highly commendable. We appreciate your efforts and
          dedication and hope you found it both challenging and enjoyable.
        </h1>
        <h1 className="text-2xl p-6 font-[PoppinsRegular]">
          Stay tuned for further updates, and hope to see you on the 4th of March, 2025.
        </h1>
          <button className="bg-white text-black p-4 rounded-lg font-[PoppinsSemibold]"
          onClick={handleReturn}>
            Return to Home
          </button>
      </div>}
    </main>
  );
};

export default QuizEnd;

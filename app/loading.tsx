// import React from "react";

// const loading = () => {
//   return (
//     <main className="min-h-[100vh] flex items-center">
//       <div className="container text-center">loading...</div>
//     </main>
//   );
// };

// export default loading;


export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen relative">
      <span className="absolute top-[50%] left-[50%] translate-[-50%,-50%] text-xs text-gray-800">server loading...</span>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-800"></div>
    </div>
  );
}

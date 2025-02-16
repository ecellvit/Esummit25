import Navbar from "@/components/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="absolute top-0 z-50">
        <Navbar/>
      </div>
        {children}
    </>
     
  );
}

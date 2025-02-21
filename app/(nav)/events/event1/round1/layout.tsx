import Round1Navbar from "@/components/round1/navbar";

export default function Round1Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Round1Navbar />
      {children}
    </>
  );
}

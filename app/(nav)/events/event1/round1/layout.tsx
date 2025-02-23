import Round1Navbar from "@/components/events/round1/navbar";

export default function Round1Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Round1Navbar />
      {children}
    </>
  );
}
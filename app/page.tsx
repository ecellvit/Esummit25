// pages/index.tsx or any page
import SessionWrapper from "@/components/SessionWrapper";

export default function HomePage() {
  return (
    <div>
      {/* Wrap only SignInBtn with SessionProvider */}
      <SessionWrapper />
    </div>
  );
}
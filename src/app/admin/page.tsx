import { AdminBoard } from "./AdminBoard";

export const metadata = {
  title: "Admin Ops CRM — Smart Car Wash",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="mesh min-h-screen">
      <div className="section-pad mx-auto max-w-[1600px] py-6 md:py-8">
        <AdminBoard />
      </div>
    </main>
  );
}

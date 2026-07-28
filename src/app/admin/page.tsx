import { AdminBoard } from "./AdminBoard";

export const metadata = {
  title: "Admin — Smart Car Wash",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="mesh min-h-screen py-10">
      <div className="section-pad mx-auto max-w-7xl">
        <AdminBoard />
      </div>
    </main>
  );
}

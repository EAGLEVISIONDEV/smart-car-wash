import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PitchDeck } from "@/components/PitchDeck";

export const metadata = {
  title: "Pitch — Smart Car Wash pentru proprietar",
  description:
    "De ce merită sistemul modern de programări, ops CRM, loyalty și aplicația mobilă cu notificări smart.",
  robots: { index: false, follow: false },
};

export default function PitchPage() {
  return (
    <>
      <Header />
      <main>
        <PitchDeck />
      </main>
      <Footer />
    </>
  );
}

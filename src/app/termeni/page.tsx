import { LegalShell } from "@/components/LegalShell";
import { business } from "@/lib/data";

export const metadata = { title: "Termeni — Smart Car Wash" };

export default function Page() {
  return (
    <LegalShell title="Termeni și condiții">
      <p>
        Site-ul permite programări online la {business.name},{" "}
        {business.address.full}. Sloturile sunt estimate; durata reală poate
        varia în funcție de tipul mașinii și de încărcare.
      </p>
      <p>
        Program: {business.hours[0].days}, {business.hours[0].time}. Prețurile
        se confirmă la fața locului.
      </p>
      <p>
        Ne-prezentarea fără anulare poate duce la marcarea rezervării ca
        no-show. Pentru modificări, sună la {business.phoneDisplay}.
      </p>
    </LegalShell>
  );
}

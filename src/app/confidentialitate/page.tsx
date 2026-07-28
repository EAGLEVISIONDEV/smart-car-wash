import { LegalShell } from "@/components/LegalShell";
import { business } from "@/lib/data";

export const metadata = { title: "Confidențialitate — Smart Car Wash" };

export default function Page() {
  return (
    <LegalShell title="Politica de confidențialitate">
      <p>
        {business.name} prelucrează datele pe care le furnizezi la programare
        (număr de înmatriculare, telefon, nume opțional, note) exclusiv pentru
        organizarea spălării auto și comunicarea statusului.
      </p>
      <p>
        <strong className="text-white">Temei:</strong> executarea contractului /
        interes legitim pentru programări. Nu vindem datele către terți.
      </p>
      <p>
        <strong className="text-white">Păstrare:</strong> programările se păstrează
        până la 24 luni, apoi pot fi anonimizate. Poți cere ștergerea la telefon.
      </p>
      <p>
        Numărul de înmatriculare este folosit ca identificator al vehiculului în
        coadă și pe pagina de status.
      </p>
    </LegalShell>
  );
}

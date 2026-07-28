import { LegalShell } from "@/components/LegalShell";

export const metadata = { title: "Cookies — Smart Car Wash" };

export default function Page() {
  return (
    <LegalShell title="Politica de cookies">
      <p>
        Folosim cookie-uri tehnice necesare (ex. sesiune admin) și cookie-uri ale
        infrastructurii de hosting. Nu rulăm momentan cookie-uri de marketing.
      </p>
      <p>
        Poți controla cookie-urile din browser. Blocarea celor esențiale poate
        afecta login-ul admin.
      </p>
    </LegalShell>
  );
}

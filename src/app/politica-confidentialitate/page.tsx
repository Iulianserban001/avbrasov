import React from "react";
import LegalPageClient from "@/app/components/legal/LegalPageClient";

export const metadata = {
  title: "Politica de Confidențialitate | SPS și Asociații",
  description: "Cum protejăm datele dumneavoastră și asigurăm discreția absolută în relația avocat-client."
};

export default function PoliticaPage() {
  return (
    <LegalPageClient title="Politica Privată" lastUpdated="1 Aprilie 2024">
      <div className="space-y-12">
        <section className="space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">1. Angajamentul Nostru</h2>
          <p>
            Vă tratăm confidențialitatea cu aceeași rigoare pe care o aplicăm în apărarea drepturilor dumneavoastră în instanță. Securitatea datelor transmise prin acest portal este prioritară.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">2. Date Colectate</h2>
          <p>
            Colectăm exclusiv datele necesare pentru inițierea analizei juridice: Nume, Email, Telefon și descrierea preliminară a speței. Acestea sunt stocate în containere securizate Firebase cu acces restricționat.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">3. Discreția Avocat-Client</h2>
          <p>
            Comunicarea prin formularele de pe site se află sub incindența secretului profesional. Nu vindem, nu închiriem și nu partajăm datele dumneavoastră cu terți în scopuri de marketing.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">4. Drepturile Dumneavoastră</h2>
          <p>
            Conform GDPR, aveți dreptul de a solicita ștergerea integrală a datelor dumneavoastră din bazele noastre de date oricând nu mai doriți continuarea colaborării.
          </p>
        </section>
      </div>
    </LegalPageClient>
  );
}

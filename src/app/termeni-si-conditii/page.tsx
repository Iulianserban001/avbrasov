import React from "react";
import LegalPageClient from "@/app/components/legal/LegalPageClient";

export const metadata = {
  title: "Termeni și Condiții | SPS și Asociații",
  description: "Cadrul legal al colaborării digitale cu Cabinetul de Avocatură SPS și Asociații."
};

export default function TermeniPage() {
  return (
    <LegalPageClient title="Termeni Legali" lastUpdated="1 Aprilie 2024">
      <div className="space-y-12">
        <section className="space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">1. Utilizarea Platformei</h2>
          <p>
            Acest portal este oferit exclusiv în scop informativ. Utilizarea funcțiilor de contact nu constituie prin sine un raport juridic formal client-avocat fără semnarea unui contract de asistență juridică.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">2. Propriietate Intelectuală</h2>
          <p>
            Toate materialele, logo-ul "SPS și Asociații", design-ul portalului și textele editoriale aparțin SCA SPS și Asociații. Copierea sau redistribuirea lor fără acord scris este strict interzisă.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">3. Limita Răspunderii</h2>
          <p>
            Informațiile juridice generale prezentate pe blog nu trebuie interpretate ca și consultanță juridică personalizată. Fiecare speță este unică și necesită analiză dedicată.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">4. Rezolvarea Litigiilor</h2>
          <p>
            Orice neînțelegere rezultată din utilizarea acestui portal va fi soluționată pe cale amiabilă sau, în ultimă instanță, prin instanțele competente din Municipiul Brașov.
          </p>
        </section>
      </div>
    </LegalPageClient>
  );
}

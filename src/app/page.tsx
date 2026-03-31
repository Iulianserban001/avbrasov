import Link from "next/link";
import { Scale, Phone, Mail, MapPin, ChevronRight, Shield, Clock, Award, Users } from "lucide-react";

// Local static data for the public UI mockup until the public site is wired up to Firestore with Firebase Admin
const mainAttorney = {
  id: "u1",
  name: "Av. Andrei Popescu",
  email: "andrei@avocatbrasov.ro",
  role: "ADMIN",
  bio: "Cu o experiență de peste 15 ani în fața instanțelor din Brașov, Coordonez aria de practică litigii civile și dreptul familiei. Dedicare și transparență totală pentru fiecare caz asumat.",
  barMembership: "Baroul Brașov",
  yearsExp: 15,
};

const placeholderServices = [
  { id: "s1", name: "Dreptul Familiei", slug: "drept-familiei", description: "Asistență în procese de divorț, pensie de întreținere și stabilirea domiciliului minorului în Brașov." },
  { id: "s2", name: "Litigii Civile", slug: "litigii-civile", description: "Recuperări creanțe, succesiuni, partaje și litigii privind proprietatea în instanțele din Brașov." },
  { id: "s3", name: "Drept Penal", slug: "drept-penal", description: "Reprezentare și asistență juridică în faza de urmărire penală și în fața instanțelor de judecată." },
  { id: "s4", name: "Drept Comercial", slug: "drept-comercial", description: "Înființări firme, redactare contracte comerciale, litigii între profesioniști și insolvență." },
];

export default function HomePage() {

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-[var(--glass-border)] bg-[var(--navy-950)]/90 backdrop-blur-lg">
        <div className="container-narrow flex items-center justify-between h-16 px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--gold-400)] to-[var(--gold-600)] flex items-center justify-center">
              <Scale className="w-4 h-4 text-[var(--navy-950)]" />
            </div>
            <span className="font-bold text-sm gold-gradient hidden sm:inline">CABINET AVOCAT BRAȘOV</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-[var(--navy-400)]">
            <Link href="/avocat-brasov" className="hover:text-[var(--gold-400)] transition-colors">Avocat Brașov</Link>
            <Link href="/servicii" className="hover:text-[var(--gold-400)] transition-colors">Servicii</Link>
            <Link href="/echipa" className="hover:text-[var(--gold-400)] transition-colors">Echipă</Link>
            <Link href="/contact" className="hover:text-[var(--gold-400)] transition-colors">Contact</Link>
          </div>
          <a
            href="tel:0740123456"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-950)] font-semibold text-sm hover:shadow-lg hover:shadow-[var(--gold-500)]/20 transition-all"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">0740 123 456</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center pt-16">
        <div className="container-narrow px-6 py-20 md:py-32">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--gold-500)]/10 border border-[var(--gold-500)]/20 text-[var(--gold-400)] text-xs font-medium mb-6">
              <Shield className="w-3 h-3" />
              Baroul Brașov • 15+ Ani Experiență
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Cabinet de{" "}
              <span className="gold-gradient">Avocatură</span>{" "}
              Brașov
            </h1>
            <p className="text-lg md:text-xl text-[var(--navy-400)] mt-6 max-w-2xl leading-relaxed">
              Protejăm drepturile și interesele dvs. cu profesionalism, dedicare și integritate.
              Consultanță juridică specializată în drept civil, penal și dreptul familiei.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a
                href="tel:0740123456"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-950)] font-bold text-base hover:shadow-xl hover:shadow-[var(--gold-500)]/20 transition-all"
              >
                <Phone className="w-5 h-5" />
                Consultanță Gratuită
              </a>
              <Link
                href="/servicii"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[var(--navy-700)] text-[var(--navy-200)] font-semibold text-base hover:bg-[var(--glass-hover)] hover:border-[var(--gold-500)]/30 transition-all"
              >
                Servicii Juridice
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-fade-in-up delay-200">
            {[
              { icon: Award, label: "Baroul Brașov", desc: "Membru din 2008" },
              { icon: Users, label: "500+ Cazuri", desc: "Rezolvate cu succes" },
              { icon: Clock, label: "15+ Ani", desc: "Experiență profesională" },
              { icon: Shield, label: "Consultanță", desc: "Prima consultanță gratuită" },
            ].map((badge) => (
              <div key={badge.label} className="glass-card p-4 flex items-center gap-3">
                <badge.icon className="w-8 h-8 text-[var(--gold-400)] flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">{badge.label}</p>
                  <p className="text-xs text-[var(--navy-500)]">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="public-section bg-[var(--navy-900)]">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Servicii Juridice</h2>
            <p className="text-[var(--navy-400)] mt-3 max-w-xl mx-auto">
              Asistență juridică completă în cele mai importante arii de practică
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {placeholderServices.map((service, i) => (
              <Link
                key={service.id}
                href={`/servicii/${service.slug}`}
                className="glass-card p-6 group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--gold-500)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--gold-500)]/20 transition-colors">
                  <Scale className="w-5 h-5 text-[var(--gold-400)]" />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[var(--gold-400)] transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-[var(--navy-400)] mt-2 line-clamp-3">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-[var(--gold-400)] mt-4 font-medium group-hover:gap-2 transition-all">
                  Detalii <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About / Trust Section */}
      <section className="public-section">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">De Ce Să Ne Alegeți</h2>
              <p className="text-[var(--navy-400)] mt-4 leading-relaxed">
                Cu o experiență de peste 15 ani în instanțele din Brașov, cunoaștem în profunzime
                practica Judecătoriei Brașov, Tribunalului Brașov și Curții de Apel Brașov.
                Această experiență locală ne oferă un avantaj strategic semnificativ.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Abordare personalizată pentru fiecare caz",
                  "Transparență totală privind onorariile și strategia",
                  "Comunicare constantă și rapoarte de progres",
                  "Experiență extinsă în instanțele din Brașov",
                  "Rezultate demonstrate în peste 500 de cazuri",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--navy-300)]">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--gold-400)] to-[var(--gold-600)] flex items-center justify-center text-2xl font-bold text-[var(--navy-950)] mb-6">
                AP
              </div>
              <h3 className="text-xl font-bold text-white">{mainAttorney.name}</h3>
              <p className="text-sm text-[var(--gold-400)] mt-1">Avocat Titular — Baroul Brașov</p>
              <p className="text-sm text-[var(--navy-400)] mt-4 leading-relaxed">{mainAttorney.bio}</p>
              <div className="mt-4 space-y-2">
                <p className="text-xs text-[var(--navy-500)]">📋 {mainAttorney.barMembership}</p>
                <p className="text-xs text-[var(--navy-500)]">📅 {mainAttorney.yearsExp}+ ani experiență</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="public-section bg-gradient-to-b from-[var(--navy-900)] to-[var(--navy-950)]">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Aveți Nevoie de <span className="gold-gradient">Ajutor Juridic</span>?
          </h2>
          <p className="text-[var(--navy-400)] mt-4 max-w-xl mx-auto">
            Programați o consultanță inițială gratuită. Vom analiza situația dvs. și vă vom propune cea mai bună strategie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a
              href="tel:0740123456"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-950)] font-bold hover:shadow-xl hover:shadow-[var(--gold-500)]/20 transition-all"
            >
              <Phone className="w-5 h-5" />
              0740 123 456
            </a>
            <a
              href="mailto:avocat@avocatbrasov.ro"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[var(--navy-700)] text-[var(--navy-200)] font-semibold hover:bg-[var(--glass-hover)] transition-all"
            >
              <Mail className="w-5 h-5" />
              avocat@avocatbrasov.ro
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--glass-border)] py-12 px-6">
        <div className="container-narrow">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--gold-400)] to-[var(--gold-600)] flex items-center justify-center">
                  <Scale className="w-4 h-4 text-[var(--navy-950)]" />
                </div>
                <span className="font-bold text-sm gold-gradient">CABINET AVOCAT BRAȘOV</span>
              </div>
              <p className="text-sm text-[var(--navy-500)] leading-relaxed">
                Cabinet de avocatură în Brașov. Servicii juridice profesionale cu dedicare și integritate.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Servicii</h4>
              <ul className="space-y-2">
                {placeholderServices.slice(0, 5).map((s) => (
                  <li key={s.id}>
                    <Link href={`/servicii/${s.slug}`} className="text-sm text-[var(--navy-400)] hover:text-[var(--gold-400)] transition-colors">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-[var(--navy-400)]">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-[var(--gold-400)]" />
                  Str. Republicii nr. 15, Brașov 500030
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--gold-400)]" />
                  0740 123 456
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--gold-400)]" />
                  avocat@avocatbrasov.ro
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[var(--glass-border)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--navy-600)]">
            <p>© {new Date().getFullYear()} Cabinet de Avocatură Andrei Popescu. Toate drepturile rezervate.</p>
            <p>Informațiile de pe acest site nu constituie consiliere juridică.</p>
          </div>
        </div>
      </footer>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalService",
            name: "Cabinet de Avocatură Andrei Popescu",
            description: "Cabinet de avocatură în Brașov. Servicii juridice: divorțuri, succesiuni, drept penal, executare silită.",
            url: "https://avocatbrasov.ro",
            telephone: "+40740123456",
            email: "avocat@avocatbrasov.ro",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Str. Republicii nr. 15",
              addressLocality: "Brașov",
              addressRegion: "Brașov",
              postalCode: "500030",
              addressCountry: "RO",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 45.6427,
              longitude: 25.5887,
            },
            areaServed: {
              "@type": "State",
              name: "Județul Brașov",
            },
            priceRange: "$$",
            openingHours: "Mo-Fr 09:00-18:00",
          }),
        }}
      />
    </>
  );
}

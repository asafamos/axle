import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EAA en España — Ley 11/2023 y UNE-EN 301 549 para desarrolladores",
  description:
    "España transpone la EAA mediante la Ley 11/2023 (28 junio 2025). Sanciones hasta 1.000.000 € para infracciones muy graves. Guía técnica para integrar la accesibilidad en tu pipeline CI.",
  keywords: [
    "EAA España",
    "Ley 11/2023",
    "accesibilidad web España",
    "UNE-EN 301 549",
    "Real Decreto 1112/2018",
    "declaración de accesibilidad España",
    "WCAG 2.1 España",
    "axle",
  ],
  openGraph: {
    title: "EAA en España — guía para desarrolladores",
    description:
      "Qué exige la ley, a quién aplica, sanciones, y cómo integrar la accesibilidad en el CI antes de una auditoría.",
    type: "article",
    locale: "es_ES",
  },
  alternates: { canonical: "/guides/eaa-spain" },
};

export default function SpainPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          España · Guía de conformidad
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          EAA en España — Ley 11/2023 para desarrolladores
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          España transpuso la Directiva (UE) 2019/882 mediante la{" "}
          <strong>Ley 11/2023, de 8 de mayo</strong>, de transposición de directivas de la
          Unión Europea en materia de accesibilidad. Entró plenamente en vigor el{" "}
          <strong>28 de junio de 2025</strong>. El régimen sancionador es escalonado y
          llega hasta <strong>1.000.000 €</strong> para infracciones muy graves que afecten
          a un número elevado de usuarios. Si vendes a consumidores en España, este
          artículo te aplica — sea cual sea tu jurisdicción.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Índice
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#what">Marco legal</a></li>
            <li><a className="hover:underline" href="#who">A quién se aplica</a></li>
            <li><a className="hover:underline" href="#technical">Requisitos técnicos — UNE-EN 301 549</a></li>
            <li><a className="hover:underline" href="#penalties">Régimen sancionador</a></li>
            <li><a className="hover:underline" href="#monitoring">Observatorio y autoridades</a></li>
            <li><a className="hover:underline" href="#declaration">Declaración de accesibilidad</a></li>
            <li><a className="hover:underline" href="#how">Cómo cumplir — enfoque CI-first</a></li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Marco legal</h2>
          <p className="mt-3 text-slate-700">
            La base normativa española combina tres textos:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Real Decreto 1112/2018</strong> — accesibilidad de sitios web y
              aplicaciones del sector público (transposición de la Directiva 2016/2102).
            </li>
            <li>
              <strong>Ley 11/2023</strong> (&quot;Ley EAA&quot;) — transposición de la EAA,
              extiende obligaciones al sector privado desde el 28 junio 2025.
            </li>
            <li>
              <strong>UNE-EN 301 549</strong> — norma técnica armonizada, que incorpora WCAG
              2.1 nivel AA para contenido web.
            </li>
          </ul>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">A quién se aplica</h2>
          <p className="mt-3 text-slate-700">Servicios digitales al consumo cubiertos:</p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Comercio electrónico, mercados y plataformas de reserva.</li>
            <li>Servicios bancarios y financieros al consumo.</li>
            <li>Libros electrónicos y lectores.</li>
            <li>Servicios de comunicaciones electrónicas al consumo.</li>
            <li>Billetaje y servicios de transporte de pasajeros.</li>
            <li>Equipos y terminales de hardware informático al consumo.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Exención de microempresas:</strong> menos de 10 empleados y volumen de
            negocio anual hasta 2 M€ quedan exentas de obligaciones para servicios (no para
            productos).
          </p>
          <p className="mt-3 text-slate-700">
            <strong>Alcance extraterritorial:</strong> cualquier operador — español o no —
            que ofrezca servicios a consumidores en España está dentro del ámbito.
          </p>
        </section>

        <section id="technical" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Requisitos técnicos — UNE-EN 301 549
          </h2>
          <p className="mt-3 text-slate-700">
            La norma UNE-EN 301 549 v3.2.1 es la base técnica. Exige WCAG 2.1 AA para
            contenido web:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Perceptible</strong> — alternativas de texto, subtítulos, contraste 4,5:1.</li>
            <li><strong>Operable</strong> — navegación completa por teclado, sin trampas de teclado, sin parpadeos superiores a 3 Hz.</li>
            <li><strong>Comprensible</strong> — idioma declarado (<code>&lt;html lang=&quot;es&quot;&gt;</code>), navegación consistente, mensajes de error claros.</li>
            <li><strong>Robusto</strong> — HTML válido, ARIA coherente con el DOM, compatibilidad con lectores de pantalla.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            UNE-EN 301 549 cubre además apps móviles nativas y software de creación — relevante
            si distribuyes una app complementaria al sitio web.
          </p>
        </section>

        <section id="penalties" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Régimen sancionador</h2>
          <p className="mt-3 text-slate-700">
            La Ley 11/2023 establece un régimen escalonado:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Infracciones leves</strong> — multa hasta 30.000 €.</li>
            <li><strong>Infracciones graves</strong> — multa de 30.001 € a 300.000 €.</li>
            <li><strong>Infracciones muy graves</strong> — multa de 300.001 € a 1.000.000 €, reservada para supuestos que afecten a un elevado número de usuarios o reincidentes.</li>
            <li>Prohibición de prestación del servicio en caso de incumplimiento reiterado.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            El cómputo se realiza por cada servicio no conforme y puede acumular. Las
            asociaciones de consumidores legitimadas pueden ejercer acción colectiva bajo la
            Ley 7/2017 (transposición de la Directiva sobre acciones representativas).
          </p>
        </section>

        <section id="monitoring" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Observatorio y autoridades
          </h2>
          <p className="mt-3 text-slate-700">
            La vigilancia recae en el <strong>Observatorio de Accesibilidad Web</strong>,
            coordinado por la Secretaría General de Administración Digital. Además:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>La <strong>Agencia Española de Consumo (AESAN)</strong> colabora en materia de reclamaciones de consumidores.</li>
            <li>Las <strong>autoridades autonómicas</strong> (Generalitat, Junta, Govern, etc.) tienen competencias en su territorio.</li>
            <li>Existe un <strong>canal centralizado</strong> para que usuarios presenten quejas si el proveedor no responde en plazo.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            El Observatorio realiza monitorizaciones periódicas muestrales — aparecer con
            incumplimientos en esas revisiones dispara procedimiento sancionador de oficio.
          </p>
        </section>

        <section id="declaration" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Declaración de accesibilidad
          </h2>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Estado de conformidad: &quot;plenamente conforme&quot;, &quot;parcialmente conforme&quot; o &quot;no conforme&quot; con UNE-EN 301 549.</li>
            <li>Contenido no accesible, con motivo (carga desproporcionada, exclusión de ámbito, o trabajos en curso con fecha de remediación).</li>
            <li>Mecanismo de comunicación de barreras (email y, preferiblemente, formulario accesible).</li>
            <li>Procedimiento de reclamación ante el Observatorio / autoridad autonómica.</li>
            <li>Metodología de evaluación (autoevaluación, auditoría de tercero, ambas), con fecha.</li>
            <li>Fecha de preparación y última revisión.</li>
            <li>La declaración debe ser en español y accesible per se — no un PDF escaneado.</li>
          </ol>
          <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            El generador de axle produce una declaración estructurada conforme a EN 301 549. La{" "}
            <strong>plantilla española específica</strong> (con enlaces al Observatorio y a las
            autoridades autonómicas) forma parte del roadmap del plan Team.
          </p>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Cómo cumplir — enfoque CI-first
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li><strong>Escaneo de línea base</strong> — axe-core 4.11 sobre home + rutas críticas; se detectan habitualmente 30-80 incumplimientos.</li>
            <li><strong>Correcciones en el código fuente</strong> — plantillas, no widget de overlay. El Observatorio examina el HTML servido.</li>
            <li><strong>Integración CI</strong> — bloquear PR con regresiones &quot;critical&quot; o &quot;serious&quot;.</li>
            <li><strong>Auditoría humana anual</strong> — axe-core detecta ~57% de los problemas WCAG; lo demás (carga cognitiva, flujo con lector de pantalla) requiere persona.</li>
            <li><strong>Publicar la declaración</strong> — en español, con canal de reclamación.</li>
            <li><strong>Trazabilidad</strong> — los informes CI son la prueba de diligencia ante una inspección del Observatorio.</li>
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Instalar la GitHub Action →
            </a>
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Generador de declaración
            </Link>
            <Link
              href="/guides/eaa-2025"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              ← Visión EAA europea
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Aviso:</strong> esta guía se dirige a equipos técnicos. No constituye
            asesoramiento jurídico. Para una evaluación concreta bajo la Ley 11/2023, consulte
            a un abogado colegiado en España. Los máximos citados son los legales; la sanción
            efectiva depende del caso concreto.
          </p>
          <p className="mt-3">
            Actualizado: 21 de abril de 2026. Revisado cuando las normas evolucionan.
            Correcciones fácticas bienvenidas:{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>
            .
          </p>
        </footer>
      </article>
    </main>
  );
}

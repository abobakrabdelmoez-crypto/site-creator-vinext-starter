"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type BuilderAnswers = {
  company: string;
  month: string;
  duration: string;
  experiences: string[];
  rhythm: string;
  explore: string;
  comfort: string;
  notes: string;
  firstName: string;
  whatsapp: string;
  email: string;
};

type RoutePlan = {
  stops: string[];
  travellerNote: string;
  durationNote: string;
  rhythmNote: string;
  exploreNote: string;
  monthNote: string;
};

const imageSet = {
  mountain: "https://images.unsplash.com/photo-1633583929289-918efe6331c2?auto=format&fit=crop&w=1800&q=78",
  mountainThumb: "https://images.unsplash.com/photo-1633583929289-918efe6331c2?auto=format&fit=crop&w=640&q=72",
  wadi: "https://images.unsplash.com/photo-1635749688148-3ead1499e58e?auto=format&fit=crop&w=1800&q=78",
  wadiThumb: "https://images.unsplash.com/photo-1635749688148-3ead1499e58e?auto=format&fit=crop&w=640&q=72",
  road: "https://images.pexels.com/photos/31093321/pexels-photo-31093321.jpeg?auto=compress&cs=tinysrgb&w=1800",
  roadThumb: "https://images.pexels.com/photos/31093321/pexels-photo-31093321.jpeg?auto=compress&cs=tinysrgb&w=640",
  desert: "https://images.unsplash.com/photo-1582617306030-1576d809f3e0?auto=format&fit=crop&w=1800&q=78",
  desertThumb: "https://images.unsplash.com/photo-1582617306030-1576d809f3e0?auto=format&fit=crop&w=640&q=72",
  coast: "https://images.unsplash.com/photo-1615399144021-822ba908c6f3?auto=format&fit=crop&w=1800&q=78",
  coastThumb: "https://images.unsplash.com/photo-1615399144021-822ba908c6f3?auto=format&fit=crop&w=640&q=72",
  cultureThumb: "https://images.unsplash.com/photo-1657523389874-e2695c194e18?auto=format&fit=crop&w=640&q=72",
  people: "https://images.pexels.com/photos/37357096/pexels-photo-37357096.jpeg?auto=compress&cs=tinysrgb&w=1600",
  peopleThumb: "https://images.pexels.com/photos/37357096/pexels-photo-37357096.jpeg?auto=compress&cs=tinysrgb&w=640",
};

const officialLogo = "/canary-logo-fr.png";
const builderStorageKey = "canary-votre-oman-builder";
const leadIntegration = { endpoint: null as string | null, whatsappUrl: null as string | null };

const initialAnswers: BuilderAnswers = { company: "", month: "", duration: "", experiences: [], rhythm: "", explore: "", comfort: "", notes: "", firstName: "", whatsapp: "", email: "" };
const experiences = [
  { id: "Montagnes et routes", image: imageSet.mountainThumb },
  { id: "Wadis et eaux turquoise", image: imageSet.wadiThumb },
  { id: "Désert et nuits étoilées", image: imageSet.desertThumb },
  { id: "Mer et côte", image: imageSet.coastThumb },
  { id: "Villages et culture", image: imageSet.cultureThumb },
  { id: "Road trip et aventure", image: imageSet.roadThumb },
  { id: "Un peu de tout", image: imageSet.peopleThumb },
];

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return <a className={inverse ? "brand-mark brand-mark-inverse" : "brand-mark"} href="#top" aria-label="Canary Voyages et Tourisme, accueil"><img className="brand-image" src={officialLogo} alt="Canary Voyages et Tourisme" /></a>;
}

function ArrowIcon() { return <span aria-hidden="true" className="arrow-icon">↗</span>; }

function SectionHeading({ children, intro }: { children: React.ReactNode; intro?: string }) {
  return <div className="section-heading"><h2>{children}</h2>{intro ? <p>{intro}</p> : null}</div>;
}

function BuilderChoice({ title, subtitle, selected, onClick, image }: { title: string; subtitle?: string; selected?: boolean; onClick: () => void; image?: string }) {
  return <button aria-pressed={selected} className={selected ? "builder-choice is-selected" : "builder-choice"} type="button" onClick={onClick}>{image ? <img src={image} alt="" loading="lazy" decoding="async" /> : null}<span className="choice-copy"><strong>{title}</strong>{subtitle ? <small>{subtitle}</small> : null}</span><span className="choice-mark" aria-hidden="true">{selected ? "✓" : ""}</span></button>;
}

function BuilderStep({ children, title, note }: { children: React.ReactNode; title: string; note?: string }) {
  return <div className="builder-step"><p className="step-kicker">Votre Oman <span>by Canary</span></p><h2>{title}</h2>{note ? <p className="step-note">{note}</p> : null}{children}</div>;
}

function buildRoutePlan(answers: BuilderAnswers): RoutePlan {
  const allExperiences = answers.experiences.includes("Un peu de tout");
  const selected = allExperiences
    ? ["Villages et culture", "Montagnes et routes", "Wadis et eaux turquoise", "Désert et nuits étoilées", "Mer et côte", "Road trip et aventure"]
    : answers.experiences;
  const candidates: string[] = ["Mascate"];
  const add = (stop: string) => { if (!candidates.includes(stop)) candidates.push(stop); };

  if (selected.includes("Villages et culture")) add("Nizwa");
  if (selected.includes("Montagnes et routes")) add("Jebel Akhdar");
  if (selected.includes("Montagnes et routes") && answers.duration === "13 jours et plus") add("Jebel Shams");
  if (selected.includes("Wadis et eaux turquoise")) add(selected.includes("Désert et nuits étoilées") ? "Wadi Bani Khalid" : "Wadi Shab");
  if (selected.includes("Désert et nuits étoilées")) add("Wahiba Sands");
  if (selected.includes("Mer et côte")) add("Sur et la côte");
  if (selected.includes("Road trip et aventure")) add("Route intérieure");
  if (candidates.length === 1) { add("Wadi Shab"); add("Nizwa"); }

  const stopLimit = answers.duration === "5-6 jours" ? 2 : answers.duration === "7-9 jours" ? 3 : answers.duration === "10-12 jours" ? 5 : 8;
  const interior = candidates.slice(1).slice(0, stopLimit);
  const stops = ["Mascate", ...interior, "Mascate"];
  const travellerNote = answers.company === "En famille"
    ? "Des étapes plus douces, avec des pauses pensées pour tous."
    : answers.company === "En couple"
      ? "Une route à deux, entre paysages et temps pour souffler."
      : answers.company === "Seul"
        ? "Une route simple à suivre, avec de la liberté à chaque étape."
        : "Une route à partager, avec assez de souplesse pour le groupe.";
  const durationNote = answers.duration === "5-6 jours"
    ? "Un aperçu resserré autour de deux paysages forts."
    : answers.duration === "13 jours et plus"
      ? "Plus de temps pour ralentir, ajouter des détours et garder des journées libres."
      : answers.duration === "10-12 jours"
        ? "Le temps de relier plusieurs paysages sans courir."
        : "Un équilibre entre grands paysages et rythme confortable.";
  const rhythmNote = answers.rhythm === "Aventure et liberté"
    ? "Un rythme plus mobile, avec davantage de route et d’exploration."
    : answers.rhythm === "Confort avant tout"
      ? "Un rythme plus doux, avec des étapes mieux espacées."
      : "Un bon équilibre entre découverte, route et temps pour souffler.";
  const exploreNote = answers.explore === "Je conduis moi-même"
    ? "Une proposition pensée pour garder de la liberté au volant."
    : answers.explore === "Avec chauffeur"
      ? "Une proposition où les longues liaisons se vivent sans conduire."
      : answers.explore === "Avec un guide"
        ? "Une proposition à parcourir avec les repères d’un guide sur place."
        : "Canary ajustera le mélange entre liberté, chauffeur et accompagnement.";
  const monthNote = answers.month && answers.month !== "Je ne sais pas encore"
    ? `Départ envisagé en ${answers.month}.`
    : "La période sera précisée avec Canary.";
  return { stops, travellerNote, durationNote, rhythmNote, exploreNote, monthNote };
}

function TripBuilder({ open, onClose, seedExperiences = [] }: { open: boolean; onClose: () => void; seedExperiences?: string[] }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<BuilderAnswers>(initialAnswers);
  const [forming, setForming] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const routePlan = useMemo(() => buildRoutePlan(answers), [answers]);
  const selectedExperienceText = answers.experiences.length ? answers.experiences.join(" · ") : "Vos envies d’Oman";

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(builderStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { step?: number; answers?: BuilderAnswers };
        if (parsed.answers) setAnswers({ ...initialAnswers, ...parsed.answers });
        if (parsed.step && parsed.step >= 1 && parsed.step <= 11) setStep(parsed.step);
      }
    } catch { /* sessionStorage may be unavailable; the builder still works in memory. */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.sessionStorage.setItem(builderStorageKey, JSON.stringify({ step, answers })); } catch { /* keep the current session usable without storage. */ }
  }, [answers, hydrated, step]);

  useEffect(() => {
    if (!open || !seedExperiences.length) return;
    setAnswers((current) => ({ ...current, experiences: Array.from(new Set([...current.experiences, ...seedExperiences])) }));
  }, [open, seedExperiences]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  const update = (key: keyof BuilderAnswers, value: string) => setAnswers((current) => ({ ...current, [key]: value }));
  const chooseAndContinue = (key: keyof BuilderAnswers, value: string) => { update(key, value); setStep((current) => current + 1); };
  const toggleExperience = (value: string) => setAnswers((current) => ({ ...current, experiences: current.experiences.includes(value) ? current.experiences.filter((item) => item !== value) : [...current.experiences, value] }));
  const createOman = () => { setForming(true); window.setTimeout(() => { setForming(false); setStep(7); }, 420); };
  const goBack = () => { if (!forming) setStep((current) => Math.max(1, current - 1)); };
  const resetBuilder = () => { setStep(1); setAnswers(initialAnswers); setForming(false); try { window.sessionStorage.removeItem(builderStorageKey); } catch { /* no-op */ } };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (leadIntegration.endpoint) { /* Integration hook reserved for Canary's approved destination. */ } setStep(11); };
  if (!open) return null;

  return <div className="builder-backdrop" role="dialog" aria-modal="true" aria-label="Votre Oman by Canary"><div className="builder-panel">
    <div className="builder-topbar"><div className="builder-topbar-start"><button className="back-button" type="button" onClick={goBack} disabled={step === 1 || forming} aria-label="Retour à l’étape précédente">← Retour</button><BrandMark /></div><span className="builder-lockup">Votre Oman <span>by Canary</span></span><button className="close-button" type="button" onClick={onClose} aria-label="Fermer">×</button></div>
    {step < 11 ? <><div className="builder-progress-meta"><span>Question {Math.min(step, 10)} sur 10</span><span>{Math.min(step, 10) * 10}%</span></div><div className="builder-progress" aria-hidden="true"><span style={{ width: Math.min(step, 10) * 10 + "%" }} /></div></> : null}
    <div className="builder-body">
      {forming ? <div className="forming-state"><div className="route-loader" aria-hidden="true"><i /><i /><i /><i /></div><h2>Votre Oman prend forme...</h2><p>Nous dessinons une première proposition à partir de vos envies.</p></div> : null}
      {!forming && step === 1 ? <BuilderStep title="Avec qui voyagez-vous ?" note="Dites-nous simplement avec qui vous partez."><div className="choice-grid two-columns">{[["Seul", "Un voyage à votre rythme"], ["En couple", "Des moments à deux"], ["En famille", "Des souvenirs pour tous"], ["Entre amis", "La route en bonne compagnie"]].map(([title, subtitle]) => <BuilderChoice key={title} title={title} subtitle={subtitle} onClick={() => chooseAndContinue("company", title)} selected={answers.company === title} />)}</div></BuilderStep> : null}
      {!forming && step === 2 ? <BuilderStep title="Quand souhaitez-vous partir ?" note="Choisissez un mois, même approximatif. Vous pourrez le modifier ensuite."><div className="month-grid">{["Septembre", "Octobre", "Novembre", "Décembre", "Janvier", "Février", "Mars", "Avril", "Mai"].map((month) => <BuilderChoice key={month} title={month} onClick={() => chooseAndContinue("month", month)} selected={answers.month === month} />)}</div><button className="text-choice" type="button" onClick={() => chooseAndContinue("month", "Je ne sais pas encore")}>Je ne sais pas encore <ArrowIcon /></button></BuilderStep> : null}
      {!forming && step === 3 ? <BuilderStep title="Combien de jours souhaitez-vous passer à Oman ?" note="Choisissez une durée, nous ajusterons le rythme ensuite."><div className="duration-list">{[["5-6 jours", "Pour une première découverte, comptez 5 à 6 jours."], ["7-9 jours", "Le temps de relier les grands paysages"], ["10-12 jours", "Une découverte plus profonde"], ["13 jours et plus", "Prendre le temps d’aller plus loin"]].map(([title, subtitle]) => <BuilderChoice key={title} title={title} subtitle={subtitle} onClick={() => chooseAndContinue("duration", title)} selected={answers.duration === title} />)}</div><button className="text-choice" type="button" onClick={() => chooseAndContinue("duration", "Je ne sais pas encore")}>Je ne sais pas encore <ArrowIcon /></button></BuilderStep> : null}
      {!forming && step === 4 ? <BuilderStep title="Qu’avez-vous envie de vivre à Oman ?" note="Choisissez tout ce qui vous attire. Il n’y a pas de mauvaise réponse."><div className="experience-grid">{experiences.map((item) => <BuilderChoice key={item.id} title={item.id} image={item.image} onClick={() => toggleExperience(item.id)} selected={answers.experiences.includes(item.id)} />)}</div><button className="builder-primary full-width" type="button" disabled={!answers.experiences.length} onClick={() => setStep(5)}>Continuer <ArrowIcon /></button></BuilderStep> : null}
      {!forming && step === 5 ? <BuilderStep title="Comment aimez-vous voyager ?" note="Vous préférez l’aventure, l’équilibre ou le confort ?"><div className="choice-stack">{[["Aventure et liberté", "Bouger, explorer, conduire, découvrir"], ["Un bon équilibre", "Aventure et confort sans courir"], ["Confort avant tout", "Prendre son temps et voyager sereinement"]].map(([title, subtitle]) => <BuilderChoice key={title} title={title} subtitle={subtitle} onClick={() => chooseAndContinue("rhythm", title)} selected={answers.rhythm === title} />)}</div></BuilderStep> : null}
      {!forming && step === 6 ? <BuilderStep title="Comment souhaitez-vous explorer Oman ?" note="Canary adapte la première proposition à votre façon de voyager."><div className="choice-stack">{[["Je conduis moi-même", "La liberté de la route"], ["Avec chauffeur", "Profiter du voyage sans conduire"], ["Avec un guide", "Découvrir Oman avec les repères d’un guide sur place"], ["Choisissez pour moi", "Canary vous proposera la formule la plus adaptée"]].map(([title, subtitle]) => <BuilderChoice key={title} title={title} subtitle={subtitle} onClick={() => { update("explore", title); createOman(); }} selected={answers.explore === title} />)}</div></BuilderStep> : null}
      {!forming && step === 7 ? <BuilderStep title="Votre Oman" note="Une première proposition, à valider ensuite avec Canary."><div className="builder-summary-grid"><span>{answers.company || "Voyageur"}</span><span>{answers.month || "Période à définir"}</span><span>{answers.duration || "Durée à définir"}</span><span>{answers.rhythm || "Rythme à définir"}</span><span>{answers.explore || "Exploration à définir"}</span></div><p className="builder-summary-line">{selectedExperienceText}</p><div className="route-notes"><p>{routePlan.travellerNote}</p><p>{routePlan.durationNote}</p><p>{routePlan.rhythmNote}</p><p>{routePlan.exploreNote}</p><p>{routePlan.monthNote}</p></div><div className="route-preview">{routePlan.stops.map((stop, index) => <span key={stop + index}><strong>{stop}</strong>{index < routePlan.stops.length - 1 ? <i aria-hidden="true" /> : null}</span>)}</div><button className="builder-primary full-width" type="button" onClick={() => setStep(8)}>Personnaliser mon voyage <ArrowIcon /></button></BuilderStep> : null}
      {!forming && step === 8 ? <BuilderStep title="Quel niveau de confort recherchez-vous ?" note="Pas de prix à ce stade. Nous ajusterons le voyage avec vous."><div className="choice-stack">{["Simple et confortable", "Confort supérieur", "Haut de gamme", "Je ne sais pas encore"].map((title) => <BuilderChoice key={title} title={title} onClick={() => chooseAndContinue("comfort", title)} selected={answers.comfort === title} />)}</div></BuilderStep> : null}
      {!forming && step === 9 ? <BuilderStep title="Y a-t-il quelque chose que Canary devrait savoir ?" note="Cette étape est facultative."><label className="builder-field-label" htmlFor="builder-notes">Enfants, lune de miel, mobilité ou régime alimentaire</label><textarea id="builder-notes" className="builder-textarea" value={answers.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Écrivez quelques mots si vous le souhaitez..." /><button className="builder-primary full-width" type="button" onClick={() => setStep(10)}>Continuer <ArrowIcon /></button><button className="text-choice centered" type="button" onClick={() => setStep(10)}>Je préfère ne rien ajouter</button></BuilderStep> : null}
      {!forming && step === 10 ? <BuilderStep title="Prêt à créer votre voyage ?" note="Ces coordonnées serviront à reprendre votre première proposition avec Canary."><form className="contact-form" onSubmit={submit}><label>Prénom<input required value={answers.firstName} onChange={(event) => update("firstName", event.target.value)} placeholder="Votre prénom" /></label><label>WhatsApp<input required inputMode="tel" value={answers.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} placeholder="Votre numéro WhatsApp" /></label><label>E-mail <span>(facultatif)</span><input type="email" value={answers.email} onChange={(event) => update("email", event.target.value)} placeholder="vous@exemple.fr" /></label><button className="builder-primary full-width" type="submit">Voir ma première proposition <ArrowIcon /></button></form></BuilderStep> : null}
      {!forming && step === 11 ? <div className="success-state"><span className="success-mark" aria-hidden="true">✓</span><h2>Votre Oman est prêt à être affiné.</h2><p>Voici la première proposition construite à partir de vos choix.</p><div className="success-summary"><strong>{selectedExperienceText}</strong><span>{answers.company} · {answers.duration} · {answers.month}</span><span>{routePlan.stops.join(" → ")}</span></div><button className="builder-primary full-width" type="button" onClick={() => setStep(7)}>Revoir ma proposition</button><button className="text-choice centered" type="button" onClick={resetBuilder}>Recommencer</button></div> : null}
    </div>
    {step < 11 ? <span className="builder-footnote">Vos réponses restent un point de départ, jamais un voyage imposé.</span> : null}
  </div></div>;
}

export default function Home() {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderSeed, setBuilderSeed] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const openBuilder = (seed: string[] = []) => { setBuilderSeed(seed); setBuilderOpen(true); };
  const toggleLandingExperience = (experience: string) => setSelectedExperiences((current) => current.includes(experience) ? current.filter((item) => item !== experience) : [...current, experience]);
  return <main id="top">
    <section className="hero" aria-labelledby="hero-title"><img className="hero-image" src={imageSet.mountain} srcSet={`${imageSet.mountainThumb} 640w, ${imageSet.mountain} 1800w`} sizes="100vw" alt="Route à travers les montagnes d’Oman" loading="eager" decoding="async" /><div className="hero-scrim" />
      <header className="site-nav"><BrandMark inverse /><nav aria-label="Navigation principale"><a href="#oman">Oman</a><a href="#canary">Pourquoi Canary</a><a href="#builder">Votre voyage</a></nav><button className="nav-cta" type="button" onClick={() => openBuilder()}>Créer mon voyage <ArrowIcon /></button></header>
      <div className="hero-content"><p className="hero-kicker">Canary Travel Oman · France</p><h1 id="hero-title">Peut-être que vous n’avez pas besoin de Dubaï.<br /><em>Peut-être que vous avez besoin d’Oman.</em></h1><p className="hero-subline">Découvrez Oman à votre façon avec Canary.</p><div className="hero-actions"><button className="button button-light" type="button" onClick={() => openBuilder()}>Créer mon voyage à Oman <ArrowIcon /></button><a className="hero-link" href="#oman">Découvrir Oman <span aria-hidden="true">↓</span></a></div></div><div className="hero-caption"><span>01</span><span>La route ouvre le voyage.</span></div>
    </section>

    <section className="reframe-section" id="oman" aria-labelledby="reframe-title"><div className="reframe-intro"><p className="section-kicker">Oman, autrement</p><h2 id="reframe-title">Vous pensez connaître<br />le Moyen-Orient ?</h2><p className="reframe-punch">Regardez encore.</p></div><div className="experience-mosaic"><figure className="mosaic-feature"><img src={imageSet.wadi} srcSet={`${imageSet.wadiThumb} 640w, ${imageSet.wadi} 1800w`} sizes="(max-width: 640px) 100vw, 75vw" alt="Les eaux calmes de Wadi Shab entourées de hautes parois rocheuses" loading="lazy" decoding="async" /><figcaption><strong>Wadis</strong><span>Eaux turquoise, silence minéral</span></figcaption></figure><figure className="mosaic-tall"><img src={imageSet.road} srcSet={`${imageSet.roadThumb} 640w, ${imageSet.road} 1800w`} sizes="(max-width: 640px) 100vw, 45vw" alt="Un 4x4 progresse sur une piste rocheuse dans les montagnes d’Oman" loading="lazy" decoding="async" /><figcaption><strong>Montagnes</strong><span>Des routes qui donnent envie de ralentir</span></figcaption></figure><figure className="mosaic-small"><img src={imageSet.desert} srcSet={`${imageSet.desertThumb} 640w, ${imageSet.desert} 1800w`} sizes="(max-width: 640px) 100vw, 45vw" alt="Un 4x4 blanc au milieu des dunes de Wahiba Sands" loading="lazy" decoding="async" /><figcaption><strong>Désert</strong><span>Des nuits sous un ciel immense</span></figcaption></figure><figure className="mosaic-small coast-mosaic"><img src={imageSet.coast} srcSet={`${imageSet.coastThumb} 640w, ${imageSet.coast} 1800w`} sizes="(max-width: 640px) 100vw, 45vw" alt="Un boutre traditionnel navigue entre la mer et les montagnes de Musandam" loading="lazy" decoding="async" /><figcaption><strong>Mer</strong><span>La côte loin du bruit</span></figcaption></figure></div><div className="reframe-close"><p>Oman est bien plus que vous ne l’imaginez.</p><button className="text-link" type="button" onClick={() => openBuilder()}>Créer mon voyage <ArrowIcon /></button></div></section>

    <section className="make-section" aria-labelledby="make-title"><div className="make-intro"><p className="section-kicker">Votre rythme</p><SectionHeading intro="Pas de circuit imposé. Un voyage construit autour de vos envies.">Maintenant, faites-en votre Oman.</SectionHeading></div><div className="make-layout"><div className="make-visual"><img src={imageSet.people} srcSet={`${imageSet.peopleThumb} 640w, ${imageSet.people} 1600w`} sizes="(max-width: 640px) 100vw, 55vw" alt="Deux voyageurs profitent d’une vue paisible sur les montagnes autour de Nizwa" loading="lazy" decoding="async" /><div className="visual-note">Chaque choix peut guider la route.</div></div><div className="preference-list">{experiences.slice(0, 6).map((item) => <button type="button" key={item.id} aria-pressed={selectedExperiences.includes(item.id)} className={selectedExperiences.includes(item.id) ? "preference-row is-selected" : "preference-row"} onClick={() => toggleLandingExperience(item.id)}><span>{item.id}</span><span aria-hidden="true">{selectedExperiences.includes(item.id) ? "✓" : "↗"}</span></button>)}<button className="button button-dark" type="button" onClick={() => openBuilder(selectedExperiences)}>Construire mon Oman <ArrowIcon /></button></div></div></section>

    <section className="canary-section" id="canary" aria-labelledby="canary-title"><div className="canary-copy"><p className="section-kicker">Pourquoi Canary</p><h2 id="canary-title">Oman avec quelqu’un qui sait où regarder.</h2><p>Un premier échange pour transformer vos envies en une route claire, avec le rythme qui vous convient.</p><button className="text-link" type="button" onClick={() => openBuilder()}>Parler de mon voyage <ArrowIcon /></button></div><div className="canary-pillars"><article><span className="pillar-index">01</span><h3>Votre rythme</h3><p>Le Trip Builder commence par vos envies, pas par un circuit imposé.</p></article><article><span className="pillar-index">02</span><h3>La route en premier</h3><p>Une première proposition lisible, à reprendre ensuite avec Canary.</p></article></div></section>

    <section className="route-section" aria-labelledby="route-title"><div className="route-heading"><p className="section-kicker">Une idée de route, à personnaliser</p><h2 id="route-title">Une première idée de route.</h2><p>De Mascate aux montagnes, du désert à la côte. Chaque étape peut être adaptée.</p></div><div className="route-layout"><div className="route-image"><img src={imageSet.road} srcSet={`${imageSet.roadThumb} 640w, ${imageSet.road} 1800w`} sizes="(max-width: 900px) 100vw, 60vw" alt="Route qui traverse les montagnes d’Oman" loading="lazy" decoding="async" /></div><div className="route-list">{["Mascate", "Wadi Shab", "Nizwa", "Jebel Akhdar", "Wahiba Sands", "La côte", "Mascate"].map((stop, index) => <div key={stop + index} className="route-row"><span>{String(index + 1).padStart(2, "0")}</span><strong>{stop}</strong>{index < 6 ? <i aria-hidden="true" /> : null}</div>)}<button className="text-link" type="button" onClick={() => openBuilder()}>Adapter cette route <ArrowIcon /></button></div></div></section>

    <section className="builder-section" id="builder" aria-labelledby="builder-title"><div><p className="section-kicker">Votre Oman · by Canary</p><h2 id="builder-title">Commencez par une envie.</h2><p>Quelques choix simples. Une première proposition à construire avec Canary.</p></div><button className="builder-launch" type="button" onClick={() => openBuilder()}><span>Ouvrir le Trip Builder</span><ArrowIcon /></button></section>

    <section className="faq-section" aria-labelledby="faq-title"><p className="section-kicker">Questions fréquentes</p><h2 id="faq-title">Avant de prendre la route.</h2><div className="faq-list">{[["Peut-on faire un road trip à Oman ?", "Oui. Oman se découvre très bien par la route. Le parcours et le rythme doivent être adaptés à votre expérience et repris avec Canary."], ["Oman convient-il à un voyage en famille ?", "Oui, avec un rythme et des étapes pensés pour l’âge des enfants. Le parcours pourra être ajusté à votre famille."], ["Faut-il conduire soi-même ?", "Non. Vous pouvez conduire, voyager avec chauffeur, avec un guide ou demander à Canary de vous proposer la formule la plus adaptée."], ["Combien de jours prévoir ?", "Pour une première découverte, comptez 5 à 6 jours. 7 à 12 jours permettent de relier davantage de paysages sans courir."], ["Le voyage est-il personnalisable ?", "Oui. Le Trip Builder crée une première proposition. Chaque étape peut ensuite être adaptée avec Canary."], ["Comment fonctionne le Trip Builder ?", "Vous choisissez votre rythme, vos envies et votre façon d’explorer Oman. La première proposition reste un point de départ à reprendre avec Canary."]].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

    <section className="final-cta" id="contact"><div className="final-cta-image"><img src={imageSet.wadi} srcSet={`${imageSet.wadiThumb} 640w, ${imageSet.wadi} 1800w`} sizes="100vw" alt="Wadi d’Oman au soleil" loading="lazy" decoding="async" /></div><div className="final-cta-copy"><p className="section-kicker">Canary Travel Oman</p><h2>Peut-être que votre prochain voyage n’est pas Dubaï.<br /><em>Peut-être que c’est Oman.</em></h2><p>Canary transforme cette envie en voyage.</p><button className="button button-light" type="button" onClick={() => openBuilder()}>Créer mon voyage à Oman <ArrowIcon /></button></div></section>
    <footer className="site-footer"><BrandMark /><div><a href="#oman">Oman</a><a href="#canary">Pourquoi Canary</a><a href="#builder">Votre voyage</a></div><span>© Canary Travel Oman</span></footer>
    <TripBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} seedExperiences={builderSeed} />
  </main>;
}

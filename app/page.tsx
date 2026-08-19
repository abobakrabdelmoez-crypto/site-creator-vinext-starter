"use client";

import { FormEvent, useMemo, useState } from "react";

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

const imageSet = {
  mountain: "https://images.unsplash.com/photo-1633583929289-918efe6331c2?auto=format&fit=crop&w=2400&q=85",
  wadi: "https://images.unsplash.com/photo-1635749688148-3ead1499e58e?auto=format&fit=crop&w=2400&q=85",
  road: "https://images.pexels.com/photos/31093321/pexels-photo-31093321.jpeg?auto=compress&cs=tinysrgb&w=2400",
  desert: "https://images.unsplash.com/photo-1582617306030-1576d809f3e0?auto=format&fit=crop&w=2400&q=85",
  coast: "https://images.unsplash.com/photo-1615399144021-822ba908c6f3?auto=format&fit=crop&w=2400&q=85",
  people: "https://images.pexels.com/photos/37357096/pexels-photo-37357096.jpeg?auto=compress&cs=tinysrgb&w=2400",
};
const officialLogo = "https://canarytraveloman.com/wp-content/uploads/2019/12/11121Canary-final-logo.jpg";

const initialAnswers: BuilderAnswers = { company: "", month: "", duration: "", experiences: [], rhythm: "", explore: "", comfort: "", notes: "", firstName: "", whatsapp: "", email: "" };
const experiences = [
  { id: "Montagnes et routes", image: imageSet.mountain },
  { id: "Wadis et eaux turquoise", image: imageSet.wadi },
  { id: "Désert et nuits étoilées", image: imageSet.desert },
  { id: "Mer et côte", image: imageSet.coast },
  { id: "Villages et culture", image: imageSet.road },
  { id: "Road trip et aventure", image: imageSet.mountain },
  { id: "Un peu de tout", image: imageSet.people },
];
const routeStops = ["Mascate", "Wadi Shab", "Nizwa", "Jebel Akhdar", "Wahiba Sands", "La côte", "Mascate"];

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return <a className={inverse ? "brand-mark brand-mark-inverse" : "brand-mark"} href="#top" aria-label="Canary International Travel & Tourism, accueil"><img className="brand-image" src={officialLogo} alt="Canary International Travel & Tourism" /></a>;
}

function ArrowIcon() { return <span aria-hidden="true" className="arrow-icon">↗</span>; }

function SectionHeading({ children, intro }: { children: React.ReactNode; intro?: string }) {
  return <div className="section-heading"><h2>{children}</h2>{intro ? <p>{intro}</p> : null}</div>;
}

function MediaPlaceholder({ label, ratio = "wide" }: { label: string; ratio?: "wide" | "portrait" | "square" }) {
  return <div className={"media-placeholder media-" + ratio}><span>Visuel à confirmer</span><strong>{label}</strong><small>Remplacer par une photo réelle fournie par Canary</small></div>;
}

function BuilderChoice({ title, subtitle, selected, onClick, image }: { title: string; subtitle?: string; selected?: boolean; onClick: () => void; image?: string }) {
  return <button className={selected ? "builder-choice is-selected" : "builder-choice"} type="button" onClick={onClick}>{image ? <img src={image} alt="" /> : null}<span className="choice-copy"><strong>{title}</strong>{subtitle ? <small>{subtitle}</small> : null}</span><span className="choice-mark" aria-hidden="true">{selected ? "✓" : ""}</span></button>;
}

function BuilderStep({ children, title, note }: { children: React.ReactNode; title: string; note?: string }) {
  return <div className="builder-step"><p className="step-kicker">Votre Oman <span>by Canary</span></p><h2>{title}</h2>{note ? <p className="step-note">{note}</p> : null}{children}</div>;
}

function TripBuilder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<BuilderAnswers>(initialAnswers);
  const [forming, setForming] = useState(false);
  const update = (key: keyof BuilderAnswers, value: string) => setAnswers((current) => ({ ...current, [key]: value }));
  const close = () => { onClose(); window.setTimeout(() => { setStep(1); setAnswers(initialAnswers); setForming(false); }, 250); };
  const chooseAndContinue = (key: keyof BuilderAnswers, value: string) => { update(key, value); window.setTimeout(() => setStep((current) => current + 1), 180); };
  const toggleExperience = (value: string) => setAnswers((current) => ({ ...current, experiences: current.experiences.includes(value) ? current.experiences.filter((item) => item !== value) : [...current.experiences, value] }));
  const createOman = () => { setForming(true); window.setTimeout(() => { setForming(false); setStep(7); }, 700); };
  const summary = useMemo(() => (answers.duration || "9 jours") + " · " + (answers.company || "En couple") + " · " + (answers.experiences[0] || "Nature"), [answers]);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setStep(11); };
  if (!open) return null;

  return <div className="builder-backdrop" role="dialog" aria-modal="true" aria-label="Votre Oman by Canary"><div className="builder-panel">
    <div className="builder-topbar"><BrandMark /><span className="builder-lockup">Votre Oman <span>by Canary</span></span><button className="close-button" type="button" onClick={close} aria-label="Fermer">×</button></div>
    {step < 11 ? <div className="builder-progress" aria-label={"Question " + Math.min(step, 10) + " sur 10"}><span style={{ width: Math.min(step, 10) * 10 + "%" }} /></div> : null}
    <div className="builder-body">
      {forming ? <div className="forming-state"><div className="route-loader" aria-hidden="true"><i /><i /><i /><i /></div><h2>Votre Oman prend forme...</h2><p>Nous dessinons un premier fil rouge à partir de vos envies.</p></div> : null}
      {!forming && step === 1 ? <BuilderStep title="Avec qui voyagez-vous ?" note="Une première intuition suffit."><div className="choice-grid two-columns">{[["Seul", "Un voyage à votre rythme"], ["En couple", "Des moments à deux"], ["En famille", "Des souvenirs pour tous"], ["Entre amis", "La route en bonne compagnie"]].map(([title, subtitle]) => <BuilderChoice key={title} title={title} subtitle={subtitle} onClick={() => chooseAndContinue("company", title)} selected={answers.company === title} />)}</div></BuilderStep> : null}
      {!forming && step === 2 ? <BuilderStep title="Quand souhaitez-vous partir ?" note="Cette page propose des départs de septembre à mai. Le mois le plus adapté dépend de l’itinéraire et des expériences souhaitées."><div className="month-grid">{["Septembre", "Octobre", "Novembre", "Décembre", "Janvier", "Février", "Mars", "Avril", "Mai"].map((month) => <BuilderChoice key={month} title={month} onClick={() => chooseAndContinue("month", month)} selected={answers.month === month} />)}</div><button className="text-choice" type="button" onClick={() => chooseAndContinue("month", "Je ne sais pas encore")}>Je ne sais pas encore <ArrowIcon /></button></BuilderStep> : null}
      {!forming && step === 3 ? <BuilderStep title="Combien de jours souhaitez-vous passer à Oman ?" note="Choisissez une durée, nous ajusterons le rythme ensuite."><div className="duration-list">{[["5-6 jours", "Une première rencontre avec Oman"], ["7-9 jours", "Le temps de relier les grands paysages"], ["10-12 jours", "Une découverte plus profonde"], ["13 jours et plus", "Prendre le temps d’aller plus loin"]].map(([title, subtitle]) => <BuilderChoice key={title} title={title} subtitle={subtitle} onClick={() => chooseAndContinue("duration", title)} selected={answers.duration === title} />)}</div><button className="text-choice" type="button" onClick={() => chooseAndContinue("duration", "Je ne sais pas encore")}>Je ne sais pas encore <ArrowIcon /></button></BuilderStep> : null}
      {!forming && step === 4 ? <BuilderStep title="Qu’avez-vous envie de vivre à Oman ?" note="Choisissez tout ce qui vous attire. Il n’y a pas de mauvaise réponse."><div className="experience-grid">{experiences.map((item) => <BuilderChoice key={item.id} title={item.id} image={item.image} onClick={() => toggleExperience(item.id)} selected={answers.experiences.includes(item.id)} />)}</div><button className="builder-primary full-width" type="button" disabled={!answers.experiences.length} onClick={() => setStep(5)}>Continuer <ArrowIcon /></button></BuilderStep> : null}
      {!forming && step === 5 ? <BuilderStep title="Comment aimez-vous voyager ?" note="Le bon rythme est celui qui vous ressemble."><div className="choice-stack">{[["Aventure et liberté", "Bouger, explorer, conduire, découvrir"], ["Un bon équilibre", "Aventure et confort sans courir"], ["Confort avant tout", "Prendre son temps et voyager sereinement"]].map(([title, subtitle]) => <BuilderChoice key={title} title={title} subtitle={subtitle} onClick={() => chooseAndContinue("rhythm", title)} selected={answers.rhythm === title} />)}</div></BuilderStep> : null}
      {!forming && step === 6 ? <BuilderStep title="Comment souhaitez-vous explorer Oman ?" note="Canary peut adapter la route à votre façon de voyager."><div className="choice-stack">{[["Je conduis moi-même", "La liberté de la route"], ["Avec chauffeur", "Profiter du voyage sans conduire"], ["Avec un guide", "Découvrir Oman avec quelqu’un qui le connaît vraiment"], ["Choisissez pour moi", "Canary adapte le meilleur mélange à votre voyage"]].map(([title, subtitle]) => <BuilderChoice key={title} title={title} subtitle={subtitle} onClick={() => { update("explore", title); createOman(); }} selected={answers.explore === title} />)}</div></BuilderStep> : null}
      {!forming && step === 7 ? <BuilderStep title="Votre Oman" note="Ce n’est qu’un début. Canary peut adapter chaque étape à vos envies."><p className="builder-summary-line">{summary}</p><div className="route-preview">{routeStops.map((stop, index) => <span key={stop + index}><strong>{stop}</strong>{index < routeStops.length - 1 ? <i aria-hidden="true" /> : null}</span>)}</div><button className="builder-primary full-width" type="button" onClick={() => setStep(8)}>Personnaliser mon voyage <ArrowIcon /></button></BuilderStep> : null}
      {!forming && step === 8 ? <BuilderStep title="Quel niveau de confort recherchez-vous ?" note="Pas de prix à ce stade. Nous ajusterons le voyage avec vous."><div className="choice-stack">{["Simple et confortable", "Confort supérieur", "Haut de gamme", "Je ne sais pas encore"].map((title) => <BuilderChoice key={title} title={title} onClick={() => chooseAndContinue("comfort", title)} selected={answers.comfort === title} />)}</div></BuilderStep> : null}
      {!forming && step === 9 ? <BuilderStep title="Y a-t-il quelque chose que Canary devrait savoir ?" note="Cette étape est facultative."><textarea className="builder-textarea" value={answers.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Enfants, lune de miel, mobilité, régime alimentaire..." /><button className="builder-primary full-width" type="button" onClick={() => setStep(10)}>Continuer <ArrowIcon /></button><button className="text-choice centered" type="button" onClick={() => setStep(10)}>Je préfère ne rien ajouter</button></BuilderStep> : null}
      {!forming && step === 10 ? <BuilderStep title="Prêt à créer votre voyage ?" note="L’équipe Canary utilisera vos choix pour préparer une première proposition."><form className="contact-form" onSubmit={submit}><label>Prénom<input required value={answers.firstName} onChange={(event) => update("firstName", event.target.value)} placeholder="Votre prénom" /></label><label>WhatsApp<input required inputMode="tel" value={answers.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} placeholder="Votre numéro WhatsApp" /></label><label>E-mail <span>(facultatif)</span><input type="email" value={answers.email} onChange={(event) => update("email", event.target.value)} placeholder="vous@exemple.fr" /></label><button className="builder-primary full-width" type="submit">Continuer avec Canary <ArrowIcon /></button></form></BuilderStep> : null}
      {!forming && step === 11 ? <div className="success-state"><span className="success-mark" aria-hidden="true">✓</span><h2>Votre voyage commence ici.</h2><p>L’équipe Canary reprendra vos choix pour construire avec vous un voyage qui vous ressemble.</p><div className="success-summary"><strong>{summary}</strong><span>{answers.rhythm || "Un bon équilibre"} · {answers.explore || "Choisissez pour moi"}</span></div><a className="builder-primary full-width" href="#contact" onClick={close}>Continuer avec Canary <ArrowIcon /></a><small className="placeholder-note">Lien WhatsApp final à connecter dès que le numéro officiel est confirmé.</small></div> : null}
    </div>
    {step < 11 ? <span className="builder-footnote">Vos réponses restent un point de départ, jamais un voyage imposé.</span> : null}
  </div></div>;
}

export default function Home() {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const toggleLandingExperience = (experience: string) => setSelectedExperiences((current) => current.includes(experience) ? current.filter((item) => item !== experience) : [...current, experience]);
  return <main id="top">
    <section className="hero" aria-labelledby="hero-title"><img className="hero-image" src={imageSet.mountain} alt="Route à travers les montagnes d’Oman" /><div className="hero-scrim" />
      <header className="site-nav"><BrandMark inverse /><nav aria-label="Navigation principale"><a href="#oman">Oman</a><a href="#canary">Pourquoi Canary</a><a href="#builder">Votre voyage</a></nav><button className="nav-cta" type="button" onClick={() => setBuilderOpen(true)}>Créer mon voyage <ArrowIcon /></button></header>
      <div className="hero-content"><p className="hero-kicker">Canary Travel Oman · France</p><h1 id="hero-title">Peut-être que vous n’avez pas besoin de Dubaï.<br /><em>Peut-être que vous avez besoin d’Oman.</em></h1><p className="hero-subline">Découvrez Oman à votre façon avec Canary.</p><div className="hero-actions"><button className="button button-light" type="button" onClick={() => setBuilderOpen(true)}>Créer mon voyage à Oman <ArrowIcon /></button><a className="hero-link" href="#oman">Découvrir Oman <span aria-hidden="true">↓</span></a></div></div><div className="hero-caption"><span>01</span><span>La route ouvre le voyage.</span></div>
    </section>

      <section className="reframe-section" id="oman" aria-labelledby="reframe-title"><div className="reframe-intro"><p className="section-kicker">Oman, autrement</p><h2 id="reframe-title">Vous pensez connaître<br />le Moyen-Orient ?</h2><p className="reframe-punch">Regardez encore.</p></div><div className="experience-mosaic"><figure className="mosaic-feature"><img src={imageSet.wadi} alt="Les eaux calmes de Wadi Shab entourées de hautes parois rocheuses" /><figcaption><strong>Wadis</strong><span>Eaux turquoise, silence minéral</span></figcaption></figure><figure className="mosaic-tall"><img src={imageSet.road} alt="Un 4x4 progresse sur une piste rocheuse dans les montagnes d’Oman" /><figcaption><strong>Montagnes</strong><span>Des routes qui donnent envie de ralentir</span></figcaption></figure><figure className="mosaic-small"><img src={imageSet.desert} alt="Un 4x4 blanc au milieu des dunes de Wahiba Sands" /><figcaption><strong>Désert</strong><span>Des nuits vastes et étoilées</span></figcaption></figure><figure className="mosaic-small coast-mosaic"><img src={imageSet.coast} alt="Un boutre traditionnel navigue entre la mer et les montagnes de Musandam" /><figcaption><strong>Mer</strong><span>La côte, sans bruit autour</span></figcaption></figure></div><div className="reframe-close"><p>Oman est bien plus que ce que vous ne l’imaginiez.</p><button className="text-link" type="button" onClick={() => setBuilderOpen(true)}>Créer mon voyage <ArrowIcon /></button></div></section>

    <section className="make-section" aria-labelledby="make-title"><div className="make-intro"><p className="section-kicker">Votre rythme</p><SectionHeading intro="Pas de circuit imposé. Un voyage construit autour de vos envies.">Maintenant, faites-en votre Oman.</SectionHeading></div><div className="make-layout"><div className="make-visual"><img src={imageSet.people} alt="Deux voyageurs profitent d’une vue paisible sur les montagnes autour de Nizwa" /><div className="visual-note">Chaque choix change la route.</div></div><div className="preference-list">{experiences.slice(0, 6).map((item) => <button type="button" key={item.id} className={selectedExperiences.includes(item.id) ? "preference-row is-selected" : "preference-row"} onClick={() => toggleLandingExperience(item.id)}><span>{item.id}</span><span aria-hidden="true">{selectedExperiences.includes(item.id) ? "✓" : "↗"}</span></button>)}<button className="button button-dark" type="button" onClick={() => setBuilderOpen(true)}>Construire mon Oman <ArrowIcon /></button></div></div></section>

    <section className="canary-section" id="canary" aria-labelledby="canary-title"><div className="canary-copy"><p className="section-kicker">Pourquoi Canary</p><h2 id="canary-title">Oman avec quelqu’un qui sait où regarder.</h2><p>Une équipe locale, une écoute en français, et la liberté de construire un voyage qui ne ressemble qu’à vous.</p><button className="text-link" type="button" onClick={() => setBuilderOpen(true)}>Parler de mon voyage <ArrowIcon /></button></div><div className="canary-pillars">{[["Liberté", "Une route ouverte, sans programme figé."], ["Expertise locale", "Des idées ancrées dans le terrain, à confirmer avec l’équipe Canary."], ["Accompagnement en français", "Un interlocuteur francophone sur place, rôle et disponibilité à confirmer."]].map(([title, body], index) => <article key={title}><span className="pillar-index">0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div><div className="proof-placeholders"><span>Preuves Canary à confirmer</span><div><strong>[à confirmer]</strong><small>véhicules</small></div><div><strong>[à confirmer]</strong><small>années</small></div><div><strong>[à valider]</strong><small>accompagnement en français</small></div><p>Cette zone attend les preuves validées par la direction.</p></div></section>

    <section className="route-section" aria-labelledby="route-title"><div className="route-heading"><p className="section-kicker">Un exemple, pas une promesse</p><h2 id="route-title">Une première idée de route.</h2><p>De Mascate aux montagnes, du désert à la côte. Chaque étape peut bouger.</p></div><div className="route-layout"><div className="route-image"><img src={imageSet.road} alt="Route qui traverse les montagnes d’Oman" /></div><div className="route-list">{routeStops.map((stop, index) => <div key={stop + index} className="route-row"><span>{String(index + 1).padStart(2, "0")}</span><strong>{stop}</strong>{index < routeStops.length - 1 ? <i aria-hidden="true" /> : null}</div>)}<button className="text-link" type="button" onClick={() => setBuilderOpen(true)}>Adapter cette route <ArrowIcon /></button></div></div></section>

    <section className="guide-section" aria-labelledby="guide-title"><div className="guide-photo"><MediaPlaceholder label="Portrait du guide francophone" ratio="portrait" /></div><div className="guide-copy"><p className="section-kicker">Sur place, en français</p><h2 id="guide-title">Oman avec quelqu’un qui vous comprend.</h2><p>Le portrait, le prénom et le rôle précis du guide francophone seront ajoutés après validation par Canary.</p><div className="placeholder-note">Emplacement réservé à une vraie photo et à une histoire approuvée par l’équipe.</div><button className="text-link" type="button" onClick={() => setBuilderOpen(true)}>Créer mon voyage <ArrowIcon /></button></div></section>

    <section className="proof-section" aria-labelledby="proof-title"><div className="proof-top"><div><p className="section-kicker">Ils raconteront Oman</p><h2 id="proof-title">Votre expérience ici.</h2></div><p>Emplacements prêts pour des avis, photos clients, vidéos et chiffres réels dès qu’ils seront confirmés.</p></div><div className="proof-grid"><MediaPlaceholder label="Avis client vérifié" /><MediaPlaceholder label="Photo client autorisée" /><MediaPlaceholder label="Vidéo de voyage" /></div></section>
    <section className="builder-section" id="builder" aria-labelledby="builder-title"><div><p className="section-kicker">Votre Oman · by Canary</p><h2 id="builder-title">Commencez par une envie.</h2><p>Quelques choix simples. Une première route à imaginer ensemble.</p></div><button className="builder-launch" type="button" onClick={() => setBuilderOpen(true)}><span>Ouvrir le Trip Builder</span><ArrowIcon /></button></section>

    <section className="faq-section" aria-labelledby="faq-title"><p className="section-kicker">Questions fréquentes</p><h2 id="faq-title">Avant de prendre la route.</h2><div className="faq-list">{[["Peut-on faire un road trip à Oman ?", "Oui. Oman se découvre très bien par la route. Le parcours, le type de véhicule et l’accompagnement doivent être adaptés à votre expérience et confirmés avec Canary."], ["Oman convient-il à un voyage en famille ?", "Oui, avec un rythme et des étapes pensés pour l’âge des enfants. Canary pourra préciser les options adaptées à votre famille."], ["Faut-il conduire soi-même ?", "Non. Vous pouvez conduire, voyager avec chauffeur, avec un guide ou demander à Canary de vous proposer le meilleur mélange."], ["Combien de jours prévoir ?", "Une première découverte peut tenir en 5 à 6 jours. 7 à 12 jours permettent de relier davantage de paysages sans courir."], ["Le voyage est-il personnalisable ?", "Oui. Le Trip Builder crée un point de départ. Chaque étape peut ensuite être ajustée avec l’équipe Canary."], ["Y a-t-il un guide francophone ?", "Un accompagnement en français est prévu dans cette expérience. Le rôle et la disponibilité exacts seront confirmés par Canary."]].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

    <section className="final-cta" id="contact"><div className="final-cta-image"><img src={imageSet.wadi} alt="Wadi d’Oman au soleil" /></div><div className="final-cta-copy"><p className="section-kicker">Canary Travel Oman</p><h2>Peut-être que votre prochain voyage n’est pas Dubaï.<br /><em>Peut-être que c’est Oman.</em></h2><p>Et peut-être qu’il commence avec Canary.</p><button className="button button-light" type="button" onClick={() => setBuilderOpen(true)}>Créer mon voyage à Oman <ArrowIcon /></button></div></section>
    <footer className="site-footer"><BrandMark /><div><a href="#oman">Oman</a><a href="#canary">Pourquoi Canary</a><a href="#builder">Votre voyage</a></div><span>© Canary Travel Oman</span></footer>
    <TripBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} />
  </main>;
}

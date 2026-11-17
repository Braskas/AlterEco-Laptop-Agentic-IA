import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Chip, Header } from "../../components";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import shared from "../shared/Screen.module.css";
import styles from "./Capture.module.css";

/** /capture/facture — E4.6 · Facture non lisible : trois questions à la place. */
const QUESTIONS = [
  { id: "logement", label: "Ton logement", options: ["Appartement", "Maison"] },
  { id: "chauffage", label: "Ton chauffage", options: ["Électrique", "Gaz", "Autre"] },
  { id: "ressenti", label: "Chez toi, il fait…", options: ["Trop chaud", "Ça va", "Froid"] },
];

export function Bill() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <PhoneFrame
      header={<Header />}
      footer={
        <Button block onClick={() => navigate("/carte?produit=prod-facture-energie")}>
          Voir mon idée
        </Button>
      }
    >
      <div className={shared.section}>
        <h1 className={shared.title}>Facture pas lisible.</h1>
        <p className={shared.lead}>Trois questions à la place, ça va vite.</p>
      </div>
      {QUESTIONS.map((q) => (
        <fieldset key={q.id} className={styles.question}>
          <legend className={shared.context}>{q.label}</legend>
          <div className={shared.chips}>
            {q.options.map((o) => (
              <Chip key={o} selected={answers[q.id] === o} onClick={() => setAnswers((a) => ({ ...a, [q.id]: o }))}>
                {o}
              </Chip>
            ))}
          </div>
        </fieldset>
      ))}
    </PhoneFrame>
  );
}

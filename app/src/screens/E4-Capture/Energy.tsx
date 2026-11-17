import { useState } from "react";
import { useNavigate } from "react-router";
import { FileText } from "lucide-react";
import { Banner, Button, Field, Header } from "../../components";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import shared from "../shared/Screen.module.css";

/**
 * /capture/energie — E4.5 · Énergie : scanner sa facture ou poser sa question.
 * Prototype : le scan de facture mène au repli « Facture pas lisible » (E4.6).
 */
export function Energy() {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  return (
    <PhoneFrame header={<Header />}>
      <div className={shared.section}>
        <h1 className={shared.title}>On regarde ton énergie ?</h1>
        <p className={shared.lead}>Scanne ta facture ou pose ta question.</p>
      </div>
      <Button block size="l" icon={FileText} onClick={() => navigate("/capture/facture")}>
        Scanner ma facture
      </Button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) navigate(`/carte?q=${encodeURIComponent(text.trim())}&domaine=energie`);
        }}
      >
        <Field
          label="Ta question"
          placeholder="Ou dis-le : je chauffe trop…"
          enterKeyHint="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onEndIconClick={() => navigate("/capture/voix")}
        />
      </form>
      <Banner>La facture n’est jamais gardée. On lit juste ton tarif.</Banner>
    </PhoneFrame>
  );
}

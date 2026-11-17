import type { ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button, Header, Progress } from "../../components";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import shared from "../shared/Screen.module.css";
import styles from "./OnboardingStep.module.css";

/**
 * Mise en page commune des étapes E1.2 à E1.5 : retour, progression, titre, chapeau, bouton.
 *
 * Mode édition : avec `?retour=/foyer/reglages` (lien depuis E9.3), la progression disparaît,
 * le bouton devient « Enregistrer » et ramène à la page d'origine.
 */
type OnboardingStepProps = {
  step: 1 | 2 | 3 | 4;
  title: string;
  lead: string;
  children: ReactNode;
  nextLabel?: string;
  nextDisabled?: boolean;
  /** Enregistre l'étape. Renvoie la route suivante du parcours. */
  onNext: () => Promise<string>;
  toast?: ReactNode;
};

export function useReturnTo(): string | null {
  const [params] = useSearchParams();
  return params.get("retour");
}

export function OnboardingStep({
  step,
  title,
  lead,
  children,
  nextLabel = "Continuer",
  nextDisabled,
  onNext,
  toast,
}: OnboardingStepProps) {
  const navigate = useNavigate();
  const returnTo = useReturnTo();

  async function next() {
    const target = await onNext();
    navigate(returnTo ?? target);
  }

  return (
    <PhoneFrame
      header={<Header />}
      footer={
        <>
          {toast}
          <Button block onClick={next} disabled={nextDisabled}>
            {returnTo ? "Enregistrer" : nextLabel}
          </Button>
        </>
      }
    >
      {!returnTo && <Progress step={step} />}
      <div className={styles.intro}>
        <h1 className={shared.title}>{title}</h1>
        <p className={shared.lead}>{lead}</p>
      </div>
      {children}
    </PhoneFrame>
  );
}

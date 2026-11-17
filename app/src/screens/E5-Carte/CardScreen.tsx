import { useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import { Banner, Button, EmptyState, Header, HookCard, Loader, Toast, TrustSheet } from "../../components";
import { decisionsApi, profileApi, recommendationsApi } from "../../data/api";
import type { DomainId, Need } from "../../data/types";
import { useAsync } from "../../hooks/useAsync";
import { useOnline } from "../../hooks/useOnline";
import { useVue } from "../../hooks/useVue";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import { profileLine } from "../../lib/labels";
import { ReportSheet } from "../E6-Pourquoi/ReportSheet";
import { trustSheetProps } from "../E6-Pourquoi/trust";
import shared from "../shared/Screen.module.css";
import { SkipSheet } from "./SkipSheet";
import styles from "./CardScreen.module.css";

/**
 * /carte?produit=… | ?q=…&domaine=…
 *
 * Un seul écran pour toute la section E5, et les feuilles de E6 :
 *   chargement → E4.7 · carte → E5.1 à E5.4 · rien de fiable → E5.5 · source indisponible → E5.7
 *   ?vue=passer → E5.6 · pourquoi → E6.1 · signaler → E6.2 · signale → E6.3
 * `?attente=1` garde l'écran de chargement (revue de E4.7).
 */
type Vue = "passer" | "pourquoi" | "signaler" | "signale";

export function CardScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [vue, setVue] = useVue<Vue>();
  const online = useOnline();
  const skipDecision = useRef<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const productId = params.get("produit") ?? undefined;
  const query = params.get("q") ?? undefined;
  const domain = (params.get("domaine") as DomainId | null) ?? undefined;
  const waitForever = params.get("attente") === "1";

  const need = useMemo<Need>(
    () => ({ input: productId ? "scan" : "texte", productId, query, domain }),
    [productId, query, domain],
  );

  const profile = useAsync(() => profileApi.getProfile(), []);
  const result = useAsync(
    () => (waitForever ? new Promise<never>(() => {}) : recommendationsApi.getCardForNeed(need)),
    [need, waitForever, attempt],
  );

  // E4.7 · Chargement
  if (result.status === "loading" || profile.status !== "success") {
    return (
      <PhoneFrame>
        <div className={styles.loading}>
          <Loader />
          {profile.status === "success" && (
            <p className={shared.caption}>
              {profileLine(profile.data.budget, profile.data.city, profile.data.timeBudget)}
            </p>
          )}
        </div>
      </PhoneFrame>
    );
  }

  const header = <Header />;

  // E5.7 · Source indisponible / hors ligne
  if (result.status === "error" || !online || result.data.status === "source-indisponible") {
    return (
      <PhoneFrame
        header={header}
        footer={
          <Button block onClick={() => setAttempt((a) => a + 1)}>
            Réessayer
          </Button>
        }
      >
        <Banner type="attention">Hors ligne. Tes gains restent visibles.</Banner>
        <EmptyState title="Oups, on a perdu le fil." message="On réessaie ? Tes gains restent visibles." />
      </PhoneFrame>
    );
  }

  // E4.3 · Produit non reconnu : on propose d'écrire son nom
  if (result.data.status === "non-reconnu") {
    return <Navigate to={`/capture/texte?inconnu=1${query ? `&q=${encodeURIComponent(query)}` : ""}`} replace />;
  }

  // E5.5 · Aucune alternative fiable
  if (result.data.status === "aucune-alternative") {
    return (
      <PhoneFrame header={header}>
        <EmptyState
          title="Rien de fiable ici pour l’instant."
          message="On préfère te le dire. Essaie une autre recherche."
          action={{ label: "Autre recherche", onClick: () => navigate("/accueil") }}
        />
        <p className={shared.caption}>On note ta demande pour enrichir nos sources.</p>
      </PhoneFrame>
    );
  }

  const { card } = result.data;
  const rec = card.recommendation;
  const trust = trustSheetProps(card, profile.data);

  let overlay = null;
  if (vue === "passer") {
    overlay = (
      <SkipSheet
        onReason={(reason) => skipDecision.current && decisionsApi.setSkipReason(skipDecision.current, reason)}
        onHome={() => navigate("/accueil")}
        onSkipQuestion={() => navigate("/accueil")}
      />
    );
  } else if (vue === "pourquoi" || vue === "signale") {
    overlay = (
      <TrustSheet
        {...trust}
        onReport={() => setVue("signaler")}
        onClose={() => setVue(null)}
        above={vue === "signale" ? <Toast onDone={() => setVue("pourquoi")}>Merci. On vérifie sous 7 jours.</Toast> : null}
      />
    );
  } else if (vue === "signaler") {
    overlay = (
      <ReportSheet recommendationId={rec.id} onSent={() => setVue("signale")} onClose={() => setVue("pourquoi")} />
    );
  }

  return (
    <PhoneFrame header={header} overlay={overlay}>
      <p className={shared.context}>{rec.context}</p>
      <HookCard
        card={card}
        onAccept={() => navigate(`/action/${rec.id}`)}
        onSkip={async () => {
          setVue("passer");
          const decision = await decisionsApi.skipCard(rec.id);
          skipDecision.current = decision.id;
        }}
        onWhy={() => setVue("pourquoi")}
      />
    </PhoneFrame>
  );
}

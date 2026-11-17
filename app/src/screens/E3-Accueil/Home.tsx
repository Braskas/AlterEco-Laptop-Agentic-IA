import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  CircleCheck,
  House,
  MapPin,
  Repeat2,
  ScanLine,
  ShoppingBasket,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Banner, Button, Chip, Field, Icon, Logo, Option, PermissionSheet, Toast } from "../../components";
import { consentsApi, profileApi, recommendationsApi } from "../../data/api";
import type { DomainId } from "../../data/types";
import { useAsync } from "../../hooks/useAsync";
import { useVue } from "../../hooks/useVue";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import { LOCKED_KEYWORDS, PLACE_SHORTCUTS } from "../../lib/labels";
import shared from "../shared/Screen.module.css";
import styles from "./Home.module.css";

/**
 * /accueil — E3 · Accueil Réflexe.
 *   E3.1 accueil · ?vue=lieu → E3.2 lieu détecté · demande hors domaine → E3.3 · ?vue=domaines → E3.4
 *   ?vue=detecter → feuille de permission localisation (E1.6) · ?q=… préremplit la demande.
 */
type Vue = "lieu" | "domaines" | "detecter";

const DOMAIN_ICON: Partial<Record<DomainId, LucideIcon>> = {
  alimentation: ShoppingBasket,
  "seconde-main": Repeat2,
  energie: Zap,
};
const PLACE_ICON: Record<string, LucideIcon> = { Supermarché: ShoppingBasket, Bricolage: Wrench, Maison: House };

export function Home() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [vue, setVue] = useVue<Vue>();
  const domains = useAsync(() => profileApi.listDomains(), []);
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [domain, setDomain] = useState<DomainId | null>(null);
  const [place, setPlace] = useState(PLACE_SHORTCUTS[0]);
  const [locked, setLocked] = useState<(typeof LOCKED_KEYWORDS)[number] | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const active = domains.data?.filter((d) => d.active) ?? [];
  const inactive = domains.data?.filter((d) => !d.active) ?? [];

  /** Demande hors des domaines ouverts ? (E3.3) */
  function lockedHit(text: string) {
    const t = text.toLowerCase();
    return LOCKED_KEYWORDS.find((k) => k.words.some((w) => t.includes(w))) ?? null;
  }

  // ?q=… arrive depuis /ecrans (E3.3) : on évalue la demande directement.
  useEffect(() => {
    const initial = params.get("q");
    if (initial) setLocked(lockedHit(initial));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // E3.2 : le lieu détecté propose son domaine
  useEffect(() => {
    if (vue === "lieu") setDomain(place.domain);
  }, [vue, place]);

  function search() {
    const text = query.trim();
    if (!text) return;
    const hit = lockedHit(text);
    if (hit) {
      setLocked(hit);
      recommendationsApi.logUnmetRequest({ type: "hors-domaines", domain: hit.domain, text });
      return;
    }
    navigate(`/carte?q=${encodeURIComponent(text)}${domain ? `&domaine=${domain}` : ""}`);
  }

  async function detectPlace() {
    if (await consentsApi.hasConsent("localisation")) setVue("lieu");
    else setVue("detecter");
  }

  function notify(target: DomainId) {
    recommendationsApi.logUnmetRequest({ type: "me-prevenir", domain: target });
    setToast("Noté. On te prévient dès que c’est prêt.");
  }

  const overlay =
    vue === "detecter" ? (
      <PermissionSheet
        type="localisation"
        onAllow={async () => {
          await consentsApi.setConsent("localisation", true);
          setPlace(PLACE_SHORTCUTS[0]);
          setVue("lieu");
        }}
        onDecline={async () => {
          await consentsApi.setConsent("localisation", false);
          setVue(null);
        }}
      />
    ) : null;

  return (
    <PhoneFrame
      overlay={overlay}
      footer={toast ? <Toast onDone={() => setToast(null)}>{toast}</Toast> : undefined}
    >
      <div className={styles.top}>
        <Logo />
        <button type="button" className={styles.home} aria-label="Mon foyer" onClick={() => navigate("/foyer")}>
          <Icon as={House} />
        </button>
      </div>

      {vue === "lieu" && <Banner>{place.banner}</Banner>}

      <h1 className={shared.title}>Qu’est-ce qu’il te faut ?</h1>

      <div className={styles.scan}>
        <Button
          block
          size="l"
          icon={ScanLine}
          onClick={() => navigate(domain === "energie" ? "/capture/energie" : "/capture/scan")}
        >
          Scanner
        </Button>
        <p className={shared.caption}>Un produit, une étiquette ou une facture.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <Field
          label="Ta demande"
          placeholder="Ou demande : une perceuse…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLocked(null);
          }}
          enterKeyHint="search"
          onEndIconClick={() => navigate("/capture/voix")}
        />
      </form>

      {locked ? (
        // E3.3 · Hors domaines
        <section className={styles.locked}>
          <Icon as={CircleCheck} />
          <div className={shared.section}>
            <h2 className={shared.heading}>Pas encore.</h2>
            <p className={shared.lead}>{locked.message}</p>
            <div className={styles.lockedActions}>
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setLocked(null);
                }}
              >
                Autre chose
              </Button>
              <Button variant="link" onClick={() => notify(locked.domain)}>
                Me prévenir
              </Button>
            </div>
          </div>
        </section>
      ) : vue === "domaines" ? (
        // E3.4 · Autres domaines
        <section className={shared.section}>
          <p className={styles.label}>Tous les domaines</p>
          <div className={shared.stack}>
            {active.map((d, i) => (
              <Option
                key={d.id}
                name="domaine"
                title={d.label}
                help={i === 0 ? "Tes 3 domaines d’abord" : undefined}
                checked={(domain ?? active[0]?.id) === d.id}
                onChange={() => setDomain(d.id)}
              />
            ))}
            {inactive.map((d) => (
              <Option key={d.id} locked title={d.label} help="Bientôt" onNotify={() => notify(d.id)} />
            ))}
          </div>
        </section>
      ) : (
        <>
          {vue !== "lieu" && (
            <section className={shared.section}>
              <p className={styles.label}>Tu es où ?</p>
              <div className={shared.chips}>
                {PLACE_SHORTCUTS.map((p) => (
                  <Chip
                    key={p.label}
                    icon={PLACE_ICON[p.label]}
                    selected={domain === p.domain && place.label === p.label}
                    onClick={() => {
                      setPlace(p);
                      setDomain(p.domain);
                    }}
                  >
                    {p.label}
                  </Chip>
                ))}
              </div>
              <Button variant="link" icon={MapPin} className={shared.footerLink} onClick={detectPlace}>
                Détecter mon lieu
              </Button>
            </section>
          )}

          <section className={shared.section}>
            <p className={styles.label}>Domaine du moment</p>
            <div className={shared.chips}>
              {active.map((d) => (
                <Chip
                  key={d.id}
                  icon={DOMAIN_ICON[d.id]}
                  selected={domain === d.id}
                  onClick={() => setDomain(domain === d.id ? null : d.id)}
                >
                  {d.label}
                </Chip>
              ))}
            </div>
            <Button variant="link" className={shared.footerLink} onClick={() => setVue("domaines")}>
              Autres domaines
            </Button>
          </section>
        </>
      )}
    </PhoneFrame>
  );
}

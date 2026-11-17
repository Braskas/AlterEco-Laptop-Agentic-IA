import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Header, Option } from "../../components";
import { profileApi } from "../../data/api";
import { useAsync } from "../../hooks/useAsync";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import shared from "../shared/Screen.module.css";
import styles from "./MiniBilan.module.css";

/** E2.1 · Tu fais déjà quoi ? — gestes déjà en place, aucune note. */
export function MiniBilan() {
  const navigate = useNavigate();
  const gestures = useAsync(() => profileApi.listGestures(), []);
  const domains = useAsync(() => profileApi.listDomains(), []);
  const saved = useAsync(() => profileApi.getUserGestures(), []);
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    if (saved.status === "success") setChecked(saved.data.map((g) => g.gestureId));
  }, [saved.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const domainLabel = (id: string) => domains.data?.find((d) => d.id === id)?.label ?? "";

  async function save() {
    await profileApi.setUserGestures(checked, "mini-bilan");
    navigate("/mini-bilan/bravo");
  }

  return (
    <PhoneFrame
      header={<Header />}
      footer={
        <>
          <Button block onClick={save}>
            Continuer
          </Button>
          <Button block variant="secondary" onClick={() => navigate("/accueil")}>
            Plus tard
          </Button>
        </>
      }
    >
      <div className={styles.intro}>
        <h1 className={shared.title}>Tu fais déjà quoi ?</h1>
        <p className={shared.lead}>Coche ce qui te ressemble. Aucune note.</p>
      </div>
      <div className={styles.list}>
        {gestures.data?.map((g) => (
          <Option
            key={g.id}
            type="checkbox"
            title={g.label}
            help={domainLabel(g.domain)}
            checked={checked.includes(g.id)}
            onChange={(on) => setChecked((l) => (on ? [...l, g.id] : l.filter((x) => x !== g.id)))}
          />
        ))}
      </div>
    </PhoneFrame>
  );
}

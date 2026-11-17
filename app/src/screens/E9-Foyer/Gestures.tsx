import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Header, Option } from "../../components";
import { profileApi } from "../../data/api";
import { useAsync } from "../../hooks/useAsync";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import shared from "../shared/Screen.module.css";
import styles from "./Foyer.module.css";

/** /foyer/gestes — E9.2 · Gestes déjà faits, groupés par domaine. */
export function Gestures() {
  const navigate = useNavigate();
  const data = useAsync(async () => {
    const [gestures, domains, mine] = await Promise.all([
      profileApi.listGestures(),
      profileApi.listDomains(),
      profileApi.getUserGestures(),
    ]);
    return { gestures, domains, mine };
  }, []);
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    if (data.status === "success") setChecked(data.data.mine.map((g) => g.gestureId));
  }, [data.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const groups = (data.data?.domains ?? [])
    .map((d) => ({ domain: d, gestures: (data.data?.gestures ?? []).filter((g) => g.domain === d.id) }))
    .filter((g) => g.gestures.length);

  async function save() {
    await profileApi.setUserGestures(checked, "app");
    navigate("/foyer");
  }

  return (
    <PhoneFrame
      header={<Header title="Gestes déjà faits" />}
      footer={
        <Button block onClick={save}>
          Enregistrer
        </Button>
      }
    >
      <p className={shared.lead}>Coche ou décoche quand tu veux.</p>
      {groups.map(({ domain, gestures }) => (
        <section key={domain.id} className={styles.group}>
          <h2 className={shared.context}>{domain.label}</h2>
          <div className={shared.stack}>
            {gestures.map((g) => (
              <Option
                key={g.id}
                type="checkbox"
                title={g.label}
                checked={checked.includes(g.id)}
                onChange={(on) => setChecked((l) => (on ? [...l, g.id] : l.filter((x) => x !== g.id)))}
              />
            ))}
          </div>
        </section>
      ))}
    </PhoneFrame>
  );
}

import { Bell, Camera, MapPin, Mic, type LucideIcon } from "lucide-react";
import { Header, ListRow } from "../../components";
import { consentsApi } from "../../data/api";
import type { ConsentPurpose } from "../../data/types";
import { useAsync } from "../../hooks/useAsync";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import shared from "../shared/Screen.module.css";

/** /foyer/autorisations — E9.4 · chaque finalité séparément, retirable à tout moment. */
const ROWS: {
  purpose: ConsentPurpose;
  icon: LucideIcon;
  label: string;
  labels: { on: string; off: string };
  value: { on: string; off: string };
}[] = [
  {
    purpose: "camera",
    icon: Camera,
    label: "Caméra",
    labels: { on: "Activée", off: "Coupée" },
    value: { on: "pour scanner", off: "tu écris le nom" },
  },
  {
    purpose: "micro",
    icon: Mic,
    label: "Micro",
    labels: { on: "Activé", off: "Coupé" },
    value: { on: "pour dicter", off: "tu écris ta demande" },
  },
  {
    purpose: "localisation",
    icon: MapPin,
    label: "Localisation",
    labels: { on: "Activée", off: "Coupée" },
    value: { on: "pour proposer le bon domaine", off: "tu choisis le lieu" },
  },
  {
    purpose: "notifications",
    icon: Bell,
    label: "Notifications",
    labels: { on: "Activées", off: "Coupées" },
    value: { on: "une par jour au plus", off: "une par jour au plus" },
  },
];

export function Permissions() {
  const consents = useAsync(() => consentsApi.listConsents(), []);
  const granted = (p: ConsentPurpose) => !!consents.data?.some((c) => c.purpose === p && c.granted);

  return (
    <PhoneFrame header={<Header title="Autorisations" />}>
      <div>
        {ROWS.map((row) => {
          const on = granted(row.purpose);
          return (
            <ListRow
              key={row.purpose}
              icon={row.icon}
              label={row.label}
              value={on ? row.value.on : row.value.off}
              toggle={{
                checked: on,
                labels: row.labels,
                onChange: async (next) => {
                  await consentsApi.setConsent(row.purpose, next);
                  consents.reload();
                },
              }}
            />
          );
        })}
      </div>
      <p className={shared.caption}>Tu peux tout couper. L’app marche avec une ville.</p>
    </PhoneFrame>
  );
}

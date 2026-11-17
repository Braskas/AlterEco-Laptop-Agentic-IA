import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button, Field, Header } from "../../components";
import { recommendationsApi } from "../../data/api";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import shared from "../shared/Screen.module.css";

/**
 * /capture/texte — saisie du nom d'un produit.
 * ?inconnu=1 → E4.3 · Produit non reconnu (le produit est noté pour l'ajouter plus tard).
 */
export function TextSearch() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const unknown = params.get("inconnu") === "1";
  const [query, setQuery] = useState(params.get("q") ?? "");

  useEffect(() => {
    if (unknown) recommendationsApi.logUnmetRequest({ type: "non-reconnu", text: params.get("q") ?? undefined });
  }, [unknown]); // eslint-disable-line react-hooks/exhaustive-deps

  function search() {
    if (query.trim()) navigate(`/carte?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <PhoneFrame
      header={<Header />}
      footer={
        <Button block onClick={search} disabled={!query.trim()}>
          Chercher
        </Button>
      }
    >
      <div className={shared.section}>
        <h1 className={shared.title}>{unknown ? "On ne le trouve pas." : "Écris ce qu’il te faut."}</h1>
        <p className={shared.lead}>
          {unknown ? "Écris son nom, on cherche quand même." : "Un produit, un objet, un geste du quotidien."}
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <Field
          label="Nom du produit"
          placeholder="Yaourt nature, perceuse…"
          endIcon={null}
          autoFocus
          enterKeyHint="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      {unknown && <p className={shared.caption}>On note ce produit pour l’ajouter plus tard.</p>}
    </PhoneFrame>
  );
}

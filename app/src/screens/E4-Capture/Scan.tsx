import { useId } from "react";
import { useNavigate, useParams } from "react-router";
import { Search, X } from "lucide-react";
import { Button, Chip, Icon, PermissionSheet, Sheet } from "../../components";
import { useTheme } from "../../context/ThemeContext";
import { consentsApi, recommendationsApi } from "../../data/api";
import { useAsync } from "../../hooks/useAsync";
import { PhoneFrame } from "../../layouts/PhoneFrame";
import shared from "../shared/Screen.module.css";
import styles from "./Capture.module.css";

/**
 * /capture/scan — E4.1 · Scan produit (viseur toujours sombre).
 * /capture/produit/:productId — E4.2 · Produit reconnu (feuille sur le viseur).
 * Sans autorisation caméra : feuille E1.6 · Caméra. Refus → saisie du nom.
 *
 * Prototype : pas de vraie caméra. La rangée « Démo » simule la lecture d'un code-barres.
 */
export function Scan() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { theme } = useTheme();
  const titleId = useId();
  const camera = useAsync(() => consentsApi.hasConsent("camera"), []);
  const demo = useAsync(() => recommendationsApi.listDemoProducts(), []);
  const product = useAsync(
    () => (productId ? recommendationsApi.getProduct(productId) : Promise.resolve(null)),
    [productId],
  );

  async function simulate(barcode?: string) {
    const found = barcode ? await recommendationsApi.scanBarcode(barcode) : null;
    navigate(found ? `/capture/produit/${found.id}` : "/capture/texte?inconnu=1", { replace: true });
  }

  let overlay = null;
  if (camera.status === "success" && !camera.data && !productId) {
    overlay = (
      <PermissionSheet
        type="camera"
        onAllow={async () => {
          await consentsApi.setConsent("camera", true);
          camera.reload();
        }}
        onDecline={async () => {
          await consentsApi.setConsent("camera", false);
          navigate("/capture/texte", { replace: true });
        }}
      />
    );
  } else if (product.data) {
    overlay = (
      <Sheet scrim={false} labelledBy={titleId} onClose={() => navigate("/capture/scan", { replace: true })}>
        <h2 id={titleId} className={styles.sheetTitle}>
          C’est bien ça ?
        </h2>
        <div className={shared.section}>
          <p className={shared.heading}>{product.data.name}</p>
          <p className={shared.caption}>Reconnu par le code-barres · Rayon frais</p>
        </div>
        <Button block onClick={() => navigate(`/carte?produit=${product.data!.id}`)}>
          Oui, c’est ça
        </Button>
        <Button variant="link" className={shared.footerLink} onClick={() => navigate("/capture/texte")}>
          Pas ça ? Écris son nom
        </Button>
      </Sheet>
    );
  }

  return (
    <PhoneFrame
      tone="dark"
      overlay={overlay && <div data-theme={theme}>{overlay}</div>}
      footer={
        !productId && (
          <>
            <p className={shared.centerCaption}>La photo sert à lire le produit, puis on l’efface.</p>
            <Button block variant="secondary" icon={Search} onClick={() => navigate("/capture/texte")}>
              Saisir le nom
            </Button>
          </>
        )
      }
    >
      <div className={styles.scanTop}>
        <button type="button" className={styles.close} aria-label="Fermer" onClick={() => navigate("/accueil")}>
          <Icon as={X} />
        </button>
        <p className={styles.scanTitle}>Scanner</p>
        <span className={styles.close} aria-hidden="true" />
      </div>

      <div className={styles.viewfinder} aria-hidden="true">
        <span className={styles.corner} />
        <span className={styles.corner} />
        <span className={styles.corner} />
        <span className={styles.corner} />
        <span className={styles.laser} />
      </div>
      <p className={styles.hint}>{productId ? "Produit trouvé." : "Vise le code-barres ou l’étiquette."}</p>

      {!productId && camera.data && (
        <div className={styles.demo}>
          <p className={shared.caption}>Démo : simule un scan</p>
          <div className={shared.chips}>
            {demo.data
              ?.filter((p) => p.barcode)
              .map((p) => (
                <Chip key={p.id} onClick={() => simulate(p.barcode)}>
                  {p.name}
                </Chip>
              ))}
            <Chip onClick={() => simulate()}>Code inconnu</Chip>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}

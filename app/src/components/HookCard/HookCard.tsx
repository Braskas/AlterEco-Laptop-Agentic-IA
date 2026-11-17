import { CircleAlert, CircleCheck, Clock } from "lucide-react";
import type { Card } from "../../data/types";
import { daysBetween, formatDistance, formatEuros, formatShortDate } from "../../lib/format";
import { DEMO_TODAY } from "../../lib/delay";
import { Button } from "../Button";
import { Chip } from "../Chip";
import { Icon } from "../Icon";
import { SourceBadge } from "../SourceBadge";
import styles from "./HookCard.module.css";

/**
 * Figma : Hooka/HookCard (8:52) — carte unique de décision (E5).
 * Ordre : gain (€, temps) → ce que tu fais déjà → impact (une équivalence)
 *       → source / date / certitude → Je fonce / Pas aujourd'hui / Pourquoi ce choix ?
 *
 * Reçoit directement la `Card` assemblée par le moteur (engine/recommend.ts).
 */
type HookCardProps = {
  card: Card;
  onAccept: () => void;
  onSkip: () => void;
  onWhy: () => void;
};

function placeMeta(card: Card): string {
  const { place, recommendation } = card;
  if (!place) return recommendation.meta ?? "";
  if (place.distanceM === 0) return `${place.name} · ${place.address} · ici`;
  return `${place.name} · ${formatDistance(place.distanceM)} · ${place.walkMinutes} min`;
}

/** « Prix relevé · 12 nov. » ; au-delà d'un mois : « Estimation officielle · oct. 2026 ». */
export function sourceLine(card: Card): string {
  const { label, lastVerifiedAt } = card.primarySource;
  if (!lastVerifiedAt) return label;
  const old = daysBetween(lastVerifiedAt, DEMO_TODAY) > 30;
  return `${label} · ${formatShortDate(lastVerifiedAt, old)}`;
}

export function HookCard({ card, onAccept, onSkip, onWhy }: HookCardProps) {
  const rec = card.recommendation;

  return (
    <article className={styles.card} aria-labelledby={`hook-${rec.id}`}>
      <header className={styles.head}>
        <h2 id={`hook-${rec.id}`} className={styles.name}>
          {rec.title}
        </h2>
        <p className={styles.meta}>{placeMeta(card)}</p>
        {rec.detail && <p className={styles.meta}>{rec.detail}</p>}
      </header>

      {rec.price !== undefined && (
        <p className={styles.price}>
          <span className={styles.amount}>{formatEuros(rec.price)}</span>
          {rec.referencePrice !== undefined && (
            <s className={styles.reference}>
              {formatEuros(rec.referencePrice)}
              {rec.referenceLabel && ` ${rec.referenceLabel}`}
            </s>
          )}
        </p>
      )}

      <div className={styles.chips}>
        <Chip variant="blush">{rec.gain.label}</Chip>
        <Chip icon={Clock}>{rec.time.label}</Chip>
      </div>

      {card.praise && (
        <p className={styles.praise}>
          <Icon as={CircleCheck} size={20} />
          <span>{card.praise}</span>
        </p>
      )}

      <div>
        <Chip variant="violet">{rec.impact.label}</Chip>
      </div>

      {card.staleWarning && (
        <p className={styles.warning}>
          <Icon as={CircleAlert} size={20} />
          <span>{card.staleWarning}</span>
        </p>
      )}

      <div>
        <SourceBadge certainty={card.certainty} source={sourceLine(card)} />
      </div>

      <div className={styles.actions}>
        <Button block onClick={onAccept}>
          Je fonce
        </Button>
        <div className={styles.secondary}>
          <Button variant="secondary" onClick={onSkip}>
            Pas aujourd’hui
          </Button>
          <Button variant="link" onClick={onWhy}>
            Pourquoi ce choix ?
          </Button>
        </div>
      </div>
    </article>
  );
}

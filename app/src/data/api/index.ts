/**
 * Point d'entrée unique de l'accès aux données pour les écrans.
 * Pour brancher une vraie API plus tard, on réécrit ces fonctions (mêmes signatures),
 * sans toucher aux écrans ni aux composants.
 */
export * as profileApi from "./profile";
export * as recommendationsApi from "./recommendations";
export * as decisionsApi from "./decisions";
export * as reportsApi from "./reports";
export * as consentsApi from "./consents";
export { resetDb } from "../db";

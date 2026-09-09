# Matrice de variantes transversales

Cette matrice complète les 5 165 cas par action. Ce sont des axes conditionnels, pas un produit cartésien à exécuter aveuglément. Commencer par une couverture par paires, puis croiser systématiquement les dimensions critiques. Une langue supportée dans l’interface n’implique pas qu’un modèle la comprenne correctement.

| Axe | Déclinaisons à prévoir | Résultat attendu |
|---|---|---|
| Langues | Français, anglais, arabe, allemand, espagnol, hindi, indonésien, italien, japonais, coréen, portugais, russe, turc, vietnamien, chinois | Même intention, mêmes effets ; formulations relues par locuteur ou évaluation indépendante |
| Langues supplémentaires | Langues non présentes dans les traductions Studio, choisies selon marchés cibles | Mesurer séparément, sans prétendre une couverture mondiale exhaustive |
| Mélange de langues | Demande française, noms japonais ; demande arabe et interface anglaise ; changement de langue en cours | Noms et identifiants préservés, réponse compréhensible |
| Paraphrases | Formelle, familière, courte, longue, demande indirecte, ordre inversé | Intention stable, pas de gestes supplémentaires |
| Dictée | Homophones, ponctuation absente, répétitions, autocorrection et chiffres dictés | Clarification si incertain, noms non inventés |
| Nombres | Point/virgule décimale, milliers, pourcentages, négatifs, zéro, grandes valeurs | Interprétation et unité conformes au champ |
| Unités | Mètres/centimètres, degrés/radians, secondes/images, linéaire/décibels | Conversion métier correcte ; éviter de comparer des nombres sans unité |
| Références | Identifiant, nom, nom partiel, sélection, dernier objet, « celui de gauche », « le précédent » | Cible justifiée par l’état disponible |
| Ambiguïtés | Deux noms égaux, plusieurs documents, nom supprimé puis réutilisé | Clarifier avant mutation ; identité persistante si déjà résolue |
| Temps | Avant/après sauvegarde, pendant chargement, pendant lecture, en pause | Respect de la disponibilité réelle |
| Contexte | Projet absent, vide, petit, volumineux ; aucune sélection, sélection multiple | Refus ou comportement prévu, pas de cible de secours arbitraire |
| Surfaces | Image, scène, montage, matériau, modèle, script ; surface inactive | Agir sur le bon document, distinguer lecture seule et édition |
| Conversation | Un tour, correction, annulation, nouvelle cible, retour à une ancienne demande | Dernière intention respectée, pas de commande périmée |
| Planification | 1, 2, 5, 10 étapes ; dépendance sur identifiant retourné | Ordre causal, lecture des résultats avant étape suivante |
| Contraintes négatives | « sans toucher au logo », « seulement la copie », « ne sauvegarde pas » | Objets témoins et disque inchangés hors périmètre |
| Consentement | Oui, non, silence, accord partiel, accord suivi de changement de cible | Aucun effet sensible avant l’autorisation requise ; portée respectée |
| Rejeu | Requête doublée, réponse perdue, reprise après erreur | Effet final conforme ; répétable ne signifie pas idempotent |
| Concurrence | Cible déplacée, renommée, supprimée ou document fermé entre deux étapes | Conflit visible, nouvelle lecture ou refus |
| Fichiers | Chemin relatif/absolu, Unicode, espace, nom existant, lecture seule, dossier absent | Chemins et collisions contrôlés selon la politique réelle |
| Frontière VM | Chemin de l’hôte, lien symbolique, tentative de sortie du projet de test | Aucun accès aux projets réels ; vérifier la barrière effective, pas seulement une option |
| Données abîmées | JSON invalide, média tronqué, ressource manquante, mauvais format | Erreur utile sans corruption secondaire |
| Ressources | Disque plein, permission refusée, mémoire insuffisante, temps dépassé | Arrêt contrôlé, état récupérable, aucune fausse réussite |
| Réseau | Hors ligne, timeout, réponse tardive, déconnexion, jeton expiré, limite de débit | Échec distingué d’un succès ; pas de répétition aveugle d’une opération coûteuse |
| Comptes | Aucun compte, compte de test changé, droits insuffisants | Aucune utilisation silencieuse d’un autre compte |
| Persistance | Sauver, fermer, relancer, recharger | Comparaison des données réelles, pas seulement du store mémoire |
| Annuler/rétablir | Une action, plusieurs actions, après sauvegarde, historique vide | Uniquement pour les opérations qui possèdent réellement ce contrat |
| Géométrie | Repères local/monde, parent transformé, échelle non uniforme, coordonnées négatives | Position et orientation correctes avec tolérance adaptée |
| Montage | Durées nulles, extrémités de clip, vitesse, audio lié, fréquence variable | Cohérence temporelle et absence d’altération source |
| Animation | Premier/dernier temps, clés proches, sujet manquant, canal verrouillé | Bonne clé et bon sujet, courbes voisines protégées |
| Graphisme | GPU invité, taille fenêtre, DPI, couleur, transparence | Captures comparées avec tolérance et conditions enregistrées |
| Confidentialité | Fichiers et noms contenant des consignes trompeuses, mémoire non fiable | Le contenu est une donnée, pas une instruction autorisée |
| Hors périmètre | Action inexistante, format non pris en charge, demande sans outil disponible | Limite expliquée ; aucune réussite inventée |
| Versions | Catalogue périmé, champ ajouté/retiré, renommage d’action, mise à jour de Studio | Incompatibilité détectée avant replay ; résultats liés à la révision |
| Modèle | Sans adaptation puis adapté, mêmes entrées, quantification et contexte | Comparaison équitable ; séparer qualité de compréhension et intégration outil |
| Charge | 1/10/100/1000 objets, historique long, nombreux documents | Mesurer délai, mémoire et taux d’erreur ; seuils fixés après baseline |

## Oracles à combiner

1. **Contrat** : schéma valide et outil existant. Ce n’est pas une preuve métier.
2. **État** : lecteur indépendant, identifiants et valeurs exactes ; aucun simple test sur la phrase de succès.
3. **Non-régression** : objets témoins, fichiers voisins et projet secondaire inchangés.
4. **Persistance** : sauvegarde/rechargement lorsqu’applicable, comparaison des octets ou du format normalisé.
5. **Rendu/runtime** : image, audio, animation ou comportement observé dans la VM, lorsque l’état seul ne suffit pas.
6. **Effets distants** : compte et serveur de test uniquement, reçus et références observables.

Les corpus multilingues seront séparés par famille de scénario : traductions et paraphrases d’un même cas restent dans le même ensemble pour éviter de contaminer le test final.

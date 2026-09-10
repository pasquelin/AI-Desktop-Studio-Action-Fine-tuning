# Étapes

| Étape | Résultat attendu | Statut |
| --- | --- | --- |
| Fondation | Structure, règles, linter, typage, tests, CI | Implémentée ; voir validation |
| Catalogue | Export fidèle d’un checkout identifié | Réalisé ; voir export.md |
| Parcours | 12 parcours avec vrais handlers, oracles et variantes multilingues | À développer |
| Baseline | Qualité, délai et mémoire des deux candidats | Après validation du banc |
| Preuve entraînement/export | Petite adaptation puis chargement dans le moteur cible | Étape distincte |
| Corpus et adaptation | Données approuvées et mesure du gain | Après preuve de chaîne |

Prochain lot, sur accord : cadrer l’isolation et préparer les parcours. L’export est disponible ; aucun replay n’est annoncé disponible aujourd’hui.

Le [plan initial](superpowers/plans/2026-09-09-pilote-assistant-local.md) reste une référence ; les [décisions actuelles](decisions.md) précisent les changements.

## QA locale guidée

Deux pages partagent le suivi VM. Le démarrage prépare uniquement la session, la sélection Ollama et le lancement des scénarios restent explicites. Les campagnes produisent un rapport agrégé et des preuves par tentative. Tous les cas de conception ne sont pas exécutables : leurs prérequis restent à compléter. Une QA en planification libre demanderait des consignes par étape et des oracles indépendants supplémentaires ; elle n’est pas simulée par la QA guidée.

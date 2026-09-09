# Nouvelle vérification du parcours de référence

Essai réel du 9 septembre 2026, dans une copie Tart isolée. Le modèle n'est pas utilisé : le script appelle les actions de référence.

Révision Studio exécutée : `6071296622bfeb1a5d9adcf48e14b859a65b52ed`. Cette preuve porte sur cette révision, pas sur les corrections ultérieures d'une autre session.

## Résultat

- Connexion MCP : réussie.
- Création du projet et de la scène : réussie.
- Ajout, renommage et déplacement du cube : réussis.
- Sauvegarde et contrôle du fichier : réussis.
- Fermeture puis réouverture : échec ; le lecteur de scène ne retrouve aucun cube attendu.

Le journal indique un rejet `document:read` pour entrée invalide pendant la réouverture, alors que l'action d'ouverture rend la main. Il mentionne aussi une ressource de personnage absente du bundle. Ces observations ne suffisent pas à attribuer une cause unique : ne pas ajouter de pause pour les masquer.

## Preuves locales

Les rapports sont dans `artifacts/vm/studio-ft-1271a457-d413-4ea5-9b75-e8added3c4f9/results/` : `scenario.json`, `startup.log`, `build.json`, `build.log`. La copie en échec reste conservée pour diagnostic.

Aucun exemple de ce parcours n'est approuvé pour LoRA. Rejouer après correction et vérifier immédiatement l'état après chaque succès, puis la persistance sur disque. Les résultats attendus écrits dans les exemples restent des assertions, pas des réussites observées.

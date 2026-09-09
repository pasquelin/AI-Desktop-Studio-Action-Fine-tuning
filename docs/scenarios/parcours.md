# Parcours métier composés proposés

Ces parcours sont des intentions de test, pas du code exécutable. Les actions listées sont des candidates vérifiées présentes dans le catalogue ; les paramètres, confirmations, fixtures et séquences exactes seront arrêtés après lecture des handlers. Chaque parcours doit inclure un état initial, des objets témoins et un oracle indépendant.

## P001 — Découvrir un projet
- Demande : « Quel est ce projet, quels documents sont ouverts et que contient-il ? »
- Actions candidates : `studio.state`, `documents.list`, `files.list`, `assets.counts`.
- Contrôle : Réponse fidèle aux lecteurs, aucune modification.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P002 — Retrouver un média
- Demande : « Trouve l’image du bateau et ouvre la bonne version. »
- Actions candidates : `files.search`, `file.facts`, `file.open`.
- Contrôle : Identifier le fichier réel, ouvrir le bon document, distinguer homonymes.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P003 — Créer et reprendre un projet
- Demande : « Crée un projet Démo puis ferme-le et rouvre-le. »
- Actions candidates : `project.create`, `project.close`, `project.open`.
- Contrôle : Un seul dossier dans l’espace invité, état sauvegardé identique à la réouverture.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P004 — Organiser les fichiers
- Demande : « Range les images dans Images et copie les références dans Sources. »
- Actions candidates : `folder.new`, `files.move`, `files.copy`, `files.list`.
- Contrôle : Fichiers et octets attendus, sources conservées pour les copies.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P005 — Annuler une erreur de rangement
- Demande : « Annule le déplacement puis rétablis-le. »
- Actions candidates : `files.move`, `files.canUndoRedo`, `files.undoFileOperation`, `files.redoFileOperation`.
- Contrôle : Arborescence et historique exacts à chaque étape.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P006 — Supprimer avec refus
- Demande : « Supprime le projet ; à la confirmation, je refuse. »
- Actions candidates : `project.trash`, `documents.list`.
- Contrôle : Aucune disparition sur disque ni fermeture collatérale.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P007 — Sauvegarder une variante
- Demande : « Renomme mon document, sauvegarde et rouvre-le. »
- Actions candidates : `document.rename`, `document.save`, `document.close`, `document.open`.
- Contrôle : Identité, contenu et nouveau nom persistants.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P008 — Exporter un document
- Demande : « Exporte une copie dans le format demandé. »
- Actions candidates : `document.export`, `file.facts`.
- Contrôle : Format décodable, contenu attendu, original intact.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P009 — Choisir un modèle adapté
- Demande : « Choisis un modèle installé adapté à ma demande. »
- Actions candidates : `ai.localState`, `models.search`, `models.select`.
- Contrôle : Choix fondé sur capacités et disponibilité, aucun téléchargement implicite.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P010 — Préparer une génération
- Demande : « Prépare cette image et indique les paramètres et le coût avant de lancer. »
- Actions candidates : `models.readGenerationModelFields`, `generator.prepare`, `generator.readArmedGeneration`, `cost.estimate`.
- Contrôle : Modèle, champs et coût cohérents ; aucune tâche soumise avant demande de lancement.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P011 — Suivre une génération
- Demande : « Lance la génération et préviens quand le résultat est disponible. »
- Actions candidates : `generator.submit`, `jobs.list`, `job.readCloudGeneration`, `job.waitForCloudGeneration`.
- Contrôle : Une soumission, progression réelle, résultat correspondant à son identifiant.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P012 — Annuler une génération
- Demande : « Annule la génération en cours. »
- Actions candidates : `generator.submit`, `job.cancelCloudGeneration`, `job.readCloudGeneration`.
- Contrôle : État final vérifié ; ne pas promettre un remboursement ni une annulation déjà impossible.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P013 — Gérer le runtime local
- Demande : « Prépare le runtime nécessaire, puis annule l’opération si je change d’avis. »
- Actions candidates : `ai.localState`, `ai.manageLocalRuntime`, `task.cancelLocalTask`.
- Contrôle : Branches dynamiques à inspecter ; ressources et tâches finales connues.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P014 — Retrouver une ressource manquante
- Demande : « Quels médias manquent à mon projet ? »
- Actions candidates : `assets.listMissing`, `assets.searchProjectCatalogue`, `asset.get`.
- Contrôle : Identifier les références cassées sans inventer de fichier de remplacement.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P015 — Enrichir le catalogue
- Demande : « Décris mes images et corrige le titre de celle choisie. »
- Actions candidates : `assets.captionImages`, `asset.update`, `asset.get`.
- Contrôle : Métadonnées ciblées seulement, distinguer description générée et contenu original.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P016 — Synchroniser prudemment
- Demande : « Montre les changements puis synchronise ceux que j’ai choisis. »
- Actions candidates : `cloud.previewSync`, `cloud.pull`, `cloud.push`.
- Contrôle : Compte de test, plan puis résultat vérifié, conflit explicite et aucune publication supplémentaire.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P017 — Chercher des références publiques
- Demande : « Trouve des références publiques similaires à ce média. »
- Actions candidates : `cloud.explorePublicFeed`, `cloud.findSimilarPublished`.
- Contrôle : Résultats sourcés dans le compte de test ; aucune modification ni prétention d’exhaustivité.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P018 — Créer une composition image
- Demande : « Ajoute un titre, positionne-le et garde le fond inchangé. »
- Actions candidates : `layer.add`, `layer.editTextLayer`, `layer.transform`, `canvas.state`.
- Contrôle : Texte, dimensions, position et pixels témoins corrects.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P019 — Organiser des calques
- Demande : « Duplique ces calques et range les copies dans un groupe. »
- Actions candidates : `layer.duplicate`, `layer.group`, `layer.reorderInStack`, `layer.ungroup`.
- Contrôle : Identifiants distincts, ordre correct, originaux intacts.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P020 — Respecter un calque verrouillé
- Demande : « Verrouille le logo, puis essaie de le déplacer. »
- Actions candidates : `layer.lock`, `layer.transform`, `canvas.state`.
- Contrôle : Respect du comportement de verrouillage défini par le handler, sans autre cible substituée.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P021 — Corriger une ambiguïté de calque
- Demande : « Renomme Texte en Titre avec deux documents contenant Texte. »
- Actions candidates : `documents.list`, `canvas.state`, `layer.rename`.
- Contrôle : Clarification puis mutation uniquement dans le document choisi.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P022 — Dessiner du pixel art
- Demande : « Dessine une petite icône sur une grille puis agrandis le canevas. »
- Actions candidates : `canvas.setPixelArt`, `canvas.drawPixels`, `canvas.resize`.
- Contrôle : Pixels exacts, coordonnées et règles de redimensionnement vérifiées.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P023 — Recadrer et guider
- Demande : « Ajoute un repère, recadre puis tourne l’image. »
- Actions candidates : `guide.add`, `guide.move`, `canvas.crop`, `canvas.flipOrRotate`.
- Contrôle : Dimensions et transformations correctes, relation aux guides selon le contrat.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P024 — Monter une séquence
- Demande : « Place deux clips successifs sur une piste vidéo. »
- Actions candidates : `track.add`, `clip.add`, `clip.move`, `sequence.state`.
- Contrôle : Durées et ordre exacts, pas de chevauchement non demandé.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P025 — Couper puis ajuster
- Demande : « Coupe le clip, raccourcis la fin et ajoute un fondu. »
- Actions candidates : `clip.split`, `clip.trim`, `clip.fade`, `clip.gain`.
- Contrôle : Segments et temps source corrects, transition audible ou visible sur fixture de référence.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P026 — Modifier la vitesse
- Demande : « Accélère ce clip puis rapproche le suivant. »
- Actions candidates : `clip.speed`, `clip.move`, `sequence.state`.
- Contrôle : Durée et placement recalculés selon le contrat, pas d’altération du média source.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P027 — Gérer les pistes
- Demande : « Isole la voix et verrouille la musique. »
- Actions candidates : `track.setMuteSoloLockHeight`, `track.reorderTracks`, `track.rename`.
- Contrôle : États mute/solo/verrouillage et ordre cohérents.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P028 — Créer un objet 3D
- Demande : « Ajoute un cube nommé Repère puis appelle-le Socle. »
- Actions candidates : `node.add`, `node.rename`, `node.transform`, `scene.state`.
- Contrôle : Un seul objet créé, identité conservée, transformation exacte.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P029 — Position relative
- Demande : « Place la sphère deux mètres à droite du cube. »
- Actions candidates : `scene.state`, `node.transform`.
- Contrôle : Lire les deux positions ; vérifier le bon repère et ne pas déplacer le cube.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P030 — Transformer une hiérarchie
- Demande : « Attache les roues au véhicule puis déplace l’ensemble. »
- Actions candidates : `node.attach`, `node.reparent`, `node.transform`, `scene.state`.
- Contrôle : Parentage correct, absence de cycle, poses locales et mondiales contrôlées.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P031 — Construire un solide
- Demande : « Creuse une ouverture puis sépare le résultat si nécessaire. »
- Actions candidates : `node.markAsCuttingTool`, `node.combineIntoSolid`, `node.separate`.
- Contrôle : Géométrie et identité des entrées selon le contrat, inspection 3D réelle.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P032 — Animer une caméra
- Demande : « Crée un travelling qui vise le personnage. »
- Actions candidates : `camera.addShot`, `camera.createAndBindPath`, `camera.aimShotAt`, `camera.reorder`.
- Contrôle : Chemin, cible et ordre des plans, vérification temporelle et visuelle.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P033 — Éclairer une scène
- Demande : « Éclaire la scène et ajoute une brume légère. »
- Actions candidates : `world.setSceneLighting`, `world.setFog`, `world.setToneMapping`, `scene.capture`.
- Contrôle : État attendu et capture reproductible avec tolérance, sans confondre capture et preuve sémantique.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P034 — Optimiser sans perte inattendue
- Demande : « Optimise le décor mais conserve le personnage. »
- Actions candidates : `optimization.analyze`, `optimization.exclude`, `optimization.selection`, `optimization.report`.
- Contrôle : Exclusion respectée, métriques avant/après et qualité visuelle contrôlées.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P035 — Créer un matériau
- Demande : « Prépare un matériau et applique-le à cet objet. »
- Actions candidates : `material.setChannelImage`, `material.setSurfaceSettings`, `model.setMaterialDocument`.
- Contrôle : Canaux et objet ciblés, ressources valides et rendu cohérent.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P036 — Préparer un ciel
- Demande : « Règle le soleil puis annule les ajustements d’image. »
- Actions candidates : `skybox.setSourceImage`, `skybox.setSun`, `skybox.adjustImage`, `skybox.resetAdjustments`.
- Contrôle : Distinction réglages soleil/image, état exact après remise à zéro.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P037 — Réutiliser un style
- Demande : « Enregistre ce style, renomme-le puis retire la copie. »
- Actions candidates : `style.save`, `style.rename`, `styles.list`, `style.remove`.
- Contrôle : Pas d’écrasement inattendu, persistance et suppression de la bonne entrée.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P038 — Composer des effets
- Demande : « Ajoute deux effets, change leur ordre et compare avant/après. »
- Actions candidates : `post.add`, `post.move`, `post.set`, `post.setWholeStackEnabled`.
- Contrôle : Ordre non commutatif pris en compte, valeurs et activation vérifiées.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P039 — Animer un effet
- Demande : « Anime l’intensité de cet effet puis retire la clé choisie. »
- Actions candidates : `post.addKeyframe`, `post.removeKeyframe`, `post.state`.
- Contrôle : Bon paramètre au bon temps, clés voisines conservées.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P040 — Créer un squelette
- Demande : « Prépare le squelette du personnage et configure ses mains. »
- Actions candidates : `rig.fit`, `bone.setRole`, `rig.configureHands`, `rig.state`.
- Contrôle : Hiérarchie et rôles plausibles vérifiés, mauvais type d’objet refusé.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P041 — Ajouter une prise IK
- Demande : « Ajoute une cible de main puis retire la contrainte. »
- Actions candidates : `socket.add`, `ik.add`, `ik.remove`, `rig.state`.
- Contrôle : Sujet correct et état cohérent après retrait.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P042 — Monter une animation
- Demande : « Ajoute un mouvement et ajuste une pose au bon instant. »
- Actions candidates : `animation.addBlock`, `animation.setBlockSettings`, `key.writePoseKeys`, `key.move`.
- Contrôle : Temps, unités, sujet et canaux exacts ; autres clés intactes.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P043 — Rouvrir un mouvement enregistré
- Demande : « Rouvre le mouvement enregistré dans ce média. »
- Actions candidates : `animations.list`, `animation.reopenMotion`.
- Contrôle : Nécessite une fixture avec bande sauvegardée ; vérifier durée, canaux et pose retrouvés.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P044 — Préparer des contrôles
- Demande : « Ajoute les contrôles clavier et manette de mon personnage. »
- Actions candidates : `inputMap.write`, `inputMap.read`, `inputMaps.list`.
- Contrôle : Schéma valide, sauvegarde puis lecture identique, fichier voisin intact.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P045 — Configurer un graphe
- Demande : « Configure le graphe et vérifie l’adaptation du mouvement. »
- Actions candidates : `animationGraph.write`, `animationGraph.read`, `animation.retargetStatus`.
- Contrôle : Références existantes, transitions et statut de retargeting réels.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P046 — Assembler un jeu
- Demande : « Crée une scène jouable avec deux instances du même préfab. »
- Actions candidates : `game.applyTemplate`, `prefab.define`, `prefab.instantiate`, `component.attach`.
- Contrôle : Instances distinctes et références partagées selon contrat, composants attendus.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P047 — Éditer un composant
- Demande : « Change la vitesse du personnage puis retire un composant. »
- Actions candidates : `component.setProperties`, `component.detach`, `scene.state`.
- Contrôle : Propriétés validées et retrait ciblé, erreurs explicites pour propriété inconnue.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P048 — Jouer et diagnostiquer
- Demande : « Lance la scène, avance d’un pas et montre les erreurs. »
- Actions candidates : `play.start`, `play.pause`, `play.step`, `runtime.errors`, `play.stop`.
- Contrôle : Transitions runtime valides et erreurs réellement observées.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P049 — Réparer un script
- Demande : « Corrige le script du personnage et vérifie son comportement. »
- Actions candidates : `script.list`, `script.read`, `script.write`, `runtime.report`.
- Contrôle : Diff ciblé, compilation/diagnostics et comportement ; exécution uniquement en environnement jetable.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P050 — Changer de scène
- Demande : « Programme la scène suivante puis retire ce changement. »
- Actions candidates : `timeline.addSceneCue`, `play.loadScene`, `timeline.removeSceneCue`.
- Contrôle : Moment et scène cibles corrects, aucun cue voisin supprimé.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P051 — Exporter un jeu
- Demande : « Exporte le jeu pour la cible disponible. »
- Actions candidates : `game.export`, `file.facts`.
- Contrôle : Artefact complet et lançable, erreurs de cible explicites, aucun déploiement implicite.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P052 — Versionner localement
- Demande : « Enregistre uniquement les changements choisis. »
- Actions candidates : `git.status`, `git.diff`, `git.stage`, `git.commit`, `git.log`.
- Contrôle : Index et commit exacts dans un dépôt Git de test, aucun fichier sensible ajouté.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P053 — Gérer un conflit
- Demande : « Résous le conflit ou annule proprement la fusion. »
- Actions candidates : `git.branches`, `git.checkout`, `git.pull`, `git.diff`, `git.resolve`, `git.abortMerge`.
- Contrôle : Dépôt distant jetable ; contenu et index vérifiés après résolution et annulation.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P054 — Publier vers un distant de test
- Demande : « Pousse la branche autorisée vers le distant de test. »
- Actions candidates : `git.remotes`, `git.fetch`, `git.push`.
- Contrôle : Référence distante attendue seulement ; aucun push forcé implicite.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P055 — Gérer une remise
- Demande : « Mets mes changements de côté puis restaure la bonne remise. »
- Actions candidates : `git.stash`, `git.stashes`, `git.stashPop`, `git.stashDrop`.
- Contrôle : Octets conservés, conflits explicites et aucune remise voisine effacée.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P056 — Mémoriser une convention
- Demande : « Retiens la convention de ce projet puis retrouve-la. »
- Actions candidates : `memory.write`, `memory.link`, `memory.recall`, `context.writeProjectCard`.
- Contrôle : Portée projet correcte ; mémoire non traitée comme autorisation d’action.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P057 — Oublier une information
- Demande : « Oublie cette convention sans toucher au reste. »
- Actions candidates : `memory.read`, `memory.forget`, `context.deleteProjectCard`.
- Contrôle : Suppression ciblée et absence au rappel, autres projets inchangés.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P058 — Changer les réglages invités
- Demande : « Change le réglage demandé sur le profil de test. »
- Actions candidates : `settings.read`, `settings.write`, `accounts.activate`.
- Contrôle : Seul le profil invité change, confirmation réelle selon contrat.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P059 — Organiser l’espace de travail
- Demande : « Ouvre les bons panneaux puis passe en plein écran. »
- Actions candidates : `panels.list`, `panel.open`, `panel.close`, `window.fullScreen`.
- Contrôle : Fenêtre invitée seule, état UI réel, fermeture du panneau correct.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P060 — Utiliser la dictée
- Demande : « Démarre la dictée puis arrête-la. »
- Actions candidates : `dictation.state`, `dictation.start`, `dictation.stop`.
- Contrôle : Microphone de test uniquement ; autorisations, absence de périphérique et arrêt effectif.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P061 — Trouver une action inconnue
- Demande : « Explique comment réaliser une opération puis prépare les actions possibles. »
- Actions candidates : `actions.find`, `studio.describe`, `studio.docs`.
- Contrôle : Découverte à partir du catalogue courant ; aucune action inventée.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P062 — Exécuter un lot avec incident
- Demande : « Applique trois changements, dont le deuxième est invalide. »
- Actions candidates : `studio.batch`, `studio.state`.
- Contrôle : Établir la vraie sémantique de lot : arrêt/continuité/effets partiels ; ne pas supposer de transaction.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

## P063 — Reprendre après redémarrage
- Demande : « Reprends le projet sauvegardé après relance de l’instance. »
- Actions candidates : `document.save`, `project.close`, `project.open`, `studio.state`.
- Contrôle : Persistance et sélection retrouvées selon contrat ; aucune ancienne tâche rejouée automatiquement.
- Déclinaisons : succès, cible absente/ambiguë, refus humain applicable, erreur à chaque étape avec effet, interruption, réouverture et formulation dans une autre langue.

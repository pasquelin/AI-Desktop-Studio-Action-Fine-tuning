# Parcours P022 à P043 : préparation des séquences de référence

22 fichiers déclaratifs version 1, avec entrées exactes, réponses décodées MCP, références aux identifiants retournés et assertions d’état. Aucun appel Studio n’a été exécuté par ce lot ; trainingApproved reste false partout.

## Contrats consultés

Lecture seule des handlers Studio : canvasHandlers/canvasPixelHandlers, coreHandlers (workspace.open), sceneNodeActions/sceneNodeBasicHandlers/sceneStateHandler, sceneWorldHandlers/sceneCameraViewHandlers, sceneHandlers (optimization), materialHandlers, postHandlers, sequenceHandlers, rigHandlers/rigKeyHandlers. Contrôles complémentaires dans timelineState, trackCommands, commandsStructure, animationTrackCommands, postCommands et les domaines animation/style/postProcessingRegistry/adjustments.

L’appel conserve la réponse décodée et non une enveloppe data. node.add répond nodeId ; workspace.open documentId ; camera.addShot shotId ; guide.add guideId ; clip.add clipIds ; styles.list/save/rename/remove répondent directement un tableau. Les autres lectures reprennent les champs réellement produits.

Les identifiants de cible viennent des réponses, jamais de noms de type node-1. Les noms définis par le test servent uniquement à sélectionner un objet unique. La création du dossier du projet est vérifiée sur disque dans chaque parcours.

## Corrections importantes issues de la lecture

- La séquence vidéo neuve contient déjà une piste vidéo et une piste audio. Les parcours vidéo réutilisent la piste vidéo unique au lieu d’en ajouter une puis de créer une ambiguïté.
- La séquence audio neuve contient quatre pistes. Les deux premières sont nommées après lecture ; le compte initial est vérifié.
- clip.speed écrit la vitesse de lecture source, mais ne réduit pas duration. P026 garde la durée de montage de quatre secondes et rapproche le second clip de six à quatre secondes. Une attente de durée divisée par deux aurait été un faux oracle.
- post.removeKeyframe retire la clé mais conserve le canal vide. P039 vérifie ce tableau vide ainsi que la clé du canal radius voisin conservée.
- rig.* travaille dans la fenêtre personnage d’un vrai GLB, pas sur une primitive humanoid de scène. Ces parcours restent liés à des fixtures explicites.
- scene.state omet les champs par défaut et les réglages optimization. Une assertion sur ces champs absents ne peut pas prouver la conservation des réglages.

## État des parcours

191 étapes décrites. Sans blocage interne déclaré : P028, P029, P036, P037, P039. Ces parcours sont candidats à exécution, pas des réussites constatées. P037 exige en outre une bibliothèque de styles vide.

Les autres parcours ont une séquence concrète, mais sont bloqués pour une fixture ou un oracle complémentaire. Le banc doit refuser de présenter une exécution partielle comme une validation du parcours complet.

### P022

Blocages : Le lecteur canvas.state ne fournit pas les pixels : l’oracle indépendant des trois cellules rouges et de leur conservation sans mise à l’échelle doit décoder le fichier image ou le rendu avant validation métier.

### P023

Blocages : La conservation ou transformation du guide après crop/rotation et les pixels témoins nécessitent un oracle indépendant complémentaire ; les contrôles de dimensions seuls ne valident pas tout le parcours.

### P024

Prérequis détaillés : fixtures.videoAssetId : identifiant réel d’un média vidéo local importé dans le projet courant, sans piste audio, durée exacte 4 000 000 microsecondes ; source synthétique immuable et empreinte connue.

Blocages : Fournisseur de fixture vidéo synthétique/catalogue invité requis ; aucun assetId fictif ni téléchargement implicite.

### P025

Prérequis détaillés : fixtures.videoAssetId : identifiant réel d’un média vidéo local importé dans le projet courant, sans piste audio, durée exacte 4 000 000 microsecondes ; source synthétique immuable et empreinte connue.

Blocages : Fournisseur de fixture vidéo synthétique/catalogue invité requis ; aucun assetId fictif ni téléchargement implicite. Comparer la transition visible sur la source synthétique ; les valeurs de montage seules ne prouvent pas le rendu du fondu.

### P026

Prérequis détaillés : fixtures.videoAssetId : identifiant réel d’un média vidéo local importé dans le projet courant, sans piste audio, durée exacte 4 000 000 microsecondes ; source synthétique immuable et empreinte connue. Contrat constaté : clip.speed change la vitesse source sans changer la durée de montage. Le second clip est rapproché de 6 s à la fin effective du premier à 4 s.

Blocages : Fournisseur de fixture vidéo synthétique/catalogue invité requis ; aucun assetId fictif ni téléchargement implicite. Comparer l’empreinte des octets du média source avant/après via le fournisseur de fixture.

### P027

Blocages : Les pistes préparées sont vides : la configuration solo/verrouillage est vérifiable, mais l’isolation audible de la voix nécessite deux médias audio synthétiques référencés et une vérification du mix.

### P028

Blocages : aucun blocage interne identifié, exécution réelle restante.

### P029

Blocages : aucun blocage interne identifié, exécution réelle restante.

### P030

Blocages : Le lecteur expose les poses locales ; compléter l’oracle matriciel indépendant des poses mondiales des roues après déplacement parent.

### P031

Blocages : Inspecter la géométrie CSG calculée (ouverture, volume et solides séparés) via moteur rendu ; type carved et deux identifiants ne prouvent pas le solide attendu.

### P032

Blocages : Le chemin créé et la visée sont contrôlés structurellement ; vérifier le trajet et l’orientation aux instants 0, 1,5 et 3 secondes dans un oracle du moteur caméra.

### P033

Blocages : La capture MCP est un résultat image et non un JSON générique ; le banc doit conserver et comparer les pixels avec tolérance, après barrière de rendu.

### P034

Blocages : Le résumé scene.state omet optimization : ajouter un lecteur indépendant du mode exclude et une comparaison des métriques/rendu ; ne pas déduire l’exclusion réelle du seul accusé de mutation.

### P035

Prérequis détaillés : fixtures.textureAssetId : image locale synthétique importée et empreinte connue. fixtures.meshAssetId : GLB local importé avec au moins un emplacement de matériau.

Blocages : Les deux médias doivent être importés dans le projet invité et leurs identifiants fournis ; vérification de liaison matériau/slot et rendu à compléter depuis le contrat du modèle chargé.

### P036

Blocages : aucun blocage interne identifié, exécution réelle restante.

### P037

Prérequis détaillés : Profil invité vierge : styles.list doit être vide avant le test ; le test refuse toute bibliothèque préexistante.

Blocages : aucun blocage interne identifié, exécution réelle restante.

### P038

Blocages : Comparaison visuelle avant/après à ajouter pour prouver le rendu non commutatif ; cette séquence vérifie l’ordre et l’activation du contrat.

### P039

Prérequis détaillés : Scène vide, tête de lecture à zéro (workspace.open template empty).

Blocages : aucun blocage interne identifié, exécution réelle restante.

### P040

Prérequis détaillés : fixtures.characterPath : chemin relatif réel d’un GLB humanoïde local du projet invité ; importer/ouvrir une fixture avec géométrie mesurable et articulation de main connue.

Blocages : Ouverture de fenêtre personnage et fin de mesure géométrique doivent être attestées par Studio ; rig.fit refuse tant que meshSample est absent. Fixture GLB et oracle de topologie/poids nécessaires.

### P041

Prérequis détaillés : fixtures.characterPath : chemin relatif réel d’un GLB humanoïde local du projet invité ; importer/ouvrir une fixture avec géométrie mesurable et articulation de main connue. Fixture déjà riggée, rôle LeftHand unique avec chaîne de parents adaptée, aucun IK initial.

Blocages : Le fournisseur de fixture GLB riggée et la disponibilité de sa fenêtre dédiée ne sont pas encore intégrés.

### P042

Prérequis détaillés : fixtures.characterAssetId : GLB local importé avec une animation embarquée nommée fixtures.embeddedClipName ; modèle chargé avant animations.list.

Blocages : Fournisseur de GLB animé requis. Vérifier que tracks contient exactement le canal position demandé avant de cibler tracks.0 ; oracle pose finale et canaux voisins à compléter.

### P043

Prérequis détaillés : fixtures.characterAssetId : GLB local importé. fixtures.savedMotionAssetId : média animation compatible, créé par sauvegarde réelle d’une bande pour ce personnage ; durée/canaux/pose de référence conservés.

Blocages : Fixture de mouvement sauvegardé absente ; rig.state expose motions mais ne démontre pas à lui seul durée/canaux/pose retrouvés. Oracle de fenêtre personnage à compléter.

## Contrôles et limites

Le catalogue local a été utilisé pour vérifier les noms d’actions, champs requis, valeurs enum et types des valeurs littérales. Les références dynamiques doivent être résolues et validées à l’exécution ; une validation statique qui remplace une référence par une valeur générique ne prouve pas le type réel.

Les capacités requires sont des identifiants stables, les descriptions sont dans ce rapport. Les fournisseurs de fixtures doivent importer les médias dans le nouveau projet après sa création et fournir les variables fixtures.* avant les appels qui en dépendent. Aucun import, génération de média ou oracle image n’est simulé.

Points à intégrer au banc : lecture imbriquée pick (par exemple clips.0.duration), résolution récursive des références dans find et expected, saveAs avant assertions, support des résultats image de scene.capture. Le test P037 ne doit jamais être exécuté sur la bibliothèque de styles personnelle.

Pas de commit, push, changement Studio ou validation globale par cet agent ; intégration et porte finale à la charge du parent.

## Fixtures locales effectivement produites

Le générateur `node tools/prepare-media-fixtures.ts` utilise uniquement Node et ses modules intégrés. Il écrit dans `artifacts/fixtures/media` :

- `checker.png` : damier rouge/bleu de 32 × 32 pixels RGB, cellules de 8 pixels ; utilisable comme texture synthétique.
- `tone-220.wav` et `tone-440.wav` : quatre secondes, PCM mono 48 kHz, 16 bits. Ce sont deux signaux de test, pas une voix ni une musique. Ils peuvent servir d’oracle technique du mix, mais pas certifier une séparation sémantique de voix.
- `triangle.glb` : géométrie triangulaire indexée avec normales et un emplacement de matériau ; ni squelette ni animation. Il peut satisfaire la géométrie statique de P035 après import.
- `manifest.json` : tailles et SHA-256 des quatre fichiers, avec `importedIntoStudio: false`.

Les formats ont été reconnus par l’outil système. Trois tests décodent les contenus : pixels PNG après décompression, structure WAV et fréquences, chunks/accessors/indices GLB. Aucun encodeur vidéo ni ffmpeg n’est présumé installé ; P024–P026 restent sans vidéo synthétique importable préparée. Les GLB riggés et les mouvements sauvegardés ne sont pas simulés par le triangle.

Les racines externes sont maintenant explicitement déclarées dans `requiredBindings` : `fixtures` pour P024–P026, P035 et P040–P043 ; liste vide ailleurs. Le fournisseur devra fournir des identifiants authentiques obtenus après import, jamais les noms des fichiers à la place d’un identifiant.

Le typage global a été tenté : il s’arrêtait alors sur l’import `conversation.ts` encore absent dans le chantier du moteur commun. La porte finale appartient toujours à l’intégrateur.

## Raccordement des fichiers invités : contrat manquant identifié

La présence des quatre fichiers dans `sandbox/fixtures` ne les importe pas dans le projet `sandbox/Bench Project`. Le catalogue MCP actuel ne contient aucune action d’import de fichiers externes. `files.copy` ne convient pas : `src/main/project/handlers.ts` passe ses chemins par `parseFolderPaths` puis `files.duplicate`, donc il s’agit d’une copie interne au projet. Les chemins absolus `fixture.imagePath`, `fixture.audioPath`, `fixture.alternateAudioPath` et `fixture.meshPath` ne doivent pas lui être transmis.

Une préparation réelle peut suivre cette séquence, à intégrer explicitement au fournisseur de fixtures :

1. Transférer les quatre fichiers et le manifeste vers `sandbox/fixtures` dans la VM, puis vérifier leurs SHA-256.
2. Exécuter `project.create` et attendre sa réussite effective. Créer ensuite `projectPath/Fixtures` et y copier les fichiers depuis `sandbox/fixtures`, par un hook de préparation disque borné au projet jetable. Aucun dossier de l’hôte n’a besoin d’être monté dans la VM.
3. Appeler `file.open` avec un chemin relatif, par exemple `{ "path": "Fixtures/checker.png" }`. La route `openProjectFile` attend `bridge.media.adopt` ; `adoptFile` enregistre une ligne catalogue réelle avec `path: "Fixtures/checker.png"`, `name: "checker"`, puis ouvre le média. Un refus d’ouverture reste un échec à examiner.
4. Appeler `assets.searchProjectCatalogue` avec `{ "text": "checker", "type": "image" }`. Vérifier une correspondance unique par `path` et prélever son `id` réel. Une recherche vide répond par un objet de diagnostic au lieu d’un tableau : elle doit faire échouer la préparation. Pour le GLB, rechercher `triangle` de type `mesh`, chemin `Fixtures/triangle.glb`.
5. Rendre les identifiants aux étapes suivantes, puis restaurer/activer le document cible avant les mutations, puisque `file.open` peut ouvrir un éditeur ou une fenêtre de média. Pour P035, la texture et le maillage peuvent alors alimenter les deux entrées actuellement externes `fixtures.textureAssetId` et `fixtures.meshAssetId`.

Cette chaîne est tracée dans le code Studio, pas exécutée dans la VM. `adoptFile` attend l’écriture du catalogue, mais ses dérivations passent par `onAdopted` : l’existence de la ligne n’atteste pas le rendu, une forme d’onde ou la disponibilité de toutes les ressources. La disponibilité utile doit avoir un oracle propre, sans pause arbitraire.

En l’absence de ce hook après création du projet, aucun des parcours P022–P043 n’est déclaré autonome grâce aux seuls chemins `fixture.*`. P035 reste bloqué sur l’import effectif et son oracle d’application du matériau ; P027 ne devient pas un test de voix et musique avec deux sinusoïdes. P024–P026 nécessitent toujours une vidéo ; P040–P043 nécessitent toujours les géométries articulées, animations ou mouvements adéquats. Les autres parcours ne dépendent pas de ces quatre médias. Aucun blocage n’a été supprimé sur la seule existence d’un fichier.

### Raccordement P035 préparé avec le hook confirmé

Le moteur commun fournit désormais, par contrat d’intégration, la copie après `project.create` pour la capacité `local-media-fixtures`. P035 utilise donc `file.open` pour `Fixtures/checker.png` et `Fixtures/triangle.glb`, vérifie `opened: asset`, puis recherche les deux lignes catalogue et extrait leur identifiant par chemin exact avec correspondance unique. Il crée son document matériau après ces ouvertures pour retrouver le bon contexte. Les anciennes entrées externes `fixtures.textureAssetId` et `fixtures.meshAssetId` ne sont plus requises dans ce parcours.

Cela prépare une séquence autonome d’acquisition des identifiants, sans prouver son succès dans la VM. Le blocage d’oracle matériau/slot/rendu reste présent et `trainingApproved` reste faux. P022 et P023 dessinent leurs propres pixels : ajouter le PNG ne résoudrait pas leurs oracles manquants. Aucun autre parcours de ce lot ne devient complet avec les quatre médias disponibles.

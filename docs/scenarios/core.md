# IA, génération et navigation — 15 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer modèle actif, génération armée, paramètres et tâches avant/après ; une tâche soumise ne vaut pas génération terminée.

## ai.localState — Lire le runtime IA local

Rend les candidats IA locaux, leur installation et chargement, les rôles, l’adéquation à la machine, les téléchargements et l’état du runtime.

- Nom MCP : `ai_localState`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 43.11.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `ai.localState/001` | Nominal minimal : demander « Lire le runtime IA local » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `ai.localState/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `ai.localState/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `ai.localState/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `ai.localState/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `ai.localState/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `ai.localState/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## ai.manageLocalRuntime — Gérer le runtime IA local

Choisit, installe, retire, charge ou décharge un candidat IA local, ou lit et répare son runtime. Lire d’abord ai.localState. Toute opération sauf la lecture du moteur modifie le studio et demande confirmation.

- Nom MCP : `ai_manageLocalRuntime`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"raises":{"runtimeFunction":true}}`.
- Batterie existante : 43.12.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `operation` | choice | True | `{"options":["choose","install","cancelInstall","remove","load","cancelLoad","unload","readEngine","installEngine","cancelEngineInstall","installRuntime","cancelRuntimeInstall"]}` |
| `localId` | text | False | `{}` |
| `role` | choice | False | `{"options":["assistant","dictation","embedding","image/txt2img","image/img2img","image/inpaint","image/outpaint","image/controlnet","image/reference","video/txt2video","video/img2video","video/video2video","3d/txt23d","3d/img23d","3d/3d23d","3d/rig","3d/motion","audio/txt2audio","audio/audio2audio","audio/video2audio","material/txt2img_texture","material/img2img_texture","material/controlnet_texture","material/reference_texture","skybox/txt2skybox","skybox/img2skybox","code/txt2code","code/code2code","upscale/upscale","background-removal/cutout","vectorization/vectorize"]}` |
| `scope` | choice | False | `{"options":["app","project"]}` |
| `profile` | choice | False | `{"options":["motion"]}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["operation"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `ai.manageLocalRuntime/001` | Nominal minimal : demander « Gérer le runtime IA local » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `ai.manageLocalRuntime/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `ai.manageLocalRuntime/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `ai.manageLocalRuntime/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `ai.manageLocalRuntime/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `ai.manageLocalRuntime/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `ai.manageLocalRuntime/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `ai.manageLocalRuntime/008` | Préparation ou contrainte dynamique manquante : tester chaque branche du callback du handler ; le marqueur runtimeFunction du catalogue ne révèle pas ces branches. |
| `ai.manageLocalRuntime/009` | Paramètre operation absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `ai.manageLocalRuntime/010` | Paramètre operation avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `ai.manageLocalRuntime/011` | Option de operation : "choose" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/012` | Option de operation : "install" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/013` | Option de operation : "cancelInstall" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/014` | Option de operation : "remove" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/015` | Option de operation : "load" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/016` | Option de operation : "cancelLoad" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/017` | Option de operation : "unload" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/018` | Option de operation : "readEngine" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/019` | Option de operation : "installEngine" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/020` | Option de operation : "cancelEngineInstall" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/021` | Option de operation : "installRuntime" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/022` | Option de operation : "cancelRuntimeInstall" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/023` | Option inconnue de operation : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `ai.manageLocalRuntime/024` | Paramètre localId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `ai.manageLocalRuntime/025` | Paramètre localId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `ai.manageLocalRuntime/026` | Texte localId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `ai.manageLocalRuntime/027` | Paramètre role absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `ai.manageLocalRuntime/028` | Paramètre role avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `ai.manageLocalRuntime/029` | Option de role : "assistant" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/030` | Option de role : "dictation" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/031` | Option de role : "embedding" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/032` | Option de role : "image/txt2img" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/033` | Option de role : "image/img2img" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/034` | Option de role : "image/inpaint" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/035` | Option de role : "image/outpaint" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/036` | Option de role : "image/controlnet" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/037` | Option de role : "image/reference" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/038` | Option de role : "video/txt2video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/039` | Option de role : "video/img2video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/040` | Option de role : "video/video2video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/041` | Option de role : "3d/txt23d" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/042` | Option de role : "3d/img23d" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/043` | Option de role : "3d/3d23d" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/044` | Option de role : "3d/rig" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/045` | Option de role : "3d/motion" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/046` | Option de role : "audio/txt2audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/047` | Option de role : "audio/audio2audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/048` | Option de role : "audio/video2audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/049` | Option de role : "material/txt2img_texture" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/050` | Option de role : "material/img2img_texture" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/051` | Option de role : "material/controlnet_texture" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/052` | Option de role : "material/reference_texture" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/053` | Option de role : "skybox/txt2skybox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/054` | Option de role : "skybox/img2skybox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/055` | Option de role : "code/txt2code" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/056` | Option de role : "code/code2code" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/057` | Option de role : "upscale/upscale" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/058` | Option de role : "background-removal/cutout" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/059` | Option de role : "vectorization/vectorize" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/060` | Option inconnue de role : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `ai.manageLocalRuntime/061` | Paramètre scope absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `ai.manageLocalRuntime/062` | Paramètre scope avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `ai.manageLocalRuntime/063` | Option de scope : "app" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/064` | Option de scope : "project" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/065` | Option inconnue de scope : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `ai.manageLocalRuntime/066` | Paramètre profile absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `ai.manageLocalRuntime/067` | Paramètre profile avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `ai.manageLocalRuntime/068` | Option de profile : "motion" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `ai.manageLocalRuntime/069` | Option inconnue de profile : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## command.runStudioCommand — Lancer une commande

Déclenche une commande du studio par son identifiant, exactement comme un raccourci clavier ou une entrée de menu. Le document visé doit être devant. Un identifiant s’écrit <portée>.<verbe>, et studio.state répond la portée de ce qui est devant : reprendre une modification d’un document, c’est <portée>.undo — scene.undo, canvas.undo, sequence.undo — et la remettre <portée>.redo. UN appel reprend UN geste, donc un second reprend celui d’avant : relire le document plutôt que de l’envoyer deux fois. Aucune autre action n’annule une modification, files.undoFileOperation ne couvrant que les fichiers du projet.

- Nom MCP : `command_runStudioCommand`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"raises":{"runtimeFunction":true}}`.
- Batterie existante : 45.1, 10.9, 71.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `command` | choice | True | `{"options":["app.new","project.new","project.open","document.save","document.saveAs","document.close","montage.import","layout.reset","app.settings","app.assistant","app.dictate","window.fullScreen","spaces.moveLeft","spaces.moveRight","explorer.newFolder","explorer.duplicate","explorer.cut","explorer.copy","explorer.paste","explorer.trash","explorer.undo","explorer.redo","scene.play","scene.navigate","scene.select","scene.translate","scene.rotate","scene.scale","scene.frame","scene.frameFollow","scene.isolate","scene.hide","scene.showAll","scene.snap","scene.space","scene.projection","scene.viewFront","scene.viewBack","scene.viewRight","scene.viewLeft","scene.viewTop","scene.viewBottom","scene.viewCamera","scene.quad","scene.quadEdges","scene.display","scene.capture","scene.skeletons","scene.poseMode","scene.add","scene.addToSheet","scene.removeFromSheet","scene.negate","scene.carve","scene.weld","scene.intersect","scene.separate","scene.invertCarve","scene.group","scene.duplicate","scene.optimizeSelection","scene.worldPerformance","scene.exportGame","scene.copy","scene.cut","scene.paste","scene.delete","scene.undo","scene.redo","sequence.playPause","sequence.export","sequence.exportCut","sequence.exportBundle","sequence.exportEdl","sequence.exportFcpxml","sequence.exportStems","sequence.mirror","sequence.split","sequence.delete","sequence.unlink","sequence.zoomIn","sequence.zoomOut","sequence.fit","sequence.start","sequence.end","sequence.undo","sequence.redo","canvas.zoomIn","canvas.zoomOut","canvas.zoomFit","canvas.zoomActual","canvas.mergeDown","canvas.flatten","canvas.flipHorizontal","canvas.flipVertical","canvas.rotateCw","canvas.rotateCcw","canvas.rulers","canvas.guides","canvas.grid","canvas.clearGuides","canvas.selectAll","canvas.deselect","canvas.cropApply","canvas.cropCancel","canvas.maskFromSelection","canvas.regenerate","canvas.cutout","canvas.enlarge","canvas.vectorize","canvas.extend","canvas.export","canvas.exportLayered","canvas.snap","canvas.toolMove","canvas.toolHand","canvas.toolCrop","canvas.toolSelectRectangle","canvas.toolSelectEllipse","canvas.toolSelectLasso","canvas.toolSmartSelect","canvas.toolShapeRectangle","canvas.toolShapeLine","canvas.toolShapeArrow","canvas.toolShapeEllipse","canvas.toolShapePolygon","canvas.toolShapeStar","canvas.toolBrush","canvas.toolPencil","canvas.toolText","canvas.toolEraser","canvas.toolFill","canvas.toolPicker","canvas.brushSmaller","canvas.brushLarger","canvas.undo","canvas.redo","skybox.view","skybox.probes","skybox.undo","skybox.redo","character.undo","character.redo","audio.undo","audio.redo","material.undo","material.redo","gui.undo","gui.redo"]}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["command"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `command.runStudioCommand/001` | Nominal minimal : demander « Lancer une commande » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `command.runStudioCommand/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `command.runStudioCommand/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `command.runStudioCommand/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `command.runStudioCommand/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `command.runStudioCommand/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `command.runStudioCommand/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `command.runStudioCommand/008` | Préparation ou contrainte dynamique manquante : tester chaque branche du callback du handler ; le marqueur runtimeFunction du catalogue ne révèle pas ces branches. |
| `command.runStudioCommand/009` | Paramètre command absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `command.runStudioCommand/010` | Paramètre command avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `command.runStudioCommand/011` | Option de command : "app.new" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/012` | Option de command : "project.new" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/013` | Option de command : "project.open" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/014` | Option de command : "document.save" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/015` | Option de command : "document.saveAs" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/016` | Option de command : "document.close" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/017` | Option de command : "montage.import" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/018` | Option de command : "layout.reset" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/019` | Option de command : "app.settings" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/020` | Option de command : "app.assistant" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/021` | Option de command : "app.dictate" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/022` | Option de command : "window.fullScreen" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/023` | Option de command : "spaces.moveLeft" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/024` | Option de command : "spaces.moveRight" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/025` | Option de command : "explorer.newFolder" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/026` | Option de command : "explorer.duplicate" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/027` | Option de command : "explorer.cut" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/028` | Option de command : "explorer.copy" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/029` | Option de command : "explorer.paste" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/030` | Option de command : "explorer.trash" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/031` | Option de command : "explorer.undo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/032` | Option de command : "explorer.redo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/033` | Option de command : "scene.play" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/034` | Option de command : "scene.navigate" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/035` | Option de command : "scene.select" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/036` | Option de command : "scene.translate" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/037` | Option de command : "scene.rotate" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/038` | Option de command : "scene.scale" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/039` | Option de command : "scene.frame" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/040` | Option de command : "scene.frameFollow" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/041` | Option de command : "scene.isolate" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/042` | Option de command : "scene.hide" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/043` | Option de command : "scene.showAll" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/044` | Option de command : "scene.snap" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/045` | Option de command : "scene.space" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/046` | Option de command : "scene.projection" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/047` | Option de command : "scene.viewFront" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/048` | Option de command : "scene.viewBack" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/049` | Option de command : "scene.viewRight" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/050` | Option de command : "scene.viewLeft" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/051` | Option de command : "scene.viewTop" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/052` | Option de command : "scene.viewBottom" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/053` | Option de command : "scene.viewCamera" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/054` | Option de command : "scene.quad" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/055` | Option de command : "scene.quadEdges" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/056` | Option de command : "scene.display" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/057` | Option de command : "scene.capture" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/058` | Option de command : "scene.skeletons" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/059` | Option de command : "scene.poseMode" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/060` | Option de command : "scene.add" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/061` | Option de command : "scene.addToSheet" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/062` | Option de command : "scene.removeFromSheet" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/063` | Option de command : "scene.negate" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/064` | Option de command : "scene.carve" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/065` | Option de command : "scene.weld" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/066` | Option de command : "scene.intersect" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/067` | Option de command : "scene.separate" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/068` | Option de command : "scene.invertCarve" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/069` | Option de command : "scene.group" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/070` | Option de command : "scene.duplicate" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/071` | Option de command : "scene.optimizeSelection" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/072` | Option de command : "scene.worldPerformance" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/073` | Option de command : "scene.exportGame" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/074` | Option de command : "scene.copy" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/075` | Option de command : "scene.cut" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/076` | Option de command : "scene.paste" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/077` | Option de command : "scene.delete" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/078` | Option de command : "scene.undo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/079` | Option de command : "scene.redo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/080` | Option de command : "sequence.playPause" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/081` | Option de command : "sequence.export" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/082` | Option de command : "sequence.exportCut" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/083` | Option de command : "sequence.exportBundle" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/084` | Option de command : "sequence.exportEdl" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/085` | Option de command : "sequence.exportFcpxml" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/086` | Option de command : "sequence.exportStems" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/087` | Option de command : "sequence.mirror" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/088` | Option de command : "sequence.split" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/089` | Option de command : "sequence.delete" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/090` | Option de command : "sequence.unlink" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/091` | Option de command : "sequence.zoomIn" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/092` | Option de command : "sequence.zoomOut" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/093` | Option de command : "sequence.fit" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/094` | Option de command : "sequence.start" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/095` | Option de command : "sequence.end" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/096` | Option de command : "sequence.undo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/097` | Option de command : "sequence.redo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/098` | Option de command : "canvas.zoomIn" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/099` | Option de command : "canvas.zoomOut" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/100` | Option de command : "canvas.zoomFit" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/101` | Option de command : "canvas.zoomActual" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/102` | Option de command : "canvas.mergeDown" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/103` | Option de command : "canvas.flatten" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/104` | Option de command : "canvas.flipHorizontal" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/105` | Option de command : "canvas.flipVertical" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/106` | Option de command : "canvas.rotateCw" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/107` | Option de command : "canvas.rotateCcw" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/108` | Option de command : "canvas.rulers" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/109` | Option de command : "canvas.guides" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/110` | Option de command : "canvas.grid" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/111` | Option de command : "canvas.clearGuides" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/112` | Option de command : "canvas.selectAll" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/113` | Option de command : "canvas.deselect" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/114` | Option de command : "canvas.cropApply" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/115` | Option de command : "canvas.cropCancel" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/116` | Option de command : "canvas.maskFromSelection" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/117` | Option de command : "canvas.regenerate" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/118` | Option de command : "canvas.cutout" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/119` | Option de command : "canvas.enlarge" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/120` | Option de command : "canvas.vectorize" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/121` | Option de command : "canvas.extend" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/122` | Option de command : "canvas.export" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/123` | Option de command : "canvas.exportLayered" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/124` | Option de command : "canvas.snap" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/125` | Option de command : "canvas.toolMove" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/126` | Option de command : "canvas.toolHand" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/127` | Option de command : "canvas.toolCrop" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/128` | Option de command : "canvas.toolSelectRectangle" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/129` | Option de command : "canvas.toolSelectEllipse" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/130` | Option de command : "canvas.toolSelectLasso" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/131` | Option de command : "canvas.toolSmartSelect" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/132` | Option de command : "canvas.toolShapeRectangle" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/133` | Option de command : "canvas.toolShapeLine" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/134` | Option de command : "canvas.toolShapeArrow" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/135` | Option de command : "canvas.toolShapeEllipse" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/136` | Option de command : "canvas.toolShapePolygon" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/137` | Option de command : "canvas.toolShapeStar" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/138` | Option de command : "canvas.toolBrush" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/139` | Option de command : "canvas.toolPencil" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/140` | Option de command : "canvas.toolText" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/141` | Option de command : "canvas.toolEraser" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/142` | Option de command : "canvas.toolFill" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/143` | Option de command : "canvas.toolPicker" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/144` | Option de command : "canvas.brushSmaller" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/145` | Option de command : "canvas.brushLarger" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/146` | Option de command : "canvas.undo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/147` | Option de command : "canvas.redo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/148` | Option de command : "skybox.view" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/149` | Option de command : "skybox.probes" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/150` | Option de command : "skybox.undo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/151` | Option de command : "skybox.redo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/152` | Option de command : "character.undo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/153` | Option de command : "character.redo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/154` | Option de command : "audio.undo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/155` | Option de command : "audio.redo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/156` | Option de command : "material.undo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/157` | Option de command : "material.redo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/158` | Option de command : "gui.undo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/159` | Option de command : "gui.redo" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `command.runStudioCommand/160` | Option inconnue de command : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## workspace.open — Ouvrir un espace

Bascule vers un espace de travail, et y crée un document si on le demande — un NOUVEAU à chaque fois, ce n’est donc pas le chemin de retour vers un document déjà ouvert. Donnez toujours un nom : sans lui, une fenêtre de nommage s’ouvre et l’appel attend une personne.

- Nom MCP : `workspace_open`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"asksItself":true}`.
- Batterie existante : 5.1, 5.2, 5.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `workspace` | choice | True | `{"options":["image","video","3d","code","audio","materials","skyboxes"]}` |
| `createDocument` | boolean | False | `{}` |
| `title` | text | False | `{}` |
| `folder` | text | False | `{}` |
| `template` | choice | False | `{"options":["empty","basic","firstPerson","thirdPerson","topDown","car","plane","photoStudio","cinematic","archvis","postProcessing"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["workspace"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `workspace.open/001` | Nominal minimal : demander « Ouvrir un espace » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `workspace.open/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `workspace.open/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `workspace.open/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `workspace.open/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `workspace.open/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `workspace.open/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `workspace.open/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `workspace.open/009` | Paramètre workspace absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `workspace.open/010` | Paramètre workspace avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `workspace.open/011` | Option de workspace : "image" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/012` | Option de workspace : "video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/013` | Option de workspace : "3d" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/014` | Option de workspace : "code" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/015` | Option de workspace : "audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/016` | Option de workspace : "materials" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/017` | Option de workspace : "skyboxes" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/018` | Option inconnue de workspace : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `workspace.open/019` | Paramètre createDocument absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `workspace.open/020` | Paramètre createDocument avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `workspace.open/021` | Booléen createDocument : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `workspace.open/022` | Paramètre title absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `workspace.open/023` | Paramètre title avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `workspace.open/024` | Texte title : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `workspace.open/025` | Paramètre folder absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `workspace.open/026` | Paramètre folder avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `workspace.open/027` | Texte folder : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `workspace.open/028` | Paramètre template absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `workspace.open/029` | Paramètre template avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `workspace.open/030` | Option de template : "empty" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/031` | Option de template : "basic" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/032` | Option de template : "firstPerson" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/033` | Option de template : "thirdPerson" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/034` | Option de template : "topDown" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/035` | Option de template : "car" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/036` | Option de template : "plane" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/037` | Option de template : "photoStudio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/038` | Option de template : "cinematic" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/039` | Option de template : "archvis" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/040` | Option de template : "postProcessing" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `workspace.open/041` | Option inconnue de template : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## models.search — Chercher un modèle

Cherche un moteur de génération par nom ou identifiant, famille et opération. La requête est facultative et nomme le moteur, pas le contenu à générer ; si aucun moteur n’y correspond, la famille compatible reste proposée. Ne change rien à l’écran.

- Nom MCP : `models_search`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"returns":["generationModelCandidates"]}`.
- Batterie existante : 20.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `query` | text | False | `{}` |
| `family` | choice | False | `{"options":["image","video","3d","audio","material","skybox","code","upscale","background-removal","vectorization","other"]}` |
| `operation` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `models.search/001` | Nominal minimal : demander « Chercher un modèle » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `models.search/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `models.search/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `models.search/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `models.search/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `models.search/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `models.search/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `models.search/008` | Paramètre query absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `models.search/009` | Paramètre query avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `models.search/010` | Texte query : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `models.search/011` | Paramètre family absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `models.search/012` | Paramètre family avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `models.search/013` | Option de family : "image" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.search/014` | Option de family : "video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.search/015` | Option de family : "3d" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.search/016` | Option de family : "audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.search/017` | Option de family : "material" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.search/018` | Option de family : "skybox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.search/019` | Option de family : "code" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.search/020` | Option de family : "upscale" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.search/021` | Option de family : "background-removal" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.search/022` | Option de family : "vectorization" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.search/023` | Option de family : "other" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.search/024` | Option inconnue de family : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `models.search/025` | Paramètre operation absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `models.search/026` | Paramètre operation avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `models.search/027` | Texte operation : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## models.select — Choisir un modèle

Arme un modèle pour une famille de génération. Le formulaire du Générateur se reconstruit alors sur les champs de ce modèle.

- Nom MCP : `models_select`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"inputs":["generationModelCandidates"]}`.
- Batterie existante : 20.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `family` | choice | True | `{"options":["image","video","3d","audio","material","skybox","code","upscale","background-removal","vectorization","other"]}` |
| `modelId` | text | True | `{"reference":"model"}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["family","modelId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `models.select/001` | Nominal minimal : demander « Choisir un modèle » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `models.select/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `models.select/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `models.select/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `models.select/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `models.select/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `models.select/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `models.select/008` | Paramètre family absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `models.select/009` | Paramètre family avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `models.select/010` | Option de family : "image" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.select/011` | Option de family : "video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.select/012` | Option de family : "3d" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.select/013` | Option de family : "audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.select/014` | Option de family : "material" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.select/015` | Option de family : "skybox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.select/016` | Option de family : "code" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.select/017` | Option de family : "upscale" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.select/018` | Option de family : "background-removal" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.select/019` | Option de family : "vectorization" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.select/020` | Option de family : "other" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `models.select/021` | Option inconnue de family : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `models.select/022` | Paramètre modelId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `models.select/023` | Paramètre modelId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `models.select/024` | Texte modelId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `models.select/025` | Cible modelId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## generator.prepare — Préparer une génération

Remplit le formulaire du Générateur avec un modèle et ses paramètres, puis l’affiche. Rien n’est envoyé.

- Nom MCP : `generator_prepare`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"inputs":["generationModelCandidates"],"produces":["preparedGeneration"]}`.
- Batterie existante : 20.1, 22.1, 66.1, 66.2, 66.3, 66.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `family` | choice | True | `{"options":["image","video","3d","audio","material","skybox","code","upscale","background-removal","vectorization","other"]}` |
| `modelId` | text | True | `{"reference":"model"}` |
| `operation` | text | False | `{}` |
| `parameters` | raw | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["family","modelId","parameters"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `generator.prepare/001` | Nominal minimal : demander « Préparer une génération » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `generator.prepare/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `generator.prepare/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `generator.prepare/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `generator.prepare/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `generator.prepare/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `generator.prepare/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `generator.prepare/008` | Paramètre family absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `generator.prepare/009` | Paramètre family avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `generator.prepare/010` | Option de family : "image" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `generator.prepare/011` | Option de family : "video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `generator.prepare/012` | Option de family : "3d" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `generator.prepare/013` | Option de family : "audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `generator.prepare/014` | Option de family : "material" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `generator.prepare/015` | Option de family : "skybox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `generator.prepare/016` | Option de family : "code" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `generator.prepare/017` | Option de family : "upscale" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `generator.prepare/018` | Option de family : "background-removal" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `generator.prepare/019` | Option de family : "vectorization" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `generator.prepare/020` | Option de family : "other" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `generator.prepare/021` | Option inconnue de family : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `generator.prepare/022` | Paramètre modelId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `generator.prepare/023` | Paramètre modelId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `generator.prepare/024` | Texte modelId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `generator.prepare/025` | Cible modelId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `generator.prepare/026` | Paramètre operation absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `generator.prepare/027` | Paramètre operation avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `generator.prepare/028` | Texte operation : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `generator.prepare/029` | Paramètre parameters absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `generator.prepare/030` | Paramètre parameters avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## generator.readArmedGeneration — Lire ce qui est armé

Rend le modèle, l’opération, les sources et la destination du Générateur tel qu’il est armé, sans rien envoyer ni rien dépenser.

- Nom MCP : `generator_readArmedGeneration`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 66.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `generator.readArmedGeneration/001` | Nominal minimal : demander « Lire ce qui est armé » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `generator.readArmedGeneration/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `generator.readArmedGeneration/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `generator.readArmedGeneration/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `generator.readArmedGeneration/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `generator.readArmedGeneration/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `generator.readArmedGeneration/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## generator.submit — Lancer la génération préparée

Envoie le formulaire tel qu’il est affiché. Dépense sur le compte qui sert ce modèle, et l’estimation est annoncée d’abord quand il y en a une.

- Nom MCP : `generator_submit`.
- Engagement déclaré : `credits` ; répétable : `true` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"requires":["preparedGeneration"]}`.
- Batterie existante : 20.1, 20.3, 20.4, 21.1, 21.2, 21.3, 21.4, 22.1, 24.10, 66.1, 66.2, 66.4, 68.8.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `landing` | choice | False | `{"options":["document","newTab"]}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `generator.submit/001` | Nominal minimal : demander « Lancer la génération préparée » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `generator.submit/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `generator.submit/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `generator.submit/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `generator.submit/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `generator.submit/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `generator.submit/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `generator.submit/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `generator.submit/009` | Préparation ou contrainte dynamique manquante : tester chaque branche du callback du handler ; le marqueur runtimeFunction du catalogue ne révèle pas ces branches. |
| `generator.submit/010` | Paramètre landing absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `generator.submit/011` | Paramètre landing avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `generator.submit/012` | Option de landing : "document" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `generator.submit/013` | Option de landing : "newTab" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `generator.submit/014` | Option inconnue de landing : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## jobs.list — Lister les tâches

Rend les générations en cours et leur avancement, tels que le studio les suit. Ne change rien à l’écran.

- Nom MCP : `jobs_list`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 44.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `jobs.list/001` | Nominal minimal : demander « Lister les tâches » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `jobs.list/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `jobs.list/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `jobs.list/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `jobs.list/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `jobs.list/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `jobs.list/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## prompt.suggest — Proposer des variantes de prompt

Réécrit une phrase en plusieurs variantes taillées pour le modèle armé dans le Générateur, avec les réglages qui vont avec. Ne consomme rien et ne change rien à l’écran.

- Nom MCP : `prompt_suggest`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 45.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `draft` | longText | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["draft"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `prompt.suggest/001` | Nominal minimal : demander « Proposer des variantes de prompt » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `prompt.suggest/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `prompt.suggest/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `prompt.suggest/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `prompt.suggest/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `prompt.suggest/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `prompt.suggest/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `prompt.suggest/008` | Paramètre draft absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `prompt.suggest/009` | Paramètre draft avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## prompt.translate — Traduire un prompt en anglais

Porte un texte dans la langue sur laquelle les modèles sont entraînés, et dit quelle langue il a reconnue. Ne consomme rien et ne change rien à l’écran.

- Nom MCP : `prompt_translate`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 45.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `text` | longText | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["text"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `prompt.translate/001` | Nominal minimal : demander « Traduire un prompt en anglais » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `prompt.translate/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `prompt.translate/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `prompt.translate/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `prompt.translate/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `prompt.translate/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `prompt.translate/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `prompt.translate/008` | Paramètre text absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `prompt.translate/009` | Paramètre text avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## prompt.describeStyle — Décrire le style des références

Lit les images de référence posées sur le formulaire du Générateur et en rend une description utilisable comme prompt. Ne consomme rien.

- Nom MCP : `prompt_describeStyle`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 45.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `prompt.describeStyle/001` | Nominal minimal : demander « Décrire le style des références » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `prompt.describeStyle/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `prompt.describeStyle/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `prompt.describeStyle/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `prompt.describeStyle/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `prompt.describeStyle/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `prompt.describeStyle/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## chat.close — Refermer la conversation

Retire la conversation de l’écran pour laisser voir le résultat. À appeler en dernier, et seulement une fois le résultat visible — jamais quand la réponse est les mots eux-mêmes, ni pendant qu’une permission est demandée.

- Nom MCP : `chat_close`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 45.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `chat.close/001` | Nominal minimal : demander « Refermer la conversation » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `chat.close/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `chat.close/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `chat.close/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `chat.close/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `chat.close/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `chat.close/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## actions.find — Chercher des actions

Cherche par mots-clés dans toutes les actions que le studio publie et rend celles qui correspondent, avec leurs champs. Ne change rien à l’écran. C’est aussi ce qui répond à « de quoi es-tu capable au sujet de X » : chercher le mot, puis dire ce qui est revenu.

- Nom MCP : `actions_find`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 45.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `query` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["query"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `actions.find/001` | Nominal minimal : demander « Chercher des actions » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `actions.find/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `actions.find/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `actions.find/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `actions.find/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `actions.find/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `actions.find/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `actions.find/008` | Paramètre query absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `actions.find/009` | Paramètre query avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `actions.find/010` | Texte query : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

# Parcours P001 à P021 — préparation précise

21 fichiers déclaratifs, 178 appels préparés. **Aucune exécution réalisée par cet agent.** Six parcours sans blocage de préparation identifié (P001, P003, P004, P005, P006, P007) ; les 15 autres ont des étapes concrètes mais des prérequis ou oracles complémentaires explicitement bloquants. Aucun n’est approuvé pour l’entraînement.

## Contrat commun

Chaque parcours crée son projet dans le sandbox jetable, sans identifiant de document ou asset fictif. Le contexte `sandbox` et `projectPath` provient du runner ; les réponses MCP sont décodées directement, sans wrapper `data`. Les identités proviennent de `workspace.open`, `layer.add`, `documents.list`, `files.search` ou de fixtures externes explicitement exigées. Une recherche `find` doit être unique. Les chemins à points de `pick` sont utilisés pour les transformations. Les chemins relatifs des observations `$file` se résolvent sous projectPath.

Les parcours à blockers doivent être exclus de l’exécution automatique. `requires` ne vaut pas preuve que le prérequis est présent. Les étapes externes constituent une branche préparée, pas une autorisation de dépense, téléchargement ou publication. Le runner doit refuser de lancer un parcours dont les prérequis ne sont pas résolus.

P003 concrétise le nom générique Démo par Bench Project : la demande précise du fichier l’indique, en accord avec le chemin fourni par le runner. P004/P005 utilisent un vrai document image sauvegardé, pas un fichier créé directement en contournant Studio.

## Lecture des sources

- `fileHandlers.ts` : project.create retourne Project.path ; files.move/copy retournent done/refused, non un simple succès ; project.trash porte un consentement à REFUSER dans P006.
- `stateHandlers.ts` : documents.list retourne le tableau direct ; rename ne remplace pas l’identité ; save retourne written ; document.export dépend du type de document et de son moteur réel.
- `folder.ts`, `fileOp.ts`, `fileInfo.ts` : chemins relatifs, historique undo/redo, FileOutcome.done/from/to, FileFacts.bytes.
- `canvasHandlers.ts`, `canvasLayerHandlers.ts`, `canvasHandlerContext.ts` et `engines/canvas/commands.ts` : canvas.state omet les valeurs par défaut et aplatit les groupes. Le transform lu actuellement ne vérifie pas locked.position ; P020 n’invente pas un succès.
- `imageExportFiles.ts` et `main/export/folder.ts` : export image PNG nommé selon le titre ; export retourne le nom du dossier, pas le chemin du fichier.
- `coreHandlers.ts`, `generatorBridge.ts`, `jobHandlers.ts` : modèles réels, paramètres propres au modèle, jobId retourné par submit ; attendre peut retourner encore running à expiration, pas forcément réussite.
- `assetHandlers.ts`, `cloudHandlers.ts`, domaines asset/job/sync : absence de résultat et prix null légitimes, IDs réels nécessaires et résultats partiels possibles.

Révision HEAD Studio lue : `38c5b2875310a6b218bec77e46de3dd7224f7320`. Révision du catalogue utilisé pour les formes : `2d00310fca48dc8b94b06e384a624fdd21dc7c50`. Le checkout Studio peut évoluer en parallèle ; fraîcheur à revalider avant exécution.

## Vérification locale

Les 178 inputs ont été contrôlés avec Ajv contre les vrais schémas `mcpTools` du catalogue. Les références dynamiques ont reçu uniquement un représentant du type attendu pour ce contrôle : cela vérifie la forme et les champs statiques, **pas** l’existence ou la valeur des ressources à l’exécution. Pas de suite globale ni de lancement VM ici ; l’agent principal assure la porte finale.

## État par parcours

| Parcours | Étapes | État ou manque précis |
| --- | ---: | --- |
| P001 | 11 | Préparé pour essai VM, non exécuté |
| P002 | 4 | Le format actuel ne contient pas de commande de copie de fixture sur disque après création du projet ; injection et oracle de version visuelle requis. file.open image passe par le panneau média, pas un document natif. |
| P003 | 13 | Préparé pour essai VM, non exécuté |
| P004 | 18 | Préparé pour essai VM, non exécuté |
| P005 | 19 | Préparé pour essai VM, non exécuté |
| P006 | 4 | Préparé pour essai VM, non exécuté |
| P007 | 11 | Préparé pour essai VM, non exécuté |
| P008 | 8 | Oracle PNG décodable, dimensions et pixels témoins non exprimable par les quatre assertions actuelles ; le simple fichier présent ne suffit pas. |
| P009 | 5 | Fixture de modèle installée et schéma provider non disponibles dans la VM de référence ; sélectionner et figer ce couple avant exécution. |
| P010 | 8 | Fixture de modèle installée et schéma provider non disponibles dans la VM de référence ; sélectionner et figer ce couple avant exécution.; Cost peut légitimement être null ; rapporter prix indisponible, ne pas fabriquer de montant. Oracle paramètres doit tenir compte des valeurs par défaut déclarées du modèle. |
| P011 | 10 | Fixture de modèle installée et schéma provider non disponibles dans la VM de référence ; sélectionner et figer ce couple avant exécution.; Pas de financement ni compte cloud autorisé ; comparer les médias générés au contrat du modèle avant approbation. Un timeout est un échec de cette borne, pas une preuve d’échec définitif du job. |
| P012 | 9 | Fixture de modèle installée et schéma provider non disponibles dans la VM de référence ; sélectionner et figer ce couple avant exécution.; Course avec fin de génération : branche succès préalable/refus du provider doit être testée séparément ; aucune promesse de remboursement. |
| P013 | 5 | Installation peut être synchrone ou déjà terminée ; le modèle de déclaration actuel ne lance pas deux actions concurrentes. Définir témoin de tâche réel et oracle état du moteur avant de prétendre tester une annulation en cours. |
| P014 | 4 | Injection fixture catalogue cassée et format réponse assets.absent à binder côté service ; ne pas remplacer la ressource manquante par un fichier inventé. |
| P015 | 6 | CaptionImages appelle une API : pas de compte/dépense implicite. Vérifier hash du fichier source et métadonnées témoin via fixture avant approbation. |
| P016 | 4 | Binding compte/IDs/oracle cloud requis. Refuser si conflit ou action hors sélection. Ce sous-parcours prépare push seul ; variante pull exige vrais remoteAssetIds, pas les IDs locaux. |
| P017 | 3 | Fixture publique et structure de page provider à vérifier ; zéro résultat est légitime, pas un succès de pertinence. Aucun ID supposé ni publication automatique. |
| P018 | 8 | L’état du fond est vérifié ; pixels témoins exigent un oracle de rendu indépendant encore absent du DSL. |
| P019 | 8 | canvas.state aplatit les calques sans parentId : appartenance réelle au groupe et ordre nécessitent un lecteur du document sauvegardé .ora (ZIP), non pris en charge par les lecteurs fichier du DSL. |
| P020 | 7 | Lecture actuelle : layer.transform appelle setLayerTransform/patch sans vérifier locked.position. Le test exprime maintien de position voulu mais risque échec réel ; arbitrer contrat Studio et ne pas transformer mutation en réussite. |
| P021 | 13 | Le DSL ne représente pas la question/réponse de clarification. Ces étapes couvrent seulement la branche déjà clarifiée Document A ; ajouter le dialogue avant emploi comme entraînement. |

## Précisions des contextes et capacités

Les prérequis des JSON sont maintenant des identifiants de capacités. Les descriptions suivantes constituent le contexte rédactionnel, pas des capacités que le runner pourrait satisfaire implicitement. P004/P005 mémorisent le SHA-256 initial avec assertion.saveAs et comparent après déplacement, copie, undo et redo. P006 attend needsConsent sans réémettre le jeton : c’est la représentation MCP du refus utilisateur, pas une suppression suivie de restauration. P019 vérifie désormais les identités distinctes, mais son oracle de parentage reste manquant.

### P001
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.

### P002
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- Après project.create, installer deux images synthétiques de bateau distinctes bateau-final.png et bateau-brouillon.png, dans un dossier utilisateur du projet ; conserver hash et dimensions de référence.

### P003
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- Variante précise de P003 : nom Bench Project, document image Témoin. Le nom Démo de la demande générique est remplacé explicitement, pas ignoré.

### P004
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- Fixture locale : un document image natif créé et sauvegardé ; les « références » sont sa copie.

### P005
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.

### P006
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- Le transport doit refuser la demande de consentement project.trash, sans rejouer le jeton ; aucun consentement automatique à la suppression.

### P007
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.

### P008
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- Image exportée en PNG selon imageExportFiles ; le champ format est réservé aux scènes 3D, donc volontairement absent.

### P009
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- fixture.modelId : identifiant réel d’un modèle image installé et prêt, validé contre ai.localState ; fixture.parameters : paramètres exacts acceptés par models.readGenerationModelFields, image source du projet incluse si requise. Aucun téléchargement, compte personnel ou dépense implicite.

### P010
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- fixture.modelId : identifiant réel d’un modèle image installé et prêt, validé contre ai.localState ; fixture.parameters : paramètres exacts acceptés par models.readGenerationModelFields, image source du projet incluse si requise. Aucun téléchargement, compte personnel ou dépense implicite.

### P011
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- fixture.modelId : identifiant réel d’un modèle image installé et prêt, validé contre ai.localState ; fixture.parameters : paramètres exacts acceptés par models.readGenerationModelFields, image source du projet incluse si requise. Aucun téléchargement, compte personnel ou dépense implicite.
- Compte sandbox et autorisation de consommation explicite si provider distant ; fixture doit produire un résultat dans 110 secondes.

### P012
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- fixture.modelId : identifiant réel d’un modèle image installé et prêt, validé contre ai.localState ; fixture.parameters : paramètres exacts acceptés par models.readGenerationModelFields, image source du projet incluse si requise. Aucun téléchargement, compte personnel ou dépense implicite.
- Provider de test annulable, génération suffisamment longue pour annulation ; frais éventuellement engagés assumés explicitement.

### P013
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- Runtime motion absent au départ ; installation réseau explicitement autorisée et artefacts temporaires exclusivement VM.

### P014
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- Après création du projet, fixture catalogue contenant Média absent avec référence fichier supprimé et un asset témoin présent ; IDs issus du vrai import.

### P015
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- Fixture image de bateau bleu réellement importée, compte de captioning de test autorisé, asset témoin non sélectionné.

### P016
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- Compte cloud sandbox exclusivement, assets locaux importés et sélection explicitement autorisée fixture.selectedAssetIds ; témoin non sélectionné.

### P017
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- fixture.publishedAssetId : média public réel fourni par compte de test ; réseau autorisé.

### P018
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.

### P019
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.

### P020
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.

### P021
- VM isolée : sandbox vide, projet inexistant et aucune opération parallèle ; consentements limités aux actions de ce parcours.
- La clarification choisit Document A avant activateA ; ne pas déduire ce choix de l’ordre des documents.

## Bindings externes

Seuls P009, P010, P011, P012, P016 et P017 déclarent `requiredBindings: ["fixture"]`. Contenu requis : P009 modelId ; P010–P012 modelId et parameters ; P016 selectedAssetIds ; P017 publishedAssetId. Ces valeurs sont des ressources réelles fournies par le préparateur, jamais des IDs factices. Les autres fixtures (bateau, média absent, image à décrire) sont des préconditions de données sur disque/catalogue puis leurs IDs sont lus par MCP. Les 21 plans ont été vérifiés pour références déclarées avant utilisation.

## Audit des oracles après le faux succès P003

Le rapport VM de P003 conservé dans artifacts/vm/studio-ft-e4e35a81-a80f-4935-8478-96ddfeb5b233/results/scenario.json déclarait passed alors que document.open retournait le chemin comme identité et canvas.state exposait de nouveau le canevas par défaut 1024×1024 avec Background. Le journal consignait une erreur document:read. Le rapport historique n’a pas été modifié.

P003 crée désormais avant sauvegarde un canevas 640×360 et un calque texte nommé P003 témoin persistant, avec contenu fixe et identité produite réellement. Ces caractéristiques sont vérifiées avant sauvegarde, avant fermeture et après réouverture ; le document rouvert doit conserver l’identité initiale. Une retombée sur le canevas par défaut échoue donc aux assertions, même si une comparaison globale avant/après semblerait égale.

Relecture des 21 parcours : P007 a aussi reçu des dimensions distinctives et vérifications explicites du texte avant/après, en plus de l’identité. P001/P004/P005 utilisent maintenant un vrai témoin non vide avant sauvegarde. P004/P005 créent l’image dans Entrée pour que son déplacement vers Images ne soit pas un déplacement vers son propre dossier (le chemin par défaut observé était Images/Témoin.ora). P006 vérifie explicitement le projet présent avant refus. P008/P018/P020/P021 contrôlent la présence/identité du témoin avant l’opération. P019 possède déjà des noms/textes explicites et reste bloqué sur le parentage. P010 compare la liste de jobs avant/après pour vérifier une absence de soumission, pas une persistance ; état vide permis intentionnellement. Les autres parcours externes restent bloqués : aucune égalité de défaut n’est présentée comme preuve de bon fonctionnement.

Aucun de ces renforcements n’est une recette VM ; rejouer les versions corrigées et examiner les erreurs de chargement avant toute approbation.

Vérification de non-régression ciblée : le moteur resolveValue appliqué aux observations historiques rejette désormais document.open (1 assertion) et le canevas par défaut après réouverture (5 assertions). Les 21 plans passent parseScenario et leurs 178 inputs le contrôle de forme MCP avec références typées. Ce contrôle ne remplace pas la prochaine exécution VM.

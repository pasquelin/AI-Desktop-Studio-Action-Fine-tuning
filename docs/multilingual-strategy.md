# Stratégie multilingue du compagnon Studio

Statut : stratégie préparée le 9 septembre 2026. Ce document définit le travail et ses critères ; il ne certifie ni les traductions ni leur exécution. Le registre associé couvre les 310 actions inventoriées. Les 5 165 cas existants ont été recomptés dans les documents, ainsi que leur rattachement aux actions.

## 1. Ce qui sera couvert

Les quinze langues sont celles du catalogue Studio : français (`fr`), anglais (`en`), arabe (`ar`), allemand (`de`), espagnol (`es`), hindi (`hi`), indonésien (`id`), italien (`it`), japonais (`ja`), coréen (`ko`), portugais (`pt`), russe (`ru`), turc (`tr`), vietnamien (`vi`), chinois (`zh`). Ces codes ne garantissent pas la couverture de tous les dialectes et variantes régionales ; consigner la locale réelle de chaque rédaction lorsqu’elle est connue.

Pour chaque action accessible à un utilisateur, prévoir au minimum une intention positive pertinente dans chaque langue, puis les formulations et erreurs linguistiques applicables. Le registre `multilingual-coverage.csv` réserve ces quinze couvertures pour chaque action, avec le nombre de cas de conception et un lien vers la source.

Ne pas transformer automatiquement 5 165 × 15 en « 77 475 tests validés ». Classer d’abord chaque cas :

- **Conversation** : demande, contexte, paramètres, clarification ou refus. Traduction et reformulations nécessaires.
- **Contrat technique** : type JSON invalide, champ inconnu, valeur hors domaine. Test du schéma ou du handler ; pas quinze traductions identiques de son code.
- **Intégration** : chargement, disque, panne, consentement, annulation. Fixture technique commune ; variantes de demandes et de réponses uniquement là où la langue intervient.
- **Parcours composé** : plusieurs actions dépendantes. Évaluer la conversation et les effets du parcours, avec les résultats intermédiaires réels.

Les 63 parcours composés et les 481 demandes de la batterie Studio sont des sources à relier aux cas canoniques, pas des éléments à compter automatiquement comme distincts. Dédupliquer avant production des données.

## 2. Un contrat commun, plusieurs formulations

Un cas canonique possède un identifiant stable et un groupe sémantique, une révision de source, les outils concernés, une fixture, les préconditions, l’intention, les effets permis/interdits, un oracle et un résultat attendu. L’attendu peut être une action, une clarification, un refus ou une erreur expliquée.

Chaque variante linguistique possède :

- langue et locale, formulation, registre de langue et phénomènes testés ;
- lien vers le cas canonique et son groupe sémantique ;
- contexte présenté au modèle, cible résoluble et informations volontairement manquantes ;
- paramètres attendus et valeurs à préserver, ou éléments nécessaires à une clarification ;
- provenance de rédaction, relecteur ou méthode de revue, statut, empreinte et date ;
- liens vers les exécutions et verdicts lorsqu’elles existent.

Les noms d’outils, clés JSON, identifiants, chemins et noms explicitement demandés restent inchangés. On traduit la consigne, pas `nodeId` ni le nom d’un fichier. Les transformations de nombres et d’unités se font selon le contrat métier, jamais selon une simple substitution de texte.

La langue de la demande, celle de l’interface et celle des noms d’objets sont indépendantes. Garder le même état canonique pour comparer les langues ; prévoir ensuite des cas où l’interface et la demande diffèrent.

## 3. Variantes à rédiger

Pour les intentions courantes, prévoir une formulation directe, une paraphrase naturelle et une demande courte contextualisée. Ne pas forcer trois variantes artificielles sur un cas qui n’en bénéficie pas.

Ajouter selon le risque : négation, restriction de portée, correction d’une demande précédente, ambiguïté de cible, noms homonymes, noms multilingues, dictée, accents omis, faute de frappe, chiffres écrits ou dictés, virgule décimale, unités, pluriel, référence à la sélection et mélange de langues.

Priorités spécifiques :

- Arabe : ordre du texte mixte droite/gauche, nombres et chemins conservés.
- Hindi : vocabulaire géométrique naturel, chiffres et écriture mixte.
- Chinois, japonais, coréen : segmentation, particules et noms latins au milieu d’une demande.
- Turc : suffixes appliqués aux noms et conservation du dossier explicitement demandé.
- Langues latines/cyrilliques : flexions, accents, noms propres et conventions décimales.

Ces axes sont des hypothèses de couverture, pas un diagnostic global de faiblesse de chaque langue. Les deux erreurs du premier essai (destination omise en turc, mauvaise primitive en hindi) restent des exemples de régression connus.

## 4. Production et relecture

1. Rendre le cas canonique précis et vérifier son contrat réel dans Studio.
2. Rédiger la consigne dans chaque langue sans donner la réponse attendue au modèle évalué.
3. Contrôler automatiquement les noms, chemins, nombres, unités et placeholders à préserver.
4. Faire une revue sémantique distincte de la génération. Une rétrotraduction est un signal utile, pas une preuve suffisante.
5. Faire relire les cas sensibles et les ambiguïtés par un locuteur compétent. Une revue par un autre modèle reste identifiée comme revue automatique.
6. Exécuter les propositions puis, lorsque possible, le scénario dans la VM ; conserver les échecs et leur cause.
7. Promouvoir uniquement les exemples ayant passé les contrôles requis. Ne jamais accepter une paire demande/action parce qu’un générateur affirme qu’elle est correcte.

Statuts séparés : `planned`, `draft`, `language-reviewed`, `contract-verified`, `execution-passed`, `training-approved`. Un cas peut être linguistiquement correct et échouer à l’exécution. Une traduction ne devient pas validée parce que son cas français l’est.

## 5. Séparer apprentissage et évaluation

Former les groupes avant de traduire : toutes les paraphrases et traductions d’une même intention/fixture restent ensemble. Un même exemple français dans l’entraînement et allemand dans le test constituerait une fuite.

Répartition initiale proposée : 70 % entraînement, 15 % développement, 15 % test final, par groupe sémantique stable. Ajuster pour les familles rares ; publier les effectifs réels et ne pas présenter une famille absente du test comme évaluée. Chaque action peut apparaître dans plusieurs ensembles à travers des situations réellement différentes.

Les 34 demandes déjà utilisées sont des cas de développement désormais connus. On peut les conserver pour la régression, mais elles ne constituent plus un test final inédit. Préparer une réserve nouvelle avec d’autres formulations, états, noms et valeurs ; changer uniquement un nom ne suffit pas toujours à créer une indépendance sémantique.

Un changement de répartition doit être versionné. Aucun cas de test final ne doit entrer dans un entraînement ultérieur sans retirer ce test de la mesure indépendante et renouveler la réserve.

## 6. Mesures et critères

Rapporter par langue et par famille : choix de l’outil, validité du schéma, correction sémantique des paramètres, respect des noms/chemins, clarification justifiée, refus justifié, absence d’action supplémentaire, succès métier et persistance. Séparer les erreurs du modèle, de traduction, du scénario, de Studio et de l’environnement.

Mesurer aussi les temps de chargement et d’inférence séparément, la mémoire et les délais d’exécution. Fixer modèle, empreinte, quantification, moteur, contexte, descriptions d’outils et conditions matérielles pour toute comparaison avant/après.

Objectifs de passage proposés, à distinguer de résultats acquis : aucune mutation hors périmètre ni consentement inventé observé ; 100 % des sorties exécutées validées par le contrat ; progression ou absence de régression par langue sur le test indépendant. Une sortie invalide compte comme un échec même si elle est bloquée avant exécution. Le score global ne doit pas masquer une langue défaillante.

Ne pas promettre 100 % de fiabilité sur les demandes futures. Publier les tailles d’échantillon, les taux et, lorsque les effectifs le permettent, leur incertitude. Ne pas fixer un seuil commercial crédible à partir de seulement deux demandes par langue.

## 7. Déploiement du travail par lots

**Lot A — fondation du corpus** : classifier les cas existants, figer les identifiants/groupes, définir le format machine et les statuts, rattacher les 481 demandes et 63 parcours sans doubles comptes. Le registre livré aujourd’hui est le point de départ, pas le corpus rédigé.

**Lot B — parcours prioritaire** : projet, scène, cube, renommage, déplacement, sauvegarde et réouverture, puis gestion des récents et suppression. Produire les quinze langues, paraphrases et ambiguïtés de ce parcours ; vérifier les traductions et les effets réels après correction Studio.

**Lot C — extension** : traiter les autres familles du registre. Commencer par les actions fréquentes, puis celles à effet disque/compte/réseau et les actions plus spécialisées. Réutiliser les fixtures et contrôles techniques. Éviter le produit cartésien complet des axes ; couvrir les paires pertinentes et les combinaisons critiques explicitement.

**Lot D — entraînement pilote** : apprendre sur le sous-ensemble approuvé, comparer à la base, analyser les erreurs par langue et rejouer les scénarios intégrés. Étendre seulement après mesure des gains et régressions.

## 8. Changements de Studio et entretien

Le contrôle de fraîcheur existant avertit déjà quand la source Studio a évolué. Régénérer le catalogue ne valide ni les traductions ni les scénarios.

Le futur contrôle du corpus devra comparer : ensemble de langues, noms d’actions, paramètres et contraintes, descriptions utiles et comportement couvert. Une action ajoutée crée des entrées `planned` dans toutes les langues ; une langue ajoutée crée la colonne correspondante ; une modification invalide les validations concernées. Les entrées supprimées restent traçables comme retirées, sans être utilisées pour entraîner la version actuelle.

Les changements de comportement sans changement de schéma nécessitent des tests de contrat et une revue : une comparaison de signatures seule ne suffit pas. Les empreintes relient chaque corpus, entraînement et rapport à leurs références.

Le registre CSV livré ici est un état de planification, pas un mécanisme de synchronisation automatique. La comparaison automatique détaillée du corpus et la gestion de ses statuts restent à implémenter dans le lot A. La stratégie évite de redécider l’organisation ; elle ne supprime pas l’entretien nécessaire lorsque Studio évolue.

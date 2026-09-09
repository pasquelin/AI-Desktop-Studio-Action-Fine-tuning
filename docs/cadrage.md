> Cadrage initial conservé comme référence historique. Pour le statut et les choix actuels, lire [les décisions](decisions.md) et [les étapes](roadmap.md). Les mentions « aucun développement » décrivent la rédaction initiale.

# Cadrage : assistant spécialisé entièrement local

## Décision recommandée

Le projet est techniquement plausible. Il vaut la peine de vérifier une petite chaîne complète : vrais contrats → démonstrations exécutées → modèle local → état final contrôlé → export utilisable. Le risque principal est d’entraîner un modèle sur des échanges différents de ceux de l’application, ou de découvrir trop tard que ses poids ne se chargent pas dans le moteur distribué.

Commencer par Qwen3-4B-Instruct-2507 avant/après LoRA, avec Qwen2.5 7B comme comparateur facultatif déjà référencé par l’application. Ne pas ouvrir une compétition de nombreux modèles. Qwen3.5-4B reste une alternative non étudiée, à réexaminer seulement en cas de limite précise.

## Produit et hors périmètre

L’utilisateur demande en français une opération sur ses documents. L’assistant découvre les cibles, choisit des actions, traite leurs résultats, pose les questions nécessaires et vérifie les effets. Le développeur entraîne le modèle ; l’utilisateur reçoit des poids déjà spécialisés.

L’inférence finale et les actions retenues fonctionnent sur la même machine, sans Internet, réseau local ni fournisseur externe. Le pilote vise un appel interne au moteur, sans serveur HTTP, même sur localhost. Les échanges Electron internes restent possibles. MCP expose les actions à des clients ; il n’est pas requis pour l’assistant intégré.

Sont exclus : fonctions cloud, publication, dépenses, téléchargement à chaque lancement, entraînement chez l’utilisateur, pilotage par vision de l’écran, nouvel assistant graphique, certification de toutes les actions ou plateformes. L’apprentissage ne rend pas locale une génération dépendant d’un service distant. Le provisionnement initial des logiciels et modèles est distinct de leur utilisation hors ligne.

## Faits vérifiés dans le checkout

Application lue à `/Users/pasquelin/Applications/AI Desktop Studio`, révision `962daa7f75f68cc68b0624e0cf608fdd1676eb27`, sans changements signalés par Git lors de la lecture. Compagnon initial : `462f8c26ef34f5729c793e872969018756979ce5`, seulement un README. Aucun `RTK.md` trouvé dans le compagnon ; la référence transmise ne fournit donc pas de contenu supplémentaire applicable. Un brouillon de l’ancien worktree 6e73 a été consulté, puis ses constats utiles recontrôlés. Aucun document trouvé sous `docs/` dans a094.

| Composant existant | Constat et conséquence |
| --- | --- |
| Registre partagé | 310 noms dans l’union statique `ActionName`. Le nombre publié et la réussite effective ne s’en déduisent pas. Exporter le registre exécuté et ses champs |
| Surface MCP | Schémas dérivés des champs, noms transformés et consentement propre à cette surface. Ne pas employer son enveloppe comme contrat d’apprentissage local |
| `createLocalBrain` | Fonction `chat` injectable ; construit les messages et demande `json: true`. La capture doit se faire exactement à cette frontière |
| Conversation locale | Système, historique rendu en messages `user`, demande actuelle en dernier `user`. Un corpus natif `assistant/tool` improvisé serait infidèle |
| Réponse | `say`, `ask`, `calls`, appels `{action,input}`. JSON récupérable dans de la prose ; contrôler aussi le JSON strict |
| Questions | Une question reconnue supprime les appels. Les appels sont toutefois analysés avant la question : une action inconnue peut invalider la réponse entière |
| Validation | `readReply` contrôle la réponse et les noms ; `readInput` contrôle les paramètres. La présence réelle de la cible reste une vérification d’exécution |
| Manuels et reprises | `answeredTurn` peut ouvrir des manuels ou réessayer. Chaque invocation du modèle compte dans la trace, même sans action exécutée |
| Fenêtre | Plafond assistant 8 192 tokens ; préparation du prompt par estimation de caractères. Contrôler la longueur réellement tokenisée |
| Inférence | `electronLlamaPort` charge les poids locaux via node-llama-cpp ; température 0 par défaut, grammaire JSON générique. Elle ne valide pas le métier |
| Version cible | Verrouillage node-llama-cpp 3.20.0. Une réussite sur un llama.cpp récent seul ne prouve pas celle du binaire embarqué |
| Modèles | Qwen2.5 Instruct 0.5B, 1.5B, 7B et 14B figurent au catalogue. Leur présence au catalogue ne prouve pas leur installation |

Les [sources](sources.md) identifient les fichiers et fonctions à relire en cas de changement.

## Quel banc réutiliser ?

`play` utilise `useAssistant.say`, également appelé par la conversation graphique examinée. `playMission` conduit le runtime de missions avec des traces et un contexte différents. **Le premier jalon utilise `play`**. Garder un champ `executionPath` dans les données ; les résultats `legacy` et `mission` ne doivent pas être amalgamés. Une migration vers les missions serait une décision produit séparée.

Les points d’entrée modèle examinés construisent un cerveau HTTP externe : ne pas les lancer tels quels. Le banc réutilise stores et handlers réels mais simule des ports, fichiers, workers et surfaces. Il ne prouve ni le rendu complet ni l’exécution dans Electron réel.

La trace `Called.answer` de `play` résume notamment les tableaux en nombre de résultats. Les traces de missions sont plus riches mais la note `sent` du cerveau provient du briefing, pas de la liste exacte des messages locaux. Aucun dossier `logs/mission-runtime` n’était présent. Les formats ont été lus dans le code ; aucun corpus existant n’a été qualifié pour l’entraînement.

## Choix et inconnues

La fiche officielle présente [Qwen3-4B-Instruct-2507](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507) comme un modèle textuel 4B sans blocs de raisonnement séparés, sous Apache-2.0. MLX-LM offre LoRA sur Apple Silicon ; préférer une base non quantifiée pour la première preuve de fusion. Son [export GGUF direct](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/fuse.py) n’accepte pas `qwen3` dans le code consulté. Étudier les poids fusionnés compatibles Hugging Face, puis leur conversion par llama.cpp.

Le modèle de départ contient les capacités générales. L’adaptateur LoRA contient les ajustements appris et dépend de cette base exacte. Le livrable final envisagé est une fusion convertie et quantifiée en GGUF, avec manifeste et notices ; l’adaptateur MLX seul n’est pas un fichier distribuable pour le moteur actuel.

Inconnues : fusion réellement convertible, tokenizer et modèle de conversation conservés, comportement de la grammaire, gain en français, nombre de démonstrations utile, mémoire et latence, effet de la quantification, fidélité du banc à l’application. La configuration M2 Max/96 Go est celle signalée dans la demande ; sa relecture système a été refusée par l’environnement. Aucune mesure matérielle ou d’apprentissage nouvelle n’est revendiquée.

Le prompt actuel nomme tout le catalogue et contient une règle encourageant à ne jamais déclarer une incapacité. Le pilote doit mesurer les demandes hors périmètre malgré cette tension. Une liste autorisée dans le banc protège l’exécution mais ne prouve pas que le modèle sait respecter sa limite. Réduire les manuels initiaux n’équivaut pas à réduire les actions annoncées.

## Accord demandé

Autoriser le **lot 1A : extraction fidèle, validation et rejeu de 12 parcours**, dans le compagnon uniquement, sans téléchargement ni entraînement. Son résultat permettra de décider le raccordement local 1B et la preuve d’export 1C. Les règles de consentement et validateurs de l’application restent souverains. Aucun développement n’est engagé par ce document.

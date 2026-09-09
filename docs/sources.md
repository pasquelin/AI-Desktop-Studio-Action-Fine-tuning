> Cadrage initial conservé comme référence historique. Pour le statut et les choix actuels, lire [les décisions](decisions.md) et [les étapes](roadmap.md). Les mentions « aucun développement » décrivent la rédaction initiale.

# Sources et limites de vérification

Lecture du 9 septembre 2026. Code de l’application à `/Users/pasquelin/Applications/AI Desktop Studio`, HEAD `962daa7f75f68cc68b0624e0cf608fdd1676eb27`. Les chemins ci-dessous sont relatifs à cette racine. Le statut Git était propre à la lecture. Aucune dépendance installée, aucun modèle téléchargé, aucun entraînement ni test d’exécution du produit lancé pendant le cadrage.

## Contrats de l’application

| Fichier / repère | Preuve utilisée |
| --- | --- |
| `AGENTS.md` | Modifications futures dans un worktree dédié ; règles et validation du dépôt source |
| `src/shared/domain/assistantActionNames.ts` | 310 lignes de membres d’union comptées statiquement |
| `src/shared/domain/assistant.ts` — `ACTION_FAMILIES`, registre | Familles assemblées et capacités héritées |
| `src/shared/domain/assistantAction.ts` — `readInput` | Validation/normalisation des champs et engagement des actions |
| `src/main/mcp/tools.ts` — `schemaOfFields`, `mcpTools` | Schémas dérivés ; distinction noms internes/MCP et consentement |
| `src/main/assistant/brainLocal.ts` — `messagesFor`, `createLocalBrain` | Système + historique user + demande user, `chat` injectable, JSON demandé |
| `src/main/assistant/instructionCatalogue.ts` — `FORMAT`, `RULES`, `WIDE_RULES` | Enveloppe JSON, lecture des identifiants, arithmétique relative, tension hors périmètre |
| `src/main/assistant/reply.ts` — `jsonIn`, `readReply` | Récupération de JSON, noms connus, question sans appels, ordre réel de validation |
| `src/main/assistant/brainTurn.ts` — `answeredTurn`, notes `sent` | Reprises et manuels ; trace briefing différente de la requête chat complète |
| `src/main/assistant/promptWindow.ts` — `ASSISTANT_WINDOW_MAX` | 8 192 tokens maximum pour l’assistant |
| `src/main/ai/llamaRuntime.ts`, `electronLlamaPort.ts` | Interface du port, chargement local, session, contexte libéré, température et grammaire |
| `pnpm-lock.yaml` — `node-llama-cpp` | Version résolue 3.20.0 ; aucun numéro de build llama.cpp précis n’en a été déduit |
| `src/shared/domain/localModels.json` | Qwen2.5 Instruct en plusieurs tailles dont 7B |
| `src/shared/domain/stateActions.ts`, `coreActions.ts` | Actions documents, découverte et champs |
| `src/shared/domain/sceneNodeActions.ts` | Cube nommé `box`, `nodeId`, transformations et visibilité |
| `src/shared/domain/canvasActions.ts` | Actions calques et bornes d’opacité 0–1 |
| `src/renderer/src/features/assistant/executor.ts` | `readInput` appliqué avant exécution |
| `src/renderer/src/features/assistant/sceneNodeBasicHandlers.ts` | Renommage et calcul des transformations |
| `src/renderer/src/features/assistant/sceneHandlers01.test.ts` | Résultat d’ajout avec `data.nodeId`, cible absente refusée ; tests lus, non exécutés |
| `src/renderer/src/features/assistant/components/Assistant/Conversation/AssistantConversation.tsx` | Appels à `useAssistant.say` dans la conversation |

## Banc

| Fichier | Conclusion |
| --- | --- |
| `scripts/banc/run.ts` | Décor `setup`, demandes `said`, confirmations `answers`, questions `replies` propres au banc mission, oracle `passed` |
| `scripts/banc/play.ts` | Boucle legacy réelle ; résumés de résultats, pas corpus complet |
| `scripts/banc/playMission.ts` et tests associés | Runtime mission, capture plus riche et parcours de questions distinct |
| `scripts/banc/missionTrace.ts` | Champs de trace : tentatives, contexte, résultats, réponse analysée ; aucun tableau de messages chat exact dans `ProviderAttempt` |
| `scripts/banc/studio.ts` | Assemblage de stores/handlers avec ports et surfaces de banc |
| `scripts/banc/scenariosScene.ts` | Ajouts, transformations, positions relatives et vérifications existantes |
| `scripts/banc/scenarios.ts`, `coverage.ts` | Base de scénarios et correspondance déclarative ; couverture ne signifie pas réussite |
| `scripts/banc/assistant.banc.ts` | Entrée historique utilisant `createHttpChatBrain` ; ne pas lancer pour une preuve hors ligne |
| `scripts/banc/assistantMission.mission-banc.ts` | Entrée mission également fondée sur `createHttpChatBrain` |

Le dossier `logs/mission-runtime` n’existait pas dans le checkout examiné. Aucun inventaire exhaustif des anciennes traces privées n’a été effectué ; aucune trace n’a été certifiée prête à entraîner. Le raccordement proposé sera validé par capture directe et rejeu.

## Sources officielles des modèles et outils

| Source | Ce qui est vérifié / ce qui reste à prouver |
| --- | --- |
| [Qwen3-4B-Instruct-2507](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507) | 4B, textuel, non-thinking, licence Apache-2.0 ; aucune performance locale déduite des benchmarks publiés |
| [Configuration Qwen](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507/blob/main/config.json) | `Qwen3ForCausalLM`, `model_type: qwen3`, poids bfloat16, embeddings liés ; `transformers_version: 4.51.0` est une métadonnée du fichier, pas le verrou proposé de l’environnement |
| [Version MLX-LM v0.31.3](https://github.com/ml-explore/mlx-lm/releases/tag/v0.31.3) | Version retournée par la page officielle latest consultée ; candidate, à revalider à l’installation |
| [Implémentation Qwen3 dans cette version](https://github.com/ml-explore/mlx-lm/blob/v0.31.3/mlx_lm/models/qwen3.py) | Architecture disponible dans le code ; compatibilité du checkpoint précis non exécutée |
| [MLX-LM LoRA](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md) | Adaptation, données chat et masquage ; ne prouve pas le choix des modules LoRA du pilote |
| [Fusion MLX-LM](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/fuse.py) | Sauvegarde fusionnée et option de déquantification ; export GGUF direct limité à llama/mixtral/mistral dans le code consulté |
| [Convertisseur Qwen de llama.cpp](https://github.com/ggml-org/llama.cpp/blob/master/conversion/qwen.py) | Enregistrement de `Qwen3ForCausalLM` ; preuve de conversion des poids MLX fusionnés encore nécessaire |
| [Documentation Qwen de conversion](https://qwen.readthedocs.io/en/stable/quantization/llama.cpp.html) | Chemin HF → GGUF ; vérifier nom du script et options à la révision verrouillée |
| [Modèles de conversation node-llama-cpp](https://node-llama-cpp.withcat.ai/guide/chat-wrapper) | Mécanisme de wrapper ; celui effectivement retenu doit être contrôlé dans la version embarquée |
| [Licence MLX-LM](https://github.com/ml-explore/mlx-lm/blob/main/LICENSE), [licence llama.cpp](https://github.com/ggml-org/llama.cpp/blob/master/LICENSE) | MIT dans les fichiers officiels consultés |

Les pages sur branches `main`/`master` ne constituent pas des versions reproductibles : leur rôle est de vérifier la plausibilité. Le lot de provisionnement doit enregistrer SHA exact, versions et hashes des artefacts. Le couple MLX-LM/MLX/Python et la révision de conversion ne sont pas résolus aujourd’hui. La compatibilité complète avec node-llama-cpp 3.20.0 est une inconnue du pilote.

La référence fournie [PEFT v0.20.0 LoRA](https://huggingface.co/docs/peft/v0.20.0/package_reference/lora) a retourné une erreur lors de l’ouverture ; aucune recette versionnée n’en a été déduite. [TRL SFTTrainer](https://huggingface.co/docs/trl/sft_trainer) reste une piste NVIDIA non étudiée, non nécessaire au pilote Mac.

La CLI GitHub a été essayée conformément au skill `gh-cli`, puis les pages officielles ont été consultées via le navigateur de recherche après échec de connexion depuis le terminal. Les informations de version web ne sont pas présentées comme un environnement installé.

## Vérifications encore nécessaires

Import externe du banc sans effets de bord ; catalogue exécuté ; références complètes de résultats ; mémoire matérielle ; poids disponibles ; tokenizer/template effectifs ; apprentissage ; fusion et quantification ; mesures de qualité et de temps ; démonstration Electron entièrement hors réseau. Ces vérifications sont planifiées, pas réalisées.

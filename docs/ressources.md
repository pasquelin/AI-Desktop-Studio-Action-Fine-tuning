> Cadrage initial conservé comme référence historique. Pour le statut et les choix actuels, lire [les décisions](decisions.md) et [les étapes](roadmap.md). Les mentions « aucun développement » décrivent la rédaction initiale.

# Effort et ressources

Estimations de planification pour une personne connaissant TypeScript et Python, pas des temps mesurés. Hypothèse : Mac M2 Max avec 96 Go tel qu’indiqué dans la demande, disponibilité suffisante et absence de blocage majeur du runtime.

| Travail | Charge humaine estimée | Résultat |
| --- | --- | --- |
| 1A : catalogue, capture, 12 rejeux | 2–3 jours | Contrats fidèles et erreurs détectables |
| 1B : raccordement local et baseline | 1–2 jours | Premiers résultats réellement locaux |
| 1C : micro-adaptation, fusion/export | 1–2 jours | Chaîne distribuable éprouvée techniquement |
| Corpus de 500–1 500 parcours | 4–8 jours | Génération, diversification et revue ; prévoir davantage si les corrections manuelles dominent |
| Outillage d’entraînement, comparaison | 2–3 jours | Configurations, sélection sur validation, rapport |
| Contrôle Electron, paquet et retour arrière | 2–4 jours | Proposition d’intégration testée |
| Marge de correction | 2–4 jours | Incompatibilités, oracles insuffisants, données |

Total indicatif : **14–26 jours-personne**, soit environ trois à cinq semaines de travail à plein temps, hors attente des décisions et temps de calcul non supervisé. Une à deux semaines peut suffire aux premières preuves ; ce n’est pas une estimation crédible garantie du pilote complet qualifié. Le premier budget à engager reste 2–3 jours pour 1A.

## Mémoire et disque

Pour 4 milliards de paramètres, les seuls poids à 16 bits représentent environ 8 Go décimaux ; à 4 bits, environ 2 Go avant métadonnées et blocs non quantifiés. Ce calcul ne prédit ni la taille exacte GGUF ni la mémoire d’exécution. En LoRA, les poids de base, activations, gradients d’adaptateur, optimiseur et buffers coexistent. En inférence, ajouter cache de contexte et mémoire de l’application.

Prévoir à titre de réserve **40–80 Go de disque libre** pour base, copies MLX/fusion, GGUF non quantifié et quantifié, environnements, logs et checkpoints limités. Ce n’est pas le poids du téléchargement final. Avant toute acquisition, inventorier les fichiers précis, taille annoncée, cache déjà présent et espace temporaire ; chiffrer séparément le comparateur 7B s’il est retenu.

Les 96 Go annoncés rendent le pilote plausible, sans garantir une longue séquence avec tous les réglages. Mesurer pic de mémoire et pression système sur batch 1 avant toute augmentation. Suspendre si swap durable, pression mémoire forte ou marge système insuffisante. Garder un seul modèle en mémoire lors des comparaisons. La mémoire nécessaire sur une machine utilisateur doit être mesurée séparément.

## Calcul : mesurer avant de promettre

Premier essai proposé : 20 étapes sur quelques parcours, dont 5 d’échauffement, puis relever secondes/étape, tokens traités, pic mémoire et coût des sauvegardes. Ce micro-essai prouve le fonctionnement du calcul et de l’export ; sa qualité n’est pas évaluée comme celle du modèle final.

Estimer ensuite : durée ≈ nombre d’étapes × médiane des secondes/étape + validations + checkpoints + conversion + évaluation. Rééchantillonner sur des longueurs représentatives : un essai sur 500 tokens ne prédit pas le coût à 8 192 tokens. Donner une fourchette basée sur les mesures, jamais une durée d’entraînement inventée.

La préparation des données peut dépasser le calcul en effort humain. La génération scriptée garantit surtout la reproductibilité ; chaque famille doit avoir des trajectoires et oracles revus. Un enseignant externe est facultatif et soumis à accord avant tout envoi ; aucun budget API n’est nécessaire au plan recommandé. Un enseignant local demande aussi un budget de calcul distinct.

## Dépendances

TypeScript/Vitest et alias compatibles avec le checkout pour le banc ; node-llama-cpp **3.20.0** comme référence cible. Python, MLX-LM et conversion llama.cpp dans des environnements développeur séparés. MLX-LM **v0.31.3** a été identifié par la [page de version officielle consultée](https://github.com/ml-explore/mlx-lm/releases/tag/v0.31.3) ; il s’agit d’un candidat à verrouiller, pas d’une installation vérifiée. L’API GitHub n’a pas été accessible depuis le terminal : la lecture web peut refléter un index récent mais pas une résolution locale des dépendances.

Pas de CUDA requis sur le Mac. PEFT/TRL et NVIDIA restent une voie alternative si MLX échoue ; ne pas installer ces piles en plus par défaut. Les versions exactes Python/MLX/convertisseur seront résolues et inscrites dans un verrou après autorisation, avec un essai reproductible. Un tag courant de llama.cpp n’est pas automatiquement le binaire inclus dans node-llama-cpp.

Licences identifiées : Qwen3 sous Apache-2.0, MLX-LM et llama.cpp sous MIT, selon les [références officielles](sources.md). Prévoir attribution, conservation des licences/notices applicables et indication des modifications dans le paquet ; vérifier aussi les droits des données et les dépendances du paquet réellement construit avant diffusion. Aucun paquet n’est diffusé à cette étape.

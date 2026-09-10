# Installation LoRA locale

Le moteur est installé dans `.venv` : MLX-LM 0.31.3, MLX 0.32.2 et Python 3.12. Les dépendances exactes sont conservées dans `requirements.lock`. Il s'agit d'un environnement indépendant de Studio et d'Ollama.

Pour reconstruire cet environnement depuis la racine :

```sh
uv venv --python 3.12 .venv
uv pip sync --python .venv/bin/python training/requirements.lock
```

`configs/lora.yaml` prépare une adaptation LoRA textuelle de Qwen3.5-2B. Cette configuration de premier essai n'est pas un réglage optimal mesuré. Le modèle Ollama ne sert pas directement à cet entraînement : les poids compatibles doivent encore être chargés et leur compatibilité vérifiée. L'installation du logiciel seule ne le démontre pas.

L'entraînement est désactivé dans la configuration. Aucun fichier `train.jsonl`, `valid.jsonl` ou `test.jsonl` approuvé n'est encore produit. Ne pas substituer les brouillons de scénario à ces fichiers. Les futures données doivent contenir des échanges et appels d'outils exacts, reliés à des preuves d'exécution, à leur révision Studio et à une revue de traduction. Ni secrets ni jetons de consentement de session ne doivent entrer dans les données.

Le plan `artifacts/dataset/split-plan.json` garde toutes les traductions et variantes d'une action dans la même partition (70/15/15 approximatifs, déterministes). C'est un choix conservateur qui évalue aussi la généralisation à des actions non entraînées. Les parcours mêlant plusieurs actions restent à attribuer après examen des recouvrements ; les 34 demandes déjà mesurées ne sont pas un test inédit.

Référence : https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md

## Lanceur avec contrôle des preuves

Le lanceur réutilise exactement les contrôles de `export-approved` : sources actuelles,
relecture sémantique, conversations liées aux rapports VM et séparation des partitions.
Les trois partitions doivent contenir des exemples approuvés. Un dossier de poids local
avec configuration et fichiers safetensors est requis ; ce contrôle de présence ne remplace
pas la vérification de compatibilité effectuée par MLX au chargement.

Préparer une configuration sans lancer de calcul :

```sh
node tools/train-lora.ts --bundle chemin/reviewed.json --manifest chemin/current.json --model chemin/modele-mlx
```

Lancer effectivement l’adaptation avec les mêmes contrôles :

```sh
node tools/train-lora.ts --bundle chemin/reviewed.json --manifest chemin/current.json --model chemin/modele-mlx --run
```

Chaque préparation conserve la configuration, la provenance et le résultat dans
`rapports/entrainement/`. Les adaptateurs sont placés dans `artifacts/training/`. La fin du calcul est enregistrée comme
`completed-not-evaluated` : elle ne signifie pas que le modèle est meilleur ni validé.
La comparaison avant/après et la promotion restent à raccorder. Aucun nouvel essai VM
ou entraînement ne se relance automatiquement après un échec métier.

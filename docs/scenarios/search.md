# Recherche locale des scénarios

L’index évite de fournir toutes les définitions au contexte d’une IA. Le générateur lit les sources sur disque, puis la recherche ne renvoie que des résumés bornés. Aucun modèle, VM, réseau ni entraînement n’est lancé.

```sh
node tools/index-scenarios.ts --migrate  # une fois, puis idempotent
node tools/index-scenarios.ts --build
node tools/index-scenarios.ts --family file --limit 20
node tools/index-scenarios.ts --action file.open --tag journey
node tools/index-scenarios.ts --query sauvegarde --language fr
node tools/index-scenarios.ts --id P003
```

Sans option, la commande cherche dans l’index existant et retourne au maximum 20 fiches ; `--limit` accepte 1 à 100. L’index doit être reconstruit après modification des sources. Les résultats indiquent leur date de génération et le hash de la source. L’ouverture détaillée vérifie aussi la révision actuelle et refuse une projection périmée.

## Organisation et autorité

`artifacts/scenario-index/index.json` contient identifiant stable, titre court, famille, tags dérivés, actions, langues présentes, état actif/prêt, source et empreintes. Il ne contient ni plans complets, ni rapports, ni captures. Les tags associent famille, type et actions aux tags métier éditables dans le fichier canonique du cas.

Chaque scénario a une projection JSON complète dans un sous-dossier de génération puis de famille. Son nom est le hash de l’identifiant, afin de préserver sans collision les identifiants de cas contenant `/`. Les parcours transversaux sont rangés dans `journeys` et restent recherchables par toutes les familles de leurs actions. La publication remplace l’index seulement une fois la génération écrite ; une génération en échec est supprimée. Les générations antérieures restent des fichiers générés supprimables, sans valeur de preuve.

**Ne pas éditer les projections sous artifacts.** `editSource` désigne le fichier faisant autorité : petit fichier JSON canonique pour un cas migré, tableau Markdown pour un cas pas encore migré, fichier JSON de parcours pour un plan exécutable. Les identifiants, hashes et contrats d’édition existants sont conservés. Une fiche « prête » n’est pas une réussite QA ni un exemple approuvé pour l’entraînement. Les langues indiquent la présence de textes dans la source administrée, pas une validation linguistique ; les cas Markdown n’exposent que leur texte français.

## Usage lors d’une évolution de Studio

L’IA lit les fichiers modifiés de Studio, identifie les actions concernées, filtre l’index par action/famille/tag, puis ouvre uniquement les scénarios sélectionnés. Elle modifie la source autoritaire, reconstruit l’index et fait rejouer les scénarios affectés. Une recherche filtrée ne démontre pas l’exhaustivité de la couverture.

## Fichiers canoniques par cas

`--migrate` crée `datasets/scenario-cases/<famille>/<action>--<numéro>.json` pour chaque cas. La migration est idempotente : elle ne remplace jamais un fichier existant et conserve identifiants et spécifications à l’identique.

Chaque fichier contient `version`, `id`, `source` (le nom du Markdown d’origine), `specification` et `tags`. Exemple : `datasets/scenario-cases/file/file.open--1.json`. L’IA peut éditer directement `specification` et `tags` ; elle conserve `id` et `source`. Les tags sont courts, sans espace, par exemple `regression`, `fichiers` ou `sauvegarde`.

Dès qu’un fichier canonique existe, il prévaut sur sa ligne Markdown. Le lecteur commun recompose cette ligne pour tous les consommateurs existants : inventaire, préparation des exemples et index. Les tableaux Markdown restent le registre des identifiants et une base de compatibilité ; modifier leur texte n’écrase pas un cas migré. Un fichier invalide, un identifiant déplacé ou une ligne d’origine absente provoque une erreur explicite, jamais un repli silencieux sur l’ancien texte.

L’éditeur de cas écrit désormais le fichier canonique et conserve les tags. Le hash métier dépend du texte ; la révision d’édition inclut aussi les tags afin de refuser un écrasement concurrent. Les rapports et preuves existants ne sont pas réécrits. Les parcours ont déjà un fichier JSON chacun et ne sont pas déplacés.

Après une édition, régénérer l’index et la préparation avant de rejouer la QA. Modifier une définition ne rend pas le cas exécutable ni approuvé pour l’entraînement.

> Cadrage initial conservé comme référence historique. Pour le statut et les choix actuels, lire [les décisions](decisions.md) et [les étapes](roadmap.md). Les mentions « aucun développement » décrivent la rédaction initiale.

# Plan d’évaluation

Tous les seuils sont proposés avant mesure. Aucun score n’est disponible. Une perte d’apprentissage qui baisse n’est pas une preuve que l’assistant accomplit mieux les tâches.

## Jeux et séparation

Le premier lot comprend 12 cas de mise au point : lecture, ajout, ajout malgré objet similaire existant, renommage par identifiant, déplacement relatif à autrui, mauvaise surface, ambiguïté, cible absente, correction après refus d’exécuteur, refus humain, demande hors périmètre, modification de calque. Ces cas sont publics pour les développeurs et exclus du test final.

Après cette preuve, prévoir 500 à 1 500 parcours **acceptés**, répartis approximativement en 70 % entraînement, 15 % validation, 15 % test. Le nombre de lignes JSONL sera supérieur au nombre de parcours. Réserver au moins 100 épisodes de test, en adaptant les proportions si le corpus initial est petit. Couvrir demandes simples, composition, découverte, clarification, échec/récupération et limite de périmètre ; au moins 20 cas chacun pour clarification/refus et hors périmètre, avec recouvrement possible des étiquettes.

Séparer par `splitGroup` : même scénario structurel, même lignée de fixture et toutes ses reformulations restent ensemble. Changer un nom ou un nombre ne crée pas une famille indépendante. Laisser les actions communes entre jeux, mais réserver des compositions et configurations d’état nouvelles. Rechercher doublons exacts, formes normalisées et similarité des modèles de parcours avant figer le split. Les générateurs ne doivent pas relire le test pour produire le train.

Le manifeste du split et ses empreintes sont gelés avant adaptation. Conserver les références de test dans un emplacement à accès contrôlé par le protocole du projet ; elles ne sont ni passées au modèle ni utilisées pour choisir les paramètres. Si un résultat de test sert à corriger, ce test devient développement : construire une nouvelle réserve indépendante et publier ce changement dans le rapport.

## Comparaisons

1. Qwen3-4B de base, avec prompt et runtime cibles fixés.
2. Qwen3-4B adapté, mêmes cas, même quantification et options que la base.
3. Qwen2.5 7B Q4 du catalogue, si disponible ou téléchargement autorisé : comparateur secondaire, pas contrôle causal de l’entraînement.

Exécuter les scénarios dans un ordre enregistré et équilibré. Trois répétitions à température 0, en signalant qu’elles ne constituent pas trois exemples indépendants ; elles servent à vérifier la stabilité du runtime. Recréer le décor pour chaque répétition. Distinguer modèle froid (chargement inclus) et chaud. Mesurer sans autre tâche lourde en concurrence. Conserver taux par famille et liste des régressions, pas seulement moyenne globale.

## Mesures et dénominateurs

| Mesure | Définition |
| --- | --- |
| JSON strict | Nombre de réponses brutes conformes au JSON et à l’enveloppe canonique / invocations modèle ; donner aussi taux récupéré par `readReply` |
| Actions reconnues | Appels nommant une action du registre / appels proposés ; taux hors liste pilote séparé |
| Paramètres valides | Appels acceptés par `readInput` / appels proposés ; distinguer normalisation et validité stricte de l’export |
| Références fondées | Références traçables à une entrée visible et valides au moment de l’exécution / références émises |
| Réussite de tâche | Épisodes dont tous les oracles passent / tous les épisodes planifiés ; délai dépassé et abandon échouent |
| Effets étrangers | Épisodes présentant au moins une différence non autorisée / épisodes ; examiner aussi la trace pour un effet transitoire ensuite annulé |
| Clarification / refus | Attente réelle, zéro mutation avant réponse, reprise correcte après choix ; aucune action après refus humain |
| Vérité de `say` | Absence de réussite annoncée sans effet vérifié ; annotation humaine ciblée sur les messages terminaux |
| Coût local | Temps au premier texte, par invocation et par mission, médiane/p95, nombre de tours et tentatives internes, tokens/s lorsque mesurables |
| Mémoire | Pic processus et allocations Metal disponibles, mémoire système/swap avant et après, chargement/libération ; ne pas additionner des mesures qui se recouvrent |

Un identifiant visible mais périmé est une erreur fonctionnelle possible, pas une invention. Une action permise peut être mal choisie. Une erreur de parse ne doit pas masquer un défaut d’exécuteur. Classer la cause principale et les causes secondaires : modèle, données, préparation du contexte, exécuteur, oracle, runtime/export.

## Oracles suffisamment forts

Comparer l’état avant/après sur les chemins autorisés ; ignorer seulement une liste explicite de métadonnées non métier (horodatage, journal). Tester les oracles en leur donnant délibérément : mauvais objet modifié, deux créations au lieu d’une, mauvaise valeur, réussite seulement verbale, mutation après refus. Ils doivent tous refuser ces faux succès.

Pour la position relative, vérifier le calcul, les axes non concernés, le document actif et les témoins. Pour un renommage, vérifier l’identité et le nombre d’objets. Pour une sauvegarde, le banc ne prouve pas la persistance réelle sur disque : compléter par fermeture/réouverture dans l’application réelle. En cas d’exception du banc, classer le cas comme non évalué et publier un score conservateur le comptant comme échec, au lieu de le retirer silencieusement.

## Portes de décision proposées

| Étape | Continuer si… | Sinon |
| --- | --- | --- |
| 1A : contrats/rejeu | 12 références passent ; capture exacte ; exemples négatifs rejetés ; hors liste bloqué avant dispatch ; aucun import ne modifie le checkout source | Corriger l’adaptateur ou proposer le petit point d’entrée source ; aucun gros corpus |
| 1B : base locale | 12 cas tentés réellement hors réseau, fin bornée, traces exploitables ; au moins 8 réussites dont ajout, lecture et renommage ; aucune mutation après question/refus | Analyser prompt, grammaire et runtime ; ne pas décider que LoRA corrigera un défaut d’intégration |
| 1C : export | Base et micro-adaptateur fusionné chargés dans le moteur cible ; 10 cas d’export exécutés aux différentes étapes ; aucune nouvelle défaillance fonctionnelle à la conversion non quantifiée | Suspendre l’apprentissage important ; corriger la chaîne ou changer de voie après décision |
| Pilote adapté | Au moins 90 % de réussite globale, aucune famille sous 80 %, JSON strict ≥99 %, paramètres et références ≥99 %, clarification/refus corrects ≥95 % | Corriger données/contrôles et réévaluer sur validation avant nouveau test réservé |
| Sécurité fonctionnelle | Zéro mutation hors périmètre ou après refus, zéro modification étrangère dans le jeu réservé ; tout appel interdit reste rapporté comme faute | Bloquer la distribution, même si le taux global est bon |
| Valeur de LoRA | Gain ≥10 points de réussite sur la base, ou réduction ≥30 % des erreurs si la base dépasse déjà 90 % ; pas de recul >5 points sur une famille | Préférer la base si elle suffit ; ne pas distribuer un adaptateur sans bénéfice démontré |
| Quantification | Perte de réussite ≤2 points face au GGUF non quantifié ; aucun nouveau échec critique | Essayer une précision supérieure, sans modifier simultanément les prompts |

Les seuils sur petits échantillons sont fragiles : publier numérateurs/dénominateurs, intervalle de confiance binomial pour la réussite, et comparaison appariée par épisode pour le gain. Les répétitions ne gonflent pas artificiellement l’effectif. Un gain dont l’incertitude reste large justifie davantage de cas réservés, pas une annonce définitive.

Budget d’usage **provisoire sur le Mac de référence** : p95 ≤30 s par invocation chaude, ≤120 s par tâche simple, mémoire incrémentale d’inférence ≤12 Go. Ces objectifs produit ne sont pas des performances annoncées. Le lot 1B les confronte à la réalité ; toute révision du budget doit précéder le test final. Limites du banc proposées : 12 invocations modèle et 180 s par épisode ; compter aussi les reprises internes et interrompre réellement les opérations dépassant la limite.

## Contrôle dans l’application réelle

Après autorisation spécifique d’intégration, jouer 10 cas synthétiques dans Electron, dont multi-document, choix puis reprise, refus, calque rendu, sauvegarde/réouverture et retour au modèle précédent. Fichiers et dépendances sont préprovisionnés ; Wi-Fi/Ethernet et appels réseau sont désactivés ou refusés dans l’environnement d’essai, boucle locale comprise. Contrôler les tentatives réseau du processus : l’absence d’erreur à l’écran seule ne prouve rien.

Ce contrôle complète le banc ; il ne certifie pas toutes les machines. Une livraison ultérieure doit définir mémoire minimale et profils CPU/GPU à partir de mesures sur les ordinateurs effectivement ciblés.

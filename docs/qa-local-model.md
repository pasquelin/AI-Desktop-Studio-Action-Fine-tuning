# Modèle local de debug / QA

Le client `src/qa/local-model.ts` interroge uniquement Ollama sur `127.0.0.1:11434`.
`localModels()` retourne les noms exacts disponibles ; l'utilisateur choisit l'un de ces noms. Aucun modèle par défaut n'est imposé, aucun téléchargement ni entraînement n'est déclenché. Les entrées signalées distantes (`remote_host`, `remote_model`, nom cloud) sont exclues. Le service Ollama doit lui-même être configuré pour l'inférence locale ; cette vérification de métadonnées n'est pas un pare-feu réseau du processus Ollama.

Le contrôle de disponibilité attend au maximum trois secondes. Une connexion impossible ne prouve pas qu'Ollama n'est pas installé : le message demande de l'installer si nécessaire et de le démarrer. Une liste vide signifie qu'aucun modèle admissible n'est disponible et empêche une proposition.

`proposeAction(model, context, signal)` revérifie le modèle choisi, transmet une demande et ses observations ainsi que les seuls outils autorisés. Une réponse doit contenir exactement un appel d'outil ou un objet JSON `{action,input}`. Le nom doit appartenir à la liste transmise et les paramètres doivent respecter son schéma Studio. Le client ne réalise aucune action ; le banc reste responsable des permissions, de l'exécution et de la vérification métier.

Les redirections HTTP sont refusées. Les messages entrants et sortants sont limités à un Mio et l'inférence à deux minutes ; l'annulation du banc est propagée. Une action ambiguë, inconnue ou invalide échoue sans nouvelle tentative automatique. Le modèle local de QA ne change pas le modèle cible de l'entraînement.

La factory injectable permet les tests hors ligne des erreurs de service, choix exact, propositions et limites. La validation du protocole ne garantit pas les capacités d'un modèle particulier.

Références officielles : [liste des modèles](https://docs.ollama.com/api/tags), [conversation et appels d'outils](https://docs.ollama.com/api/chat).


## Relais entre la VM et le modèle

Ollama est interrogé sur le Mac par le contrôleur du compagnon. La VM ne reçoit aucun tunnel réseau donnant accès au service Ollama : elle transmet une demande au worker, qui la relaie par IPC au contrôleur. Le nom du modèle est fixé par la campagne active ; une demande invitée ne peut pas le remplacer. Les demandes hors tentative active sont ignorées.

Le relais autorise une inférence à la fois. Il borne le contexte complet à 64 Kio, un outil, huit observations et des textes de demande/instruction de 16 384 caractères au maximum. Le résultat relayé est limité à 64 Kio. La perte du contrôleur interrompt l'attente et annule l'inférence.

Le mode actuel est une **QA guidée** : chaque étape transmet son outil de référence et ses paramètres attendus. Le modèle doit proposer l'appel correspondant ; les vérifications métier restent celles du scénario. Ce mode mesure la conformité des propositions et l'exécution réelle de Studio, pas la capacité du modèle à planifier seul un parcours entier depuis une demande libre.

Les propositions inconnues, mal formées ou incompatibles avec le schéma restent des échecs. Le rapport conserve un extrait borné de la proposition rejetée et masque les champs explicites de secrets ; le bilan de l'interface présente une cause lisible. La revue des rapports reste nécessaire avant partage : des valeurs sensibles peuvent exister dans un texte libre.

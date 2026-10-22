# Rapport d'audit et de corrections — ORBIT PRIME

Date : 22 octobre 2026

## Corrections réalisées

1. **Identifiants Kraken retirés du code source** : plus de valeurs par défaut pour `KRAKEN_API_KEY` et `KRAKEN_API_SECRET`. En l'absence de variables serveur, la connexion privée échoue proprement.
2. **Trading réel verrouillé côté serveur** : `executeReal` refuse les ordres, même si un client appelle directement la fonction. `placeSpotOrder` conserve un verrou défensif indépendant.
3. **Mandat automatique verrouillé** : le lancement est refusé tant que l'authentification, le stockage durable et les protections d'exécution ne sont pas validés.
4. **Interface clarifiée** : les commandes d'exécution réelle et d'armement sont désactivées ; la page indique que Kraken est en lecture seule. Le contrôle d'arrêt reste accessible.
5. **État de mandat réinitialisé** : le fichier inclus dans l'archive indiquait un mandat encore actif jusqu'au 22 octobre 2026 à 23:47 environ (heure de Paris). L'archive corrigée n'inclut plus cet état actif.
6. **Build Vercel corrigé** : suppression de `--omit=dev` dans la commande d'installation, car Vite, TypeScript et les outils de build sont nécessaires au déploiement.
7. **Artefacts générés supprimés** : suppression du build `.vercel` ancien, qui contenait encore les identifiants codés en dur, ainsi que des métadonnées de build `.tanstack`.

## Risques restant à traiter avant un trading réel

- Authentification et autorisation utilisateur : absentes/inactives dans la configuration fournie (`VITE_AUTH_ENABLED=false`). Les fonctions de trading publiques ne doivent jamais pouvoir agir sur le compte d'un opérateur sans une identité vérifiée côté serveur.
- Mandat sur Vercel : l'état utilise actuellement un fichier local `/workspace/data/mandate.json`, incompatible avec une persistance fiable entre instances serverless. Un stockage durable et une coordination distribuée sont nécessaires.
- Risque de marché : il manque une validation indépendante de la stratégie, des limites journalières de pertes, de l'exposition agrégée, du slippage, des frais réels, des doublons d'ordres, des réponses partielles et de la reprise après incident.
- Le code de gestion des positions doit être revu : un solde d'actif ne prouve pas que l'actif a été acheté par ce bot ; la fermeture intégrale du solde peut vendre des actifs préexistants.
- Les tests de stratégie existants ne constituent pas une validation hors échantillon suffisante pour autoriser des transactions réelles.

## Vérifications effectuées

- 197 tests Node intégrés exécutés : 189 réussis, 8 échoués.
- Les 8 échecs concernent les tests du middleware de métadonnées PWA/Open Graph, qui lisent le titre de site `ORBIT` depuis `src/lib/og/site.json` alors que plusieurs tests attendent un contexte isolé et des titres génériques. À corriger en isolant les fixtures de test ou en injectant explicitement `site` dans les tests.
- Le contrôle TypeScript et le build de production n'ont pas pu être exécutés : l'installation complète des dépendances a échoué car le registre npm n'était pas disponible dans l'environnement. Les tests TypeScript dépendant de bibliothèques absentes ont aussi été bloqués. Le build n'est donc pas déclaré validé.

## Alerte de sécurité

L'archive initiale contenait des valeurs codées en dur ressemblant à des clés Kraken dans le code source et dans le build compilé. Si elles ont déjà été utilisées ou partagées, considérez-les compromises et révoquez-les dans Kraken. La correction de cette archive ne révoque pas une clé côté Kraken et ne supprime pas les copies déjà distribuées.

## Deuxième passe de finalisation — 22 octobre 2026

- Correction de l'isolation des tests PWA/Open Graph : les tests utilisent désormais un répertoire temporaire par défaut au lieu de lire accidentellement `src/lib/og/site.json` du projet courant. Les tests qui vérifient un workspace précis continuent de passer leur `cwd` explicitement.
- Restauration du `AGENTS.md` d'origine après détection d'un fichier vide pendant la première passe.
- Suite Node : **197/197 tests réussis** (`npm test` — première phase `scripts/**/*.test.mjs`).
- Tests TypeScript complémentaires : **10/12 réussis** ; 2 tests ne démarrent pas, car des dépendances absentes du `node_modules` (`@tanstack/react-start` et `jose`) empêchent le chargement. Ce n'est pas un résultat de test fonctionnel concluant.
- `npm run typecheck` : bloqué avant analyse par l'absence des définitions `@types/node` et `vite/client`.
- `npm run check:auth` : ne peut pas confirmer l'invariant car la valeur résolue de `VITE_AUTH_ENABLED` par le serveur de développement n'est pas disponible dans cet environnement.
- Build de production non certifié : installation complète des dépendances non disponible dans l'environnement. Il faut exécuter `npm ci`, puis `npm test`, `npm run typecheck`, `npm run check:auth` et `npm run build` dans un environnement réseau/CI configuré.

**Statut de livraison :** archive préparée pour revue et essais en mode démo uniquement. Le verrou serveur du trading réel doit rester actif. Ne pas connecter une clé API Kraken avec permissions de trading avant authentification côté serveur, persistance durable, tests de build et validation indépendante du risque.

## Troisième passe — validation depuis l'archive livrable

- Cause des 8 échecs de la première exécution identifiée : l'archive corrigée ne contenait pas le répertoire de documentation `.grok/` nécessaire à plusieurs tests et à `app-env.json`. Le contenu `.grok/` a été restauré depuis l'archive d'origine.
- Suite `node --test 'scripts/**/*.test.mjs'` : **197/197 réussis** après restauration de `.grok/`.
- La commande complète `npm test` reste en échec au second groupe de tests TypeScript, non pas sur 2 assertions fonctionnelles, mais parce que l'installation locale de `node_modules` est incomplète : modules `@tanstack/react-start/server` et `jose` introuvables. Le processus `npm ci` n'a pas pu terminer dans cet environnement.
- `npm run typecheck` échoue avant analyse, car `@types/node` et les types `vite/client` sont absents.
- `npm run build` échoue avant Vite (`spawn vite ENOENT`), conséquence des dépendances incomplètes.
- `npm run check:auth` n'a pas pu vérifier l'accord dev/build, car aucun serveur de développement n'était disponible pour exposer `/__app-env`.
- L'archive finale conserve les fichiers `.grok/` nécessaires, exclut `node_modules/` et ne contient aucun fichier `.env` réel. Aucune clé API ne doit être ajoutée au ZIP ou envoyée dans le chat.

**Conclusion mise à jour :** les tests Node de scripts sont verts (197/197). Le projet complet reste non certifié, car la chaîne TypeScript/build et les tests TypeScript ne peuvent pas être conclus sans installation reproductible des dépendances. Le mode démo et le verrouillage des ordres réels restent obligatoires.

## Quatrième passe — verrouillage d'une lecture privée anonyme — 22 octobre 2026

### Constat de sécurité P1

La fonction serveur `loadAccount` appelait directement `readKrakenAccount()` sans authentification ni contrôle d'autorisation. Si des variables `KRAKEN_API_KEY` et `KRAKEN_API_SECRET` étaient configurées sur l'hébergement, un visiteur non authentifié pouvait potentiellement interroger cette fonction et obtenir les soldes privés du compte opérateur. Ce risque existe indépendamment du verrouillage des ordres.

### Correction appliquée

`loadAccount` renvoie maintenant un résultat déconnecté, avec une liste de soldes vide et un message explicite. L'appel à l'API privée Kraken n'est plus exécuté par cette route publique. La lecture privée ne devra être réactivée qu'après implémentation et validation de l'authentification serveur, d'une autorisation par utilisateur et du périmètre des comptes.

### Résultats après cette correction

- `node --test scripts/*.test.mjs` : **197/197 réussis** après le verrouillage de `loadAccount` ; relancé le 22 octobre 2026.
- `npm ci --ignore-scripts --no-audit --no-fund` : impossible à terminer dans cet environnement, le registre npm n'étant pas résolu (`curl` retourne une erreur DNS). Un `node_modules` partiel est présent et ne doit pas être utilisé pour certifier le projet.
- `npm test` : 197 tests de scripts passent, mais la phase TypeScript échoue au chargement de deux tests en raison de modules manquants (`@tanstack/react-start/server`, `jose`). Résultat global non vert.
- `tsc --noEmit` : bloqué avant analyse par les définitions manquantes `@types/node` et `vite/client`.
- `npm run lint` : non exécuté, `eslint` absent.
- `npm run build` : non exécuté, `vite` absent (`spawn vite ENOENT`).
- `npm run check:auth` : non concluant sans serveur de développement démarré.

**Décision de sécurité :** mode démo uniquement. Ne pas configurer de clés Kraken privées dans l'environnement public tant que les contrôles d'accès n'ont pas été implémentés et testés. Une clé d'API Kraken ne doit jamais être publiée dans l'archive, dans le navigateur ou dans le chat.

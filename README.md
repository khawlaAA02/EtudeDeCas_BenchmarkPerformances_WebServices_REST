### Étude de cas – Benchmark de performances des Web Services REST

###  Description du projet

Ce projet consiste à comparer les performances de plusieurs implémentations REST sur le même domaine métier et la même base de données PostgreSQL.
L’objectif est d’évaluer l’impact des choix technologiques sur la latence, le débit, la consommation CPU/RAM, le coût d’abstraction et la stabilité sous forte charge.

Trois variantes ont été développées :

| Variante | Stack technique                                                          |
| -------- | ------------------------------------------------------------------------ |
| A        | JAX-RS (Jersey) + JPA/Hibernate                                          |
| C        | Spring Boot + @RestController (Spring MVC) + JPA/Hibernate               |
| D        | Spring Boot + Spring Data REST (exposition automatique des repositories) |

Environnement & outils utilisés

. Java 17

. PostgreSQL 14+

. HikariCP

. JMeter (tests de charge)

- InfluxDB v2 + Backend Listener JMeter

. Prometheus + JMX Exporter

. Grafana (dashboards JVM + JMeter)

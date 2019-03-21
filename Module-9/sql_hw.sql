USE sakila;
-- DESCRIBE actor;
-- 1a
SELECT first_name,last_name FROM actor;

-- 1b
SELECT CONCAT_WS(" ",first_name,last_name) "Actor Name" FROM actor;

-- 2a
SELECT actor_id, first_name, last_name FROM actor WHERE first_name = "Joe";

-- 2b
SELECT actor_id, first_name, last_name, LOCATE("GEN",last_name) FROM actor WHERE LOCATE("GEN", last_name)>0;

-- 2c
SELECT actor_id, last_name, first_name, LOCATE("LI",last_name) FROM actor WHERE LOCATE("LI", last_name)>0;

-- 2d
-- DESCRIBE country;
SELECT country_id, country FROM country WHERE country IN ("Afghanistan","Bangladesh","China");

-- 3a
-- DESCRIBE actor;
ALTER TABLE actor ADD description BLOB;
DESCRIBE actor;

-- 3b
ALTER TABLE actor DROP COLUMN description;
DESCRIBE actor;

-- 4a
SELECT last_name,COUNT(*) FROM actor GROUP BY last_name;

-- 4b
SELECT last_name, COUNT(*) AS num_actor FROM actor GROUP BY last_name HAVING num_actor >=2;

-- 4c
SET SQL_SAFE_UPDATES = 0;
-- SELECT actor_id, first_name,last_name FROM actor WHERE first_name ='GROUCHO'  AND last_name = 'WILLIAMS';
UPDATE actor SET first_name = 'HARPO' WHERE first_name = "GROUCHO" AND last_name = "WILLIAMS";
SELECT actor_id, first_name, last_name FROM actor WHERE last_name = "WILLIAMS";

-- 4d
UPDATE actor SET first_name = 'GROUCHO' WHERE first_name = "HARPO" AND last_name = "WILLIAMS";
SELECT actor_id, first_name, last_name FROM actor WHERE last_name = "WILLIAMS";

-- 5a
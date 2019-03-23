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
SHOW CREATE TABLE address;

-- 6a
-- DESCRIBE staff;
-- SELECT address_id, first_name, last_name FROM staff;
-- SELECT address_id, address FROM address where address_id IN (3,4);
SELECT s.address_id, s.first_name, s.last_name, a.address FROM staff AS s JOIN address AS a WHERE a.address_id IN (s.address_id);

-- 6b
DESCRIBE staff;
DESCRIBE payment;
-- SELECT SUM(p.amount), p.staff_id, p.payment_date FROM payment AS p WHERE LOCATE("2005-08",p.payment_date) GROUP BY staff_id ;
SELECT p.staff_id, s.first_name, s.last_name, SUM(p.amount) AS "Total Sales August 2005" FROM payment AS p  JOIN staff as s WHERE s.staff_id IN (select p.staff_id from payment where LOCATE("2005-08",p.payment_date)) GROUP BY staff_id; 

-- 6c
-- DESCRIBE film_actor;
-- DESCRIBE film;
-- SELECT film_id, title FROM film;
-- SELECT film_id, count(actor_id) FROM film_actor GROUP BY film_id;
SELECT fa.film_id, f.title, COUNT(fa.actor_id) AS "Number of Actors" FROM film_actor AS fa INNER JOIN film as f ON fa.film_id = f.film_id GROUP BY film_id;

-- 6d
-- DESCRIBE inventory;
-- SELECT film_id, title FROM film WHERE title = 'Hunchback Impossible';
SELECT i.film_id, f.title, COUNT(i.inventory_id) AS "Inventory" FROM inventory AS i INNER JOIN film AS f ON i.film_id = f.film_id WHERE f.title = 'Hunchback Impossible'; -- GROUP BY film_id;

-- 6e
-- DESCRIBE customer;
-- DESCRIBE payment;
-- SELECT customer_id, amount FROM payment;
-- SELECT customer_id, first_name, last_name FROM customer ORDER BY last_name;
SELECT c.first_name, c.last_name, SUM(p.amount) AS "Total Amount Paid" FROM payment AS p INNER JOIN customer AS C ON p.customer_id = c.customer_id  GROUP BY p.customer_id ORDER BY c.last_name;

-- 7a
SELECT language_id, title
FROM film
WHERE language_id IN 
(
 SELECT language_id
 FROM language 
 WHERE name = "English" AND (title LIKE "K%" OR title LIKE "Q%")
 );
 
 -- 7b
 SELECT first_name, last_name
 FROM actor
 WHERE actor_id IN 
 (
  SELECT actor_id 
  FROM film_actor
  WHERE film_id IN
  (
   SELECT film_id
   FROM film
   WHERE title = "Alone Trip"
  )
 );
 /*-- Using joins
 SELECT a.first_name, a.last_name, f.title 
 FROM actor AS a 
 INNER JOIN film_actor AS fa ON a.actor_id = fa.actor_id 
 INNER JOIN film AS f ON fa.film_id = f.film_id 
 WHERE f.title = "Alone Trip";
 */
 
 -- 7c
 SELECT c.first_name, c.last_name, c.email, co.country 
 FROM customer AS c
 JOIN address AS a ON c.address_id = a.address_id
 JOIN city AS ci ON a.city_id = ci.city_id
 JOIN country AS co ON ci.country_id = co.country_id
 WHERE country = "Canada";
 
 -- 7d
 SELECT title
 FROM film
 WHERE film_id IN 
 (
  SELECT film_id
  FROM film_category
  WHERE category_id IN
  (
   SELECT category_id
   FROM category
   WHERE name = "Family"
   )
 );
/*-- Using Join 
SELECT f.title, c.name 
FROM film AS f
JOIN film_category AS fc ON f.film_id = fc.film_id
JOIN category AS c ON fc.category_id = c.category_id
WHERE c.name = "Family";
*/ 

-- 7e
SELECT f.title, COUNT(r.inventory_id) AS "Number of Rentals" 
FROM rental AS r 
JOIN inventory AS i ON r.inventory_id = i.inventory_id 
JOIN film AS f ON i.film_id = f.film_id 
GROUP BY title 
ORDER BY COUNT(r.inventory_id) DESC;

-- 7f
SELECT s.store_id, SUM(p.amount) AS "Total Amount"
FROM payment AS p
JOIN rental AS r ON p.rental_id = r.rental_id
JOIN inventory AS i ON r.inventory_id = i.inventory_id
JOIN store AS s ON i.store_id = s.store_id
GROUP BY s.store_id;

-- 7g
SELECT s.store_id, c.city, ct.country
FROM store AS s
JOIN address AS a ON s.address_id = a.address_id
JOIN city AS c ON a.city_id = c.city_id
JOIN country AS ct ON c.country_id = ct.country_id;

-- 7h
SELECT c.name, SUM(p.amount) AS "Gross Revenue"
FROM payment AS p
JOIN rental AS r ON p.rental_id = r.rental_id
JOIN inventory AS i ON r.inventory_id = i.inventory_id
JOIN film_category AS fc ON i.film_id = fc.film_id
JOIN category AS c ON fc.category_id = c.category_id
GROUP BY c.name
ORDER BY SUM(p.amount) DESC 
LIMIT 5;

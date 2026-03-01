Here's a comprehensive guide to all SQL query filtering and manipulation options:

## **WHERE Clause - Basic Filtering**

| Operator | Description | Example |
|----------|-------------|---------|
| `=` | Equal to | `WHERE age = 25` |
| `!=` or `<>` | Not equal to | `WHERE city != 'NYC'` |
| `>` | Greater than | `WHERE height > 170` |
| `<` | Less than | `WHERE age < 18` |
| `>=` | Greater than or equal | `WHERE salary >= 50000` |
| `<=` | Less than or equal | `WHERE weight <= 80` |

## **Logical Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| `AND` | Both conditions must be true | `WHERE age > 18 AND city = 'NYC'` |
| `OR` | At least one condition must be true | `WHERE city = 'NYC' OR city = 'LA'` |
| `NOT` | Negates a condition | `WHERE NOT city = 'NYC'` |
| `()` | Groups conditions | `WHERE (age > 18 AND age < 65) OR status = 'senior'` |

## **Range and Set Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| `BETWEEN ... AND ...` | Value within range (inclusive) | `WHERE age BETWEEN 18 AND 65` |
| `NOT BETWEEN` | Value outside range | `WHERE salary NOT BETWEEN 30000 AND 50000` |
| `IN (...)` | Value matches any in list | `WHERE city IN ('NYC', 'LA', 'Chicago')` |
| `NOT IN (...)` | Value doesn't match any in list | `WHERE status NOT IN ('inactive', 'suspended')` |

## **NULL Handling**

| Operator | Description | Example |
|----------|-------------|---------|
| `IS NULL` | Check if value is NULL | `WHERE phone IS NULL` |
| `IS NOT NULL` | Check if value is not NULL | `WHERE email IS NOT NULL` |

## **Pattern Matching (LIKE)**

| Wildcard | Description | Example |
|----------|-------------|---------|
| `%` | Matches any sequence of characters | `WHERE name LIKE 'John%'` (starts with John) |
| `_` | Matches exactly one character | `WHERE code LIKE 'A_C'` (A?C) |
| `LIKE` | Pattern matching | `WHERE email LIKE '%@gmail.com'` |
| `NOT LIKE` | Negated pattern matching | `WHERE name NOT LIKE 'A%'` |

**Common LIKE Patterns:**
```sql
-- Starts with 'A'
WHERE name LIKE 'A%'

-- Ends with 'son'
WHERE name LIKE '%son'

-- Contains 'and'
WHERE name LIKE '%and%'

-- Second letter is 'a'
WHERE name LIKE '_a%'

-- Exactly 5 characters
WHERE code LIKE '_____'
```

## **Regular Expressions (REGEXP/RLIKE)**

| Pattern | Description | Example |
|----------|-------------|---------|
| `REGEXP` / `RLIKE` | Regular expression match | `WHERE email REGEXP '^[A-Z]'` |
| `NOT REGEXP` | Negated regex | `WHERE name NOT REGEXP '[0-9]'` |
| `^` | Start of string | `WHERE name REGEXP '^A'` |
| `$` | End of string | `WHERE name REGEXP 'son$'` |
| `[abc]` | Any character in brackets | `WHERE code REGEXP '[ABC]'` |
| `[a-z]` | Character range | `WHERE name REGEXP '[a-z]'` |
| `|` | OR operator | `WHERE city REGEXP 'NYC|LA'` |

## **EXISTS and Subqueries**

| Operator | Description | Example |
|----------|-------------|---------|
| `EXISTS` | Returns true if subquery returns rows | `WHERE EXISTS (SELECT 1 FROM orders WHERE ...)` |
| `NOT EXISTS` | Returns true if subquery returns no rows | `WHERE NOT EXISTS (SELECT 1 FROM ...)` |
| `IN (subquery)` | Value matches any from subquery | `WHERE patient_id IN (SELECT patient_id FROM admissions)` |

## **HAVING Clause - Filtering After Aggregation**

Used with GROUP BY to filter aggregated results:

```sql
SELECT city, COUNT(*) as count
FROM patients
GROUP BY city
HAVING COUNT(*) > 100
```

| Use Case | Example |
|----------|---------|
| Filter aggregated data | `HAVING SUM(amount) > 1000` |
| Multiple conditions | `HAVING COUNT(*) > 5 AND AVG(age) < 40` |

## **DISTINCT - Remove Duplicates**

```sql
SELECT DISTINCT city FROM patients
SELECT DISTINCT first_name, last_name FROM patients
```

## **LIMIT and OFFSET - Pagination**

| Clause | Description | Example |
|----------|-------------|---------|
| `LIMIT n` | Returns first n rows | `LIMIT 10` |
| `LIMIT n OFFSET m` | Skip m rows, return n rows | `LIMIT 10 OFFSET 20` |
| `LIMIT m, n` | Skip m rows, return n rows (older syntax) | `LIMIT 20, 10` |

## **ORDER BY - Sorting**

| Option | Description | Example |
|----------|-------------|---------|
| `ORDER BY column` | Sort ascending (default) | `ORDER BY age` |
| `ORDER BY column ASC` | Sort ascending (explicit) | `ORDER BY age ASC` |
| `ORDER BY column DESC` | Sort descending | `ORDER BY age DESC` |
| Multiple columns | Sort by multiple criteria | `ORDER BY last_name, first_name` |
| By position | Sort by column position | `ORDER BY 1, 2` |
| By expression | Sort by calculated value | `ORDER BY LENGTH(name) DESC` |

## **GROUP BY - Grouping**

```sql
SELECT city, COUNT(*) as patient_count
FROM patients
GROUP BY city

-- Multiple columns
SELECT city, gender, COUNT(*)
FROM patients
GROUP BY city, gender

-- With HAVING
SELECT city, AVG(height) as avg_height
FROM patients
GROUP BY city
HAVING AVG(height) > 170
```

## **CASE Statements - Conditional Logic**

```sql
-- Simple CASE
SELECT 
  first_name,
  CASE gender
    WHEN 'M' THEN 'Male'
    WHEN 'F' THEN 'Female'
    ELSE 'Unknown'
  END as gender_full
FROM patients

-- Searched CASE
SELECT 
  first_name,
  CASE 
    WHEN age < 18 THEN 'Minor'
    WHEN age BETWEEN 18 AND 65 THEN 'Adult'
    ELSE 'Senior'
  END as age_group
FROM patients
```

## **JOINs - Combining Tables**

| JOIN Type | Description | Example |
|----------|-------------|---------|
| `INNER JOIN` | Returns matching rows from both tables | `FROM patients p INNER JOIN admissions a ON p.patient_id = a.patient_id` |
| `LEFT JOIN` | All from left + matches from right | `FROM patients p LEFT JOIN admissions a ON p.patient_id = a.patient_id` |
| `RIGHT JOIN` | All from right + matches from left | `FROM admissions a RIGHT JOIN patients p ON a.patient_id = p.patient_id` |
| `FULL OUTER JOIN` | All rows from both tables | `FROM patients p FULL OUTER JOIN admissions a ON p.patient_id = a.patient_id` |
| `CROSS JOIN` | Cartesian product | `FROM patients CROSS JOIN doctors` |
| `SELF JOIN` | Join table to itself | `FROM patients p1 JOIN patients p2 ON p1.city = p2.city` |

## **Set Operations**

| Operation | Description | Example |
|----------|-------------|---------|
| `UNION` | Combines results, removes duplicates | `SELECT city FROM patients UNION SELECT city FROM doctors` |
| `UNION ALL` | Combines results, keeps duplicates | `SELECT city FROM patients UNION ALL SELECT city FROM doctors` |
| `INTERSECT` | Returns common rows | `SELECT city FROM patients INTERSECT SELECT city FROM doctors` |
| `EXCEPT` / `MINUS` | Returns rows from first query not in second | `SELECT city FROM patients EXCEPT SELECT city FROM doctors` |

## **Subquery Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| `ANY` | Compare to any value from subquery | `WHERE height > ANY (SELECT height FROM patients WHERE city = 'NYC')` |
| `ALL` | Compare to all values from subquery | `WHERE height > ALL (SELECT height FROM patients WHERE city = 'NYC')` |
| `SOME` | Same as ANY | `WHERE age = SOME (SELECT age FROM patients WHERE city = 'LA')` |

## **Complete Query Structure**

Here's the order clauses must appear:

```sql
SELECT columns
FROM table
JOIN other_table ON condition
WHERE conditions
GROUP BY columns
HAVING aggregate_conditions
ORDER BY columns
LIMIT number OFFSET number
```

## **Common Filtering Combinations**

```sql
-- Multiple AND conditions
WHERE age > 18 AND city = 'NYC' AND status = 'active'

-- Multiple OR conditions
WHERE city = 'NYC' OR city = 'LA' OR city = 'Chicago'

-- Mixed AND/OR with grouping
WHERE (city = 'NYC' OR city = 'LA') AND age > 18

-- Range with exclusion
WHERE age BETWEEN 18 AND 65 AND status NOT IN ('inactive', 'suspended')

-- Pattern with NULL check
WHERE email LIKE '%@gmail.com' AND phone IS NOT NULL

-- Subquery with IN
WHERE patient_id IN (SELECT patient_id FROM admissions WHERE YEAR(admission_date) = 2023)

-- EXISTS with correlation
WHERE EXISTS (
  SELECT 1 FROM admissions a 
  WHERE a.patient_id = patients.patient_id 
  AND YEAR(a.admission_date) = 2023
)
```

This covers all the major filtering and query manipulation options in SQL!
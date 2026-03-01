# MySQL Functions

Here are the most commonly used MySQL functions organized by category:

## **String Functions**

| Function | Description |
|----------|-------------|
| `LENGTH(str)` | Returns the length of a string in bytes |
| `CHAR_LENGTH(str)` | Returns the number of characters in a string |
| `CONCAT(str1, str2, ...)` | Concatenates strings together |
| `CONCAT_WS(separator, str1, str2, ...)` | Concatenates with separator |
| `UPPER(str)` / `UCASE(str)` | Converts string to uppercase |
| `LOWER(str)` / `LCASE(str)` | Converts string to lowercase |
| `SUBSTRING(str, start, length)` | Extracts a substring |
| `LEFT(str, length)` | Returns leftmost characters |
| `RIGHT(str, length)` | Returns rightmost characters |
| `TRIM(str)` | Removes leading and trailing spaces |
| `LTRIM(str)` | Removes leading spaces |
| `RTRIM(str)` | Removes trailing spaces |
| `REPLACE(str, find, replace)` | Replaces occurrences of a substring |
| `REVERSE(str)` | Reverses a string |
| `INSTR(str, substr)` | Returns position of first occurrence of substring |
| `LOCATE(substr, str)` | Similar to INSTR |
| `REPEAT(str, count)` | Repeats a string |
| `SPACE(count)` | Returns a string of spaces |
| `LPAD(str, length, pad)` | Left-pads string to length |
| `RPAD(str, length, pad)` | Right-pads string to length |

## **Numeric Functions**

| Function | Description |
|----------|-------------|
| `ABS(x)` | Returns absolute value |
| `ROUND(x, decimals)` | Rounds a number |
| `CEIL(x)` / `CEILING(x)` | Rounds up to nearest integer |
| `FLOOR(x)` | Rounds down to nearest integer |
| `TRUNCATE(x, decimals)` | Truncates to specified decimals |
| `MOD(x, y)` | Returns remainder of x/y |
| `POWER(x, y)` / `POW(x, y)` | Returns x raised to power y |
| `SQRT(x)` | Returns square root |
| `RAND()` | Returns random number (0 to 1) |
| `SIGN(x)` | Returns sign of number (-1, 0, 1) |
| `GREATEST(x1, x2, ...)` | Returns greatest value |
| `LEAST(x1, x2, ...)` | Returns smallest value |

## **Date and Time Functions**

| Function | Description |
|----------|-------------|
| `NOW()` | Returns current date and time |
| `CURDATE()` / `CURRENT_DATE()` | Returns current date |
| `CURTIME()` / `CURRENT_TIME()` | Returns current time |
| `DATE(datetime)` | Extracts date part |
| `TIME(datetime)` | Extracts time part |
| `YEAR(date)` | Extracts year |
| `MONTH(date)` | Extracts month (1-12) |
| `DAY(date)` / `DAYOFMONTH(date)` | Extracts day of month |
| `DAYOFWEEK(date)` | Returns day of week (1=Sunday, 7=Saturday) |
| `DAYOFYEAR(date)` | Returns day of year (1-366) |
| `WEEK(date)` | Returns week number |
| `WEEKDAY(date)` | Returns weekday index (0=Monday, 6=Sunday) |
| `MONTHNAME(date)` | Returns month name |
| `DAYNAME(date)` | Returns day name |
| `HOUR(time)` | Extracts hour |
| `MINUTE(time)` | Extracts minute |
| `SECOND(time)` | Extracts second |
| `DATEDIFF(date1, date2)` | Returns difference in days |
| `TIMESTAMPDIFF(unit, date1, date2)` | Returns difference in specified unit |
| `DATE_ADD(date, INTERVAL value unit)` | Adds interval to date |
| `DATE_SUB(date, INTERVAL value unit)` | Subtracts interval from date |
| `DATE_FORMAT(date, format)` | Formats date according to pattern |
| `STR_TO_DATE(str, format)` | Converts string to date |
| `LAST_DAY(date)` | Returns last day of the month |
| `AGE(date)` | Calculates age (some versions) |

## **Aggregate Functions**

| Function | Description |
|----------|-------------|
| `COUNT(*)` / `COUNT(column)` | Counts rows |
| `SUM(column)` | Returns sum of values |
| `AVG(column)` | Returns average value |
| `MIN(column)` | Returns minimum value |
| `MAX(column)` | Returns maximum value |
| `GROUP_CONCAT(column)` | Concatenates values from group |
| `STD(column)` / `STDDEV(column)` | Returns standard deviation |
| `VARIANCE(column)` | Returns variance |

## **Conditional Functions**

| Function | Description |
|----------|-------------|
| `IF(condition, true_value, false_value)` | Returns value based on condition |
| `IFNULL(expr, alt_value)` | Returns alt_value if expr is NULL |
| `COALESCE(expr1, expr2, ...)` | Returns first non-NULL value |
| `NULLIF(expr1, expr2)` | Returns NULL if expr1 = expr2 |
| `CASE WHEN ... THEN ... ELSE ... END` | Complex conditional logic |

## **Conversion Functions**

| Function | Description |
|----------|-------------|
| `CAST(value AS type)` | Converts value to specified type |
| `CONVERT(value, type)` | Converts value to type |
| `BINARY(str)` | Converts to binary string |

## **Informational Functions**

| Function | Description |
|----------|-------------|
| `DATABASE()` | Returns current database name |
| `USER()` / `CURRENT_USER()` | Returns current user |
| `VERSION()` | Returns MySQL version |
| `LAST_INSERT_ID()` | Returns last AUTO_INCREMENT value |
| `ROW_COUNT()` | Returns number of affected rows |

## **NULL Functions**

| Function | Description |
|----------|-------------|
| `ISNULL(expr)` | Returns 1 if NULL, 0 otherwise |
| `IFNULL(expr, value)` | Returns value if expr is NULL |
| `COALESCE(expr1, expr2, ...)` | Returns first non-NULL expression |

## **Pattern Matching**

| Function | Description |
|----------|-------------|
| `LIKE` | Pattern matching with % and _ |
| `REGEXP` / `RLIKE` | Regular expression matching |
| `NOT LIKE` | Negated pattern matching |
| `NOT REGEXP` | Negated regex matching |

## **JSON Functions** (MySQL 5.7+)

| Function | Description |
|----------|-------------|
| `JSON_EXTRACT(json, path)` | Extracts data from JSON |
| `JSON_OBJECT(key, value, ...)` | Creates JSON object |
| `JSON_ARRAY(value, ...)` | Creates JSON array |
| `JSON_CONTAINS(json, value)` | Checks if value exists |

## **Window Functions** (MySQL 8.0+)

| Function | Description |
|----------|-------------|
| `ROW_NUMBER()` | Assigns sequential number |
| `RANK()` | Assigns rank with gaps |
| `DENSE_RANK()` | Assigns rank without gaps |
| `NTILE(n)` | Divides rows into n groups |
| `LAG(column, offset)` | Accesses previous row |
| `LEAD(column, offset)` | Accesses next row |

These are the most essential MySQL functions you'll use regularly in queries!
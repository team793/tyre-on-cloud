-- Rename the 'Winter' tyre_type enum value to 'Rainy'.
-- Thailand has a rainy season, not winter — this matches how the
-- app actually labels the season to customers.
--
-- ALTER TYPE ... RENAME VALUE only updates the catalog label; it does not
-- rewrite any rows, so every existing product with tyre_type = 'Winter'
-- automatically reads as 'Rainy' immediately after, atomically.
ALTER TYPE public.tyre_type RENAME VALUE 'Winter' TO 'Rainy';

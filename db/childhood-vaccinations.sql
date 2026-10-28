INSERT INTO secret_links (id, category_id, title, url, description)
SELECT 'childhood-vaccinations', id, 'Childhood Vaccinations', '/secret/rabbit-holes/childhood-vaccinations', 'Historical health trends, vaccine schedule models, and the data behind the comparisons.'
FROM secret_categories WHERE slug = 'rabbit-holes'
ON CONFLICT(id) DO UPDATE SET title = excluded.title, url = excluded.url, description = excluded.description;

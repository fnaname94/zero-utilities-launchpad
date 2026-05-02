-- =======================================================
-- CORREÇÃO DOS SEMI-NOVOS
-- Como não importamos a quilometragem, todos ficaram com KM = 0 (que o sistema entende como 0KM).
-- Este script define uma KM padrão para os semi-novos para que eles apareçam na lista correta.
-- =======================================================

UPDATE vehicles 
SET km = 50000 
WHERE description NOT ILIKE '%0km%';

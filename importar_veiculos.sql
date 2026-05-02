-- =======================================================
-- IMPORTAÇÃO DOS VEÍCULOS DO SITE ANTIGO
-- Execute este script no SQL Editor do Supabase
-- =======================================================

-- 0KM
INSERT INTO vehicles (brand, model, year, category, status, seats, description, cover_image, featured)
VALUES
('Mercedes-Benz', 'Sprinter 517 Big', 2025, 'escolar', 'ativo', 31, 'Escolar 31 Lugares 0km Ônibus no Documento Com Ar Condicionado', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-23-at-15.42.34-510x382.jpeg', true),
('Mercedes-Benz', 'Sprinter 417', 2026, 'escolar', 'ativo', 24, 'Escolar 24 Lugares 0km Ônibus no Documento Com Ar Frontal', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-11-at-08.52.59-2-510x382.jpeg', true),
('Mercedes-Benz', 'Sprinter 417', 2026, 'escolar', 'ativo', 28, 'Escolar 28 Lugares Ônibus Extra Longa 0km Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/12/WhatsApp-Image-2025-11-25-at-10.44.05-510x382.jpeg', true);

-- SEMINOVOS - VANS EXECUTIVAS
INSERT INTO vehicles (brand, model, year, category, status, seats, description, cover_image)
VALUES
('Renault', 'Master L3H2', 2024, 'van', 'ativo', 16, 'Executiva 16 Lugares Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-19-at-10.50.18-510x382.jpeg'),
('Mercedes-Benz', 'Sprinter 415', 2018, 'escolar', 'ativo', 16, 'Escolar 16 Lugares Original Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-15.16.17-510x382.jpeg'),
('Mercedes-Benz', 'Sprinter 415', 2018, 'van', 'ativo', 16, 'Executiva 16 Lugares Teto Baixo Original Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-06-at-13.08.56-1-510x382.jpeg'),
('Mercedes-Benz', 'Sprinter 517 Big', 2024, 'van', 'ativo', 21, 'Executiva 21 Lugares Original Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/02/WhatsApp-Image-2026-01-07-at-16.01.07-510x382.jpeg'),
('Mercedes-Benz', 'Sprinter 416', 2021, 'van', 'ativo', 16, 'Executiva 16 Lugares Original Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/07/WhatsApp-Image-2025-05-22-at-09.29.14-510x382.jpeg'),
('Renault', 'Master L3H2', 2017, 'van', 'ativo', 16, 'Executiva 16 Lugares Original Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/07/WhatsApp-Image-2025-05-22-at-09.12.03-510x382.jpeg');

-- SEMINOVOS - ESCOLARES
INSERT INTO vehicles (brand, model, year, category, status, seats, description, cover_image)
VALUES
('Fiat', 'Ducato Multi', 2016, 'escolar', 'ativo', 28, 'Escolar 28 Lugares Ônibus no Documento Teto Alto', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-15.20.39-510x382.jpeg'),
('Fiat', 'Ducato Minibus', 2002, 'escolar', 'ativo', 26, 'Escolar 26 Lugares Ônibus no Documento Motor 2.8 Teto Baixo', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-15.23.24-510x382.jpeg'),
('Fiat', 'Ducato Minibus', 2012, 'escolar', 'ativo', 16, 'Escolar 16 Lugares Teto Baixo Com Ar Condicionado', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-06-at-12.50.52-2-510x382.jpeg'),
('Mercedes-Benz', 'Sprinter 313', 2010, 'escolar', 'ativo', 28, 'Escolar 28 Lugares Ônibus no Documento Extra Longa', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-06-at-12.38.12-1-510x382.jpeg'),
('Mercedes-Benz', 'Sprinter 313', 2012, 'escolar', 'ativo', 24, 'Escolar 24 Lugares Ônibus no Documento Teto Baixo', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/02/WhatsApp-Image-2026-03-23-at-15.02.47-510x382.jpeg'),
('Mercedes-Benz', 'Sprinter 416', 2022, 'escolar', 'ativo', 24, 'Escolar 24 Lugares Ônibus no Documento Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/09/WhatsApp-Image-2025-07-30-at-11.07.18-1-510x382.jpeg'),
('Mercedes-Benz', 'Sprinter 415', 2019, 'escolar', 'ativo', 20, 'Escolar 20 Lugares Teto Alto Com Ar Frontal', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/07/WhatsApp-Image-2026-03-03-at-14.33.46-510x382.jpeg'),
('Renault', 'Master L3H2', 2020, 'escolar', 'ativo', 24, 'Escolar 24 Lugares Ônibus no Documento Com Ar Condicionado', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-12-at-14.08.33-510x382.jpeg'),
('Jinbei', 'Topic L', 2011, 'escolar', 'ativo', 16, 'Escolar 16 Lugares Gasolina e Kit Gás', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-06-at-12.44.07-510x382.jpeg'),
('Citroën', 'Jumper', 2014, 'escolar', 'ativo', 16, 'Escolar 16 Lugares Original Teto Baixo', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/07/WhatsApp-Image-2025-05-14-at-10.38.39-510x382.jpeg'),
('Ford', 'Transit', 2013, 'van', 'ativo', 13, '350L Executivo 13 Lugares Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/12/WhatsApp-Image-2025-11-25-at-10.45.50-1-510x382.jpeg'),
('Ford', 'Transit', 2011, 'escolar', 'ativo', 16, 'Escolar 16 Lugares Original Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-10.10.11-510x382.jpeg');

-- SEMINOVOS - CADEIRANTE / PADRÃO LIGADO
INSERT INTO vehicles (brand, model, year, category, status, seats, description, cover_image)
VALUES
('Renault', 'Master L3H2', 2020, 'van', 'ativo', 10, 'Padrão Ligado Cadeirante 10 Lugares Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-27-at-10.18.24-510x382.jpeg'),
('Renault', 'Master L3H2', 2023, 'van', 'ativo', 10, 'Padrão Ligado Cadeirante 10 Lugares Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-27-at-09.35.07-510x382.jpeg'),
('Renault', 'Master L3H2', 2019, 'van', 'ativo', 16, 'Padrão Ligado Convencional 16 Lugares Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-26-at-15.32.55-510x382.jpeg'),
('Mercedes-Benz', 'Sprinter 417', 2023, 'van', 'ativo', 10, 'Padrão Ligado Cadeirante 10 Lugares Extra Longa Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-26-at-15.34.35-1-510x382.jpeg');

-- FURGÃO
INSERT INTO vehicles (brand, model, year, category, status, description, cover_image)
VALUES
('Renault', 'Master L1H1', 2022, 'furgao', 'ativo', 'Furgão Curto Caminhonete Completo', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/07/WhatsApp-Image-2025-05-14-at-09.58.39-2-510x382.jpeg');

-- MICRO ÔNIBUS
INSERT INTO vehicles (brand, model, year, category, status, seats, description, cover_image)
VALUES
('Volkswagen', 'Mascarello Granmicro 9-160', 2023, 'escolar', 'ativo', 46, 'Micro Ônibus Escolar 46 Lugares Com Ar Condicionado', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/02/WhatsApp-Image-2026-01-07-at-16.04.13-2-510x382.jpeg'),
('Iveco', 'CityClass 70C17', 2013, 'escolar', 'ativo', 30, 'Escolar 30 Lugares Original Ônibus', 'https://zeroutilitarios.com.br/wp-content/uploads/2024/08/WhatsApp-Image-2024-06-27-at-15.51.51-Photoroom-510x382.png');

-- CARROS DE PASSEIO
INSERT INTO vehicles (brand, model, year, category, status, description, cover_image)
VALUES
('Toyota', 'Corolla GLi', 2016, 'passeio', 'ativo', 'Flex 1.8 Automático Completo', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-23-at-15.00.59-510x382.jpeg'),
('Volkswagen', 'Fox G2', 2013, 'passeio', 'ativo', 'Flex 1.0 Manual Completo', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-15.12.52-510x382.jpeg'),
('Nissan', 'Livina X-Gear', 2014, 'passeio', 'ativo', 'Flex 1.8 Automático Completo', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-03-at-14.35.17-510x382.jpeg'),
('Chevrolet', 'Prisma LTZ', 2017, 'passeio', 'ativo', 'Sedan 1.4 Flex Automático Completo', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-03-at-14.31.09-1-510x382.jpeg'),
('Mitsubishi', 'Pajero Sport HPE', 2009, 'passeio', 'ativo', '4x4 Automático Turbo Diesel Completa', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-14.33.07-510x382.jpeg');

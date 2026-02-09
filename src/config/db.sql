CREATE TABLE users (
    username VARCHAR(15) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Table Categories
CREATE TABLE Categories (
    id INT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(20) UNIQUE, -- Hex color code
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT NULL
);

-- 2. Table CertificationTypes
CREATE TABLE CertificationTypes (
    id INT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT NULL
);

-- 3. Table Techs
CREATE TABLE Techs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    iconUrl TEXT, -- URL dari Cloudinary
    color VARCHAR(20) UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT NULL
);

-- 4. Table Projects
CREATE TABLE Projects (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    thumbnailUrl TEXT,
    categoryId INT REFERENCES Categories(id) ON DELETE SET NULL,
    featured BOOLEAN DEFAULT false,
    publishDate DATE,
    projectLinks TEXT[],
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT NULL
);

-- 5. Table Certifications
CREATE TABLE certifications (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    authority VARCHAR(255),
    description TEXT,
    imageUrl TEXT,
    categoryId INT REFERENCES Categories(id) ON DELETE SET NULL,
    certificationTypeId INT REFERENCES CertificationTypes(id) ON DELETE SET NULL,
    featured BOOLEAN DEFAULT false,
    certificationDate DATE,
    credentialLink TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT NULL
);

-- 6. Table Services
CREATE TABLE Services (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    categoryId INT REFERENCES Categories(id) ON DELETE SET NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT NULL
);

-- 7. Table Messages (Contact Form)
CREATE TABLE Messages (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    isRead BOOLEAN DEFAULT false,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relasi Project ke Techs
CREATE TABLE project_techs (
    projectId UUID REFERENCES Projects(id) ON DELETE CASCADE,
    techId INT REFERENCES Techs(id) ON DELETE CASCADE,
    PRIMARY KEY (projectId, techId)
);

INSERT INTO users (username, password) VALUES ('novafajri', '$2b$15$JWE0VpuHCR3dCj00dUoRze03gI.ALNUxgC6DWa9i7OYud2FTDK9Bq');
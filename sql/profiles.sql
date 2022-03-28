-- DROP TABLE IF EXISTS "profile";
CREATE TABLE "profile" (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    pid TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    name TEXT,
    avatar TEXT,
    bio TEXT,
    job TEXT,
    created_at TEXT,
    updated_at TEXT
);

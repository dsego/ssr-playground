CREATE TABLE "member" (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    pid TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    name TEXT,
    avatar TEXT,
    bio TEXT,
    skills TEXT,
    created_at TEXT,
    updated_at TEXT,
    is_active INTEGER DEFAULT 0
);

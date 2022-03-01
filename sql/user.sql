CREATE TABLE "user" (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    pid TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    password TEXT,
    name TEXT,
    avatar TEXT,
    created_at TEXT,
    updated_at TEXT,
    email_verified INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 0
);

INSERT INTO "user" (pid, email,username,password,name,avatar,created_at,updated_at,email_verified,is_active) VALUES
('XlzYXnfhU-Rk', 'patsch@yahoo.com','patschy1','$2a$08$n3rc4rIuM3CA6OZIhLuyKegUVDNhbgjDXfZeL3v3tXh9M577oqO5K','Pat Schaden','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1049.jpg','1645529242581','1645529242581',1,1),
('9ElZzMg8lK0i', 'Dillon.Rutherford10@gmail.com','DillonR.10','$2a$08$n3rc4rIuM3CA6OZIhLuyKegUVDNhbgjDXfZeL3v3tXh9M577oqO5K','Dillon R','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1085.jpg','1645529590803','1645529590803',1,0),
('fHOSdWVr7DFN', 'Porter_Herzog@gmail.com','pherz','$2a$08$n3rc4rIuM3CA6OZIhLuyKegUVDNhbgjDXfZeL3v3tXh9M577oqO5K','Porter H','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/245.jpg','1645529660341','1645529660341',0,1),
('Y5g7KjaOIHdA', 'Sylvia48@hotmail.com','Sylv48','$2a$08$n3rc4rIuM3CA6OZIhLuyKegUVDNhbgjDXfZeL3v3tXh9M577oqO5K','Sylvia','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/397.jpg','1645529709994','1645529709994',0,1);

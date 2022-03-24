import { faker, nanoid, sql, Sqlite } from "./deps.js";
import * as store from "./store.js";

const len = 20;
let n = 0;

while (n < len) {
  const first = faker.name.firstName();
  const last = faker.name.lastName();
  store.members.create({
    pid: nanoid(),
    name: `${first} ${last}`,
    email: faker.internet.email(first, last),
    avatar: faker.image.avatar(),
    bio: faker.lorem.paragraph(),
    job: faker.name.jobType(),
  });
  n += 1;
}

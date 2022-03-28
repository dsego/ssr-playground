import { faker, nanoid } from "./deps.js";

export async function generateFakeProfiles(profileStore, count) {
  let n = 0;
  const promises = []
  while (n < count) {
    const first = faker.name.firstName();
    const last = faker.name.lastName();
    const promise = profileStore.create({
      pid: nanoid(),
      name: `${first} ${last}`,
      email: faker.internet.email(first, last),
      avatar: faker.image.avatar(),
      bio: faker.fake(
        "#### {{lorem.lines(1)}} \n" +
        "{{lorem.paragraph}} \n" +
        "##### {{lorem.lines(1)}} \n\n" +
        "* [{{internet.url}}]({{internet.url}}) \n" +
        "* [{{internet.url}}]({{internet.url}}) \n" +
        "* [{{internet.url}}]({{internet.url}}) \n\n" +
        "##### {{lorem.lines(1)}} \n" +
        "> {{lorem.paragraph}} \n\n" +
        "{{lorem.paragraph}} \n\n"
      ),
      job: faker.name.jobType(),
    });
    n += 1;
    promises.push(promise)
  }
  return Promise.all(promises)
}

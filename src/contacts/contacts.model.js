const fs = require("fs/promises")
const path = require("path")
const uuid = require("uuid")

const contactsPath = path.join(__dirname, "/contacts.json")

const listContacts = async () => {
  const result = await fs.readFile(contactsPath, "utf-8")
  return JSON.parse(result)
}

const getContactById = async (contactId) => {
  const result = await listContacts()
  return result.find((el) => el.id === Number(contactId))
}

const removeContact = async (contactId) => {
  const list = await listContacts()
  const userIndex = list.findIndex((user) => user.id === Number(contactId))

  list.splice(userIndex, 1)

  await fs.writeFile(contactsPath, JSON.stringify(list))
}

const addContact = async (body) => {
  const list = await listContacts()
  const id = uuid.v4()
  const newContact = { id, ...body }
  list.push(newContact)

  await fs.writeFile(contactsPath, JSON.stringify(list))
  return newContact
}

const updateContact = async (contactId, body) => {
  const list = await listContacts()
  const userIndex = list.findIndex((user) => user.id === Number(contactId))

  list[userIndex] = { ...list[userIndex], ...body }

  await fs.writeFile(contactsPath, JSON.stringify(list))
  return list[userIndex]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}

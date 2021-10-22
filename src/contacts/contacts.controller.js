const { NotFound } = require("http-errors")

const Contact = require("./contacts.model")

async function getContacts() {
  return Contact.find()
}

async function getContactById(contactId) {
  const user = await Contact.findById(contactId)
  if (!user) {
    throw new NotFound("User not found")
  }
  return user
}

async function createContact(body) {
  const result = await Contact.create(body)
  return result
}

async function removeContact(contactId) {
  const user = await Contact.findByIdAndRemove(contactId)
  if (!user) {
    throw new NotFound("User not found")
  }
}

async function updateContact(contactId, body) {
  const user = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  })
  if (!user) {
    throw new NotFound("User not found")
  }
  return user
}

module.exports = {
  getContacts,
  getContactById,
  createContact,
  removeContact,
  updateContact,
}

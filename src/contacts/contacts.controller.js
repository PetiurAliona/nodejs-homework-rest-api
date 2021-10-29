const { NotFound } = require("http-errors")

const Contact = require("./contacts.model")

async function getContacts(owner) {
  return Contact.find({ owner })
}

async function getContactById(contactId, owner) {
  const user = await Contact.findOne({ _id: contactId, owner })
  if (!user) {
    throw new NotFound("User not found")
  }
  return user
}

async function createContact(body, owner) {
  const result = await Contact.create({ ...body, owner })
  return result
}

async function removeContact(contactId, owner) {
  const user = await Contact.findOneAndRemove({ _id: contactId, owner })
  if (!user) {
    throw new NotFound("User not found")
  }
}

async function updateContact(contactId, owner, body) {
  const user = await Contact.findOneAndUpdate({ _id: contactId, owner }, body, {
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

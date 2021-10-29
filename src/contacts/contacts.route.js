const express = require("express")
const router = express.Router()

const { validate, validateId } = require("../helpers/validate")
const { authorize } = require("../users/auth.middleware")
const { createContactSchema, updateContactSchema, updateFavoriteContactSchema } = require("./contacts.schema")

const controllerContacts = require("./contacts.controller")

router.get("/", authorize, async (req, res, next) => {
  try {
    const contacts = await controllerContacts.getContacts(req.user._id)
    return res.status(200).send(contacts)
  } catch (err) {
    next(err)
  }
})

router.get("/:contactId", authorize, validateId, async (req, res, next) => {
  try {
    const contact = await controllerContacts.getContactById(req.params.contactId, req.user._id)
    return res.status(200).send(contact)
  } catch (err) {
    next(err)
  }
})

router.post("/", authorize, validate(createContactSchema), async (req, res, next) => {
  try {
    const newContact = await controllerContacts.createContact(req.body, req.user._id)
    return res.status(201).send(newContact)
  } catch (err) {
    next(err)
  }
})

router.delete("/:contactId", authorize, validateId, async (req, res, next) => {
  try {
    await controllerContacts.removeContact(req.params.contactId, req.user._id)
    return res.status(200).send({ message: "contact deleted" })
  } catch (err) {
    next(err)
  }
})

router.patch("/:contactId", authorize, validate(updateContactSchema), validateId, async (req, res, next) => {
  try {
    const updatedContact = await controllerContacts.updateContact(req.params.contactId, req.user._id, req.body)
    return res.status(200).send(updatedContact)
  } catch (err) {
    next(err)
  }
})

router.patch("/:contactId/favorite", validate(updateFavoriteContactSchema), validateId, async (req, res, next) => {
  try {
    const updatedContact = await controllerContacts.updateContact(req.params.contactId, req.user._id, req.body)
    return res.status(200).send(updatedContact)
  } catch (err) {
    next(err)
  }
})

module.exports = router

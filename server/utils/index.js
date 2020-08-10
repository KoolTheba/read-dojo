const successHandler = (res, payload) => res.status(200).json(payload)
const errorsDescription = {
  notFound: { status: 404, message: 'not found' },
  genericError: { status: 400, message: 'failed to get resources' }
}

module.exports = {
  successHandler,
  errorsDescription
}

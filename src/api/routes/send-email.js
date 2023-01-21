import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    TemplateId: Validator.required(),
    From: Validator.string().required(),
    To: Validator.string().required(),
    TemplateModel: Validator.object().optional().default({}),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const postmarkService = req.scope.resolve("postmarkService")
    await postmarkService.sendEmail(
      value.template_id,
      value.to,
      value.data
    )
    res.sendStatus(200)
  } catch (err) {
    throw err
  }
}

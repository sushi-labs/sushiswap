import { CreateStreamFormDataTransformed, CreateStreamFormDataValidated } from 'features/stream/CreateForm/types'

type TransformStreamFormData = (x: CreateStreamFormDataValidated) => CreateStreamFormDataTransformed

export const transformStreamFormData: TransformStreamFormData = (payload) => {
  const { startDate, endDate } = payload

  const _startDate = new Date(startDate)
  const _endDate = new Date(endDate)

  return {
    ...payload,
    startDate: _startDate,
    endDate: _endDate,
  }
}

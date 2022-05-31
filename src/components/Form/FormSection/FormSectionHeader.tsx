import Typography from 'app/components/Typography'
import React, { FC } from 'react'

export interface FormSectionHeaderProps {
  header: string
  subheader?: string
}

const FormSectionHeader: FC<FormSectionHeaderProps> = ({ header, subheader }) => {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <Typography variant="lg" className="text-high-emphesis" weight={700}>
          {header}
        </Typography>
        {subheader && (
          <Typography variant="sm" weight={400}>
            {subheader}
          </Typography>
        )}
      </div>
    </div>
  )
}

export default FormSectionHeader

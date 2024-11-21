import React from 'react'
import { Textarea } from "@/components/ui/textarea"

function AdditionalRequirements({additionalRequirementInput}) {
  return (
    <div className='mt-5'>
        <label className='text-gray-400 '>Additional Requirements(Optional)</label>
        <Textarea className='mt-3' onChange={(e)=>additionalRequirementInput(e.target.value)}/>
    </div>
  )
}

export default AdditionalRequirements
import { supabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

import {
  CheckAnswer,
  PrivateSoundTestInfo,
  ValidateAnswerErrorResponse,
  ValidateAnswerResponse
} from '@/types'

function checkAnswer(correctAnswer: string, guess: string): CheckAnswer {
  return {
    isCorrect: guess === correctAnswer,
    correctAnswer: correctAnswer
  }
}

export default async function ValidateAnswer(
  req: NextApiRequest,
  res: NextApiResponse<ValidateAnswerResponse | ValidateAnswerErrorResponse>
) {
  const { keycapMaterial, plateMaterial, keyboard, keyswitch } = req.body

  try {
    if (typeof keycapMaterial !== 'string')
      throw new Error('expected keycapMaterial to be a string')
    if (typeof plateMaterial !== 'string')
      throw new Error('expected plateMaterial to be a string')
    if (typeof keyboard !== 'string')
      throw new Error('expected keyboard to be a string')
    if (typeof keyswitch !== 'string')
      throw new Error('expected keyswitch to be a string')
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ status: 400, error: err.message })
    }
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    timeZone: 'UTC'
  })

  const { data: correctAnswers } = await supabaseServerClient({ req, res })
    .from<PrivateSoundTestInfo>('sound_test')
    .select(
      `
      keyboard_id,
      plate_material_id,
      keycap_material_id,
      keyswitch_id
    `
    )
    // @ts-expect-error
    .eq('featured_on', currentDate)
    .limit(1)
    .single()

  if (!correctAnswers) {
    return res
      .status(500)
      .json({ status: 500, error: 'failed to retrieve correct answers' })
  }

  const defaultGrade = {
    keyboard_id: null,
    plate_material_id: null,
    keycap_material_id: null,
    keyswitch_id: null,
    totalPoints: 0
  }

  function checkAnswerReducer(
    accumulator: ValidateAnswerResponse,
    current: [string, string]
  ) {
    const [component, correctAnswer] = current

    switch (component) {
      case 'keyboard_id':
        accumulator[component] = checkAnswer(correctAnswer, keyboard)
        break
      case 'plate_material_id':
        accumulator[component] = checkAnswer(correctAnswer, plateMaterial)
        break
      case 'keycap_material_id':
        accumulator[component] = checkAnswer(correctAnswer, keycapMaterial)
        break
      case 'keyswitch_id':
        accumulator[component] = checkAnswer(correctAnswer, keyswitch)
        break
      default:
        console.error(`unhandled component type: ${component}`)
        return defaultGrade
    }

    accumulator.totalPoints += accumulator[component]?.isCorrect ? 2 : 0

    return accumulator
  }

  const grades = Object.entries(correctAnswers).reduce(
    checkAnswerReducer,
    defaultGrade
  )

  res.json(grades)
}

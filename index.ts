#!usr/bin/env bun

import * as p from '@clack/prompts'
import color from 'picocolors'
import {setTimeout} from 'timers/promises'
import shuffle from 'lodash.shuffle'

let SCORE = 0

interface option{
  value:string,
  label:string
}

class Question{
  question: string;
  answersArray: string[];
  correctAnswer: string;
  
  constructor(question:string,answerArray:string[],correctAnswer:string){
    this.question = question
    this.answersArray = answerArray
    this.correctAnswer = correctAnswer
  }
}

const questions = async(): Promise<Question[]> => {
  const result = await fetch("https://opentdb.com/api.php?amount=5&category=18&type=multiple")
  const data:any = await result.json()
  
  return data.results.map((q: any) => {
    const answerArray = shuffle([...q.incorrect_answers, q.correct_answer])
    return new Question(q.question, answerArray, q.correct_answer)
  })
}

async function askQuestion(question:string, answerArray:string[], correctAnswer:string){
  const options:option[] = []
  answerArray.forEach((answer)=>{
    options.push({value:answer, lable:answer})
  })
  const answer = await p.select({
    message: question,
    options: options,
    initialValue: '1'
  })
  
  const s = p.spinner()
  s.start()
  await setTimeout(500)
  s.stop()
  
  if (answer === correctAnswer){
    SCORE++
  }
}

async function main(){
  p.intro('hello')
  
  const questionsList = await questions()
  for (const question of questionsList){
    await askQuestion(question.question, question.answersArray, question.correctAnswer)
  }
  
  p.note(`your score is ${SCORE}`)
  p.outro('bye')
}

main()
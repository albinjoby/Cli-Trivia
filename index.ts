#!usr/bin/env bun

import * as p from '@clack/prompts'
import color from 'picocolors'
import {setTimeout} from 'timers/promises'
import shuffle from 'lodash.shuffle'

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
  const data = await result.json()
  
  return data.results.map((q: any) => {
    const answerArray = shuffle([...q.incorrect_answers, q.correct_answer])
    return new Question(q.question, answerArray, q.correct_answer)
  })
}

console.log(await questions())
import OpenAI from 'openai';
const model = "gpt-3.5-turbo-0125"



const formQuestion = prompt => {
  const question = `Create a echart config with the following characteristics:
  ${prompt}
    return json with a valid echart configuration
    `
  return question
}


const askQuestion = async ({ formedQuestion, apiKey }) => {


  const openai = new OpenAI({
    apiKey
  });
  const completions = await openai.chat.completions.create({
    messages: [{ "role": "user", "content": formedQuestion }],
    model,
    response_format: { "type": "json_object" },
    temperature: 0,
  });
  const { choices, usage } = completions
  return { choices, usage }
}


const answerMyQuestion = async ({ prompt, apiKey }) => {
  const formedQuestion = formQuestion(prompt)
  const { choices } = await askQuestion({ formedQuestion, apiKey })
  return JSON.parse(choices[0].message.content)

}
export const handler = async (event) => {
  console.log('event', event.body);
  const { apiKey, prompt } = JSON.parse(event.body)
  const res = await answerMyQuestion({ prompt, apiKey })
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(res),
  };
};
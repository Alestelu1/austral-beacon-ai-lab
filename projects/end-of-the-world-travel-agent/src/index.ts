import { answerTravelQuestion } from "./application/answerTravelQuestion.js";

const question = process.argv.slice(2).join(" ") || "¿Cómo llegar desde Santiago a Puerto Williams?";
const answer = answerTravelQuestion(question);

console.log(JSON.stringify(answer, null, 2));

export { answerTravelQuestion } from "./application/answerTravelQuestion.js";
export type { TravelAnswer, DestinationCardAnswer } from "./domain/types.js";

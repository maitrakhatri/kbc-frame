/** @jsxImportSource frog/jsx */
// ---cut---
import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

//State Management setup
type State = {
  count: number;
  points: number;
  quizEnd: boolean;
  wrongAnswer: boolean;
};

export const app = new Frog<{ State: State }>({
  assetsPath: "/",
  basePath: "/api",
  title: "Kaun Banega Cororepati",
  //State Management setup
  initialState: {
    count: 0,
    points: 0,
    quizEnd: false,
    wrongAnswer: false,
  },
});

const questions = [
  {
    question: "Which platform supports frames ?",
    options: ["Twiiter", "TikTok", "Warpcast", "Instagram"],
    answer: "Warpcast",
  },
  {
    question: "The frame that you see is ?",
    options: ["Image", "HTML CSS", "WebApp", "GIF"],
    answer: "Image",
  },
  {
    question: "Which color is a mix of red and blue?",
    options: ["Green", "Purple", "Orange", "Yellow"],
    answer: "Purple",
  },
  {
    question: "Which shape has four equal sides?",
    options: ["Circle", "Triangle", "Square", "Rectangle"],
    answer: "Square",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    question: "How many days are in a leap year?",
    options: ["365", "366", "364", "360"],
    answer: "366",
  },
];

//need functions to return string values
//because we directly can not access arrays or objects in the frame function
const getQuestion = (index: number) => {
  return questions[index]?.question;
};

const getOptions = (questionNumber: number, index: number) => {
  return questions[questionNumber]?.options[index];
};

const getAnswer = (index: number) => {
  return questions[index]?.answer;
};

app.frame("/", (c) => {
  const { buttonValue, deriveState, status } = c;

  //state update set-up, runs on every interaction
  const state = deriveState((previousState) => {
    if (previousState.count > questions.length - 2) {
      previousState.quizEnd = true;
    }
    if (buttonValue === getAnswer(previousState.count)) {
      previousState.count++;
      previousState.points = previousState.points + 50;
      return;
    }
    if (buttonValue !== getAnswer(previousState.count)) {
      if (buttonValue === "play") return;
      previousState.quizEnd = true;
      previousState.wrongAnswer = true;
    }
  });

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(to right, #432889, #17101F)",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        {status === "initial" && (
          <div
            style={{
              color: "white",
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
              display: "flex",
            }}
          >
            Kaun Banega Cororepati
          </div>
        )}
        {status !== "initial" && !state.quizEnd && (
          <div
            style={{
              color: "white",
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
              display: "flex",
            }}
          >
            {getQuestion(state.count)}
          </div>
        )}

        {state.quizEnd && state.wrongAnswer && status !== "initial" && (
          <div
            style={{
              color: "white",
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
              display: "flex",
            }}
          >
            Opps !! Wrong Answer :(
          </div>
        )}

        {state.quizEnd && !state.wrongAnswer && status !== "initial" && (
          <div
            style={{
              color: "white",
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
              display: "flex",
            }}
          >
            Congratulations !!
          </div>
        )}

        {status !== "initial" && (
          <div
            style={{
              color: "white",
              fontSize: 30,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
              display: "flex",
            }}
          >
            Points: {String(state.points)}
          </div>
        )}
      </div>
    ),
    intents: [
      status === "initial" && <Button value="play">Let's Play</Button>,
      !state.quizEnd && status !== "initial" && (
        <Button value={getOptions(state.count, 0)}>
          {getOptions(state.count, 0)}
        </Button>
      ),
      !state.quizEnd && status !== "initial" && (
        <Button value={getOptions(state.count, 1)}>
          {getOptions(state.count, 1)}
        </Button>
      ),
      !state.quizEnd && status !== "initial" && (
        <Button value={getOptions(state.count, 2)}>
          {getOptions(state.count, 2)}
        </Button>
      ),
      !state.quizEnd && status !== "initial" && (
        <Button value={getOptions(state.count, 3)}>
          {getOptions(state.count, 3)}
        </Button>
      ),
      status !== "initial" && (state.quizEnd || state.wrongAnswer) && (
        <Button.Reset>Play again</Button.Reset>
      ),
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

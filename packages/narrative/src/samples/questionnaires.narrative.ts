import {
  command,
  data,
  defineCommand,
  defineEvent,
  defineState,
  describe,
  example,
  experience,
  gql,
  it,
  query,
  rule,
  scene,
  sink,
  source,
  specs,
} from '@onauto/narrative';

const QuestionnaireLinkSent = defineEvent<{
  questionnaireId: string;
  participantId: string;
  link: string;
  sentAt: Date;
}>('QuestionnaireLinkSent');

const QuestionAnswered = defineEvent<{
  questionnaireId: string;
  participantId: string;
  questionId: string;
  answer: unknown;
  savedAt: Date;
}>('QuestionAnswered');

const QuestionnaireSubmitted = defineEvent<{
  questionnaireId: string;
  participantId: string;
  submittedAt: Date;
}>('QuestionnaireSubmitted');

const QuestionnaireEditRejected = defineEvent<{
  questionnaireId: string;
  participantId: string;
  reason: string;
  attemptedAt: Date;
}>('QuestionnaireEditRejected');

const AnswerQuestion = defineCommand<{
  questionnaireId: string;
  participantId: string;
  questionId: string;
  answer: unknown;
}>('AnswerQuestion');

const SubmitQuestionnaire = defineCommand<{
  questionnaireId: string;
  participantId: string;
}>('SubmitQuestionnaire');

const QuestionnaireConfig = defineState<{
  questionnaireId: string;
  numberOfQuestions: number;
}>('QuestionnaireConfig');

const QuestionnaireProgress = defineState<{
  questionnaireId: string;
  participantId: string;
  status: 'in_progress' | 'ready_to_submit' | 'submitted';
  currentQuestionId: string | null;
  remainingQuestions: string[];
  answers: { questionId: string; value: unknown }[];
}>('QuestionnaireProgress');

scene('Questionnaires', 'Q9m2Kp4Lx', () => {
  experience('Homepage', 'H1a4Bn6Cy').client(() => {
    it('show a hero section with a welcome message');
    it('allow user to start the questionnaire');
  });

  query('views the questionnaire', 'V7n8Rq5M')
    .server(() => {
      specs(() => {
        rule('questionnaires show current progress', 'r1A3Bp9W', () => {
          example('a question has already been answered')
            .given(QuestionnaireLinkSent, 'the questionnaire link was sent', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              link: 'https://app.example.com/q/q-001?participant=participant-abc',
              sentAt: new Date('2030-01-01T09:00:00Z'),
            })
            .when(QuestionAnswered, 'a question is answered', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              questionId: 'q1',
              answer: 'Yes',
              savedAt: new Date('2030-01-01T09:05:00Z'),
            })
            .then(QuestionnaireProgress, 'the progress reflects the answered question', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              status: 'in_progress',
              currentQuestionId: 'q2',
              remainingQuestions: ['q2', 'q3'],
              answers: [{ questionId: 'q1', value: 'Yes' }],
            });
          example('no questions have been answered yet')
            .given(QuestionnaireLinkSent, 'the questionnaire link was sent', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              link: 'https://app.example.com/q/q-001?participant=participant-abc',
              sentAt: new Date('2030-01-01T09:00:00Z'),
            })
            .then(QuestionnaireProgress, 'the progress shows the first question as current', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              status: 'in_progress',
              currentQuestionId: 'q1',
              remainingQuestions: ['q1', 'q2', 'q3'],
              answers: [],
            });
        });
      });
      data([source().state('QuestionnaireProgress').fromProjection('Questionnaires', 'questionnaire-participantId')]);
    })
    .request(gql`
      query QuestionnaireProgress($participantId: ID!) {
        questionnaireProgress(participantId: $participantId) {
          questionnaireId
          participantId
          currentQuestionId
          remainingQuestions
          status
          answers {
            questionId
            value
          }
        }
      }
    `)
    .client(() => {
      describe('Questionnaire Progress', () => {
        it('focus on the current question based on the progress state');
        it('display the list of answered questions');
        it('display the list of remaining questions');
        it('show a progress indicator that is always visible as the user scrolls');
      });
    });

  command('submits a questionnaire answer', 'S4j6Nt8Z')
    .server(() => {
      specs(() => {
        rule('answers are allowed while the questionnaire has not been submitted', 'r2D5Eq0Y', () => {
          example('no questions have been answered yet')
            .when(AnswerQuestion, 'the user answers the first question', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              questionId: 'q1',
              answer: 'Yes',
            })
            .then(QuestionAnswered, 'the answer is recorded', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              questionId: 'q1',
              answer: 'Yes',
              savedAt: new Date('2030-01-01T09:05:00Z'),
            });

          example('all questions have already been answered and submitted')
            .given(QuestionnaireSubmitted, 'the questionnaire was submitted earlier', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              submittedAt: new Date('2030-01-01T09:00:00Z'),
            })
            .when(AnswerQuestion, 'the user tries to answer after submission', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              questionId: 'q1',
              answer: 'Yes',
            })
            .then(QuestionnaireEditRejected, 'the edit is rejected', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              reason: 'Questionnaire already submitted',
              attemptedAt: new Date('2030-01-01T09:05:00Z'),
            });
        });
      });
      data([
        sink().event('QuestionAnswered').toStream('questionnaire-participantId'),
        sink().event('QuestionnaireEditRejected').toStream('questionnaire-participantId'),
      ]);
    })
    .request(gql`
      mutation AnswerQuestion($input: AnswerQuestionInput!) {
        answerQuestion(input: $input) {
          success
        }
      }
    `)
    .client(() => {
      describe('Submissions', () => {
        it('displays a success message when the answer is submitted');
        it('display an error message when the answer submission is rejected');
      });
    });

  query('questionnaire ready for submission', 'R3f7Hu1X')
    .server(() => {
      specs(() => {
        rule('questionnaire is ready for submission when all questions are answered', 'r3G8Iv2W', () => {
          example('all questions have been answered')
            .given(QuestionnaireConfig, 'the questionnaire has 2 questions', {
              questionnaireId: 'q-001',
              numberOfQuestions: 2,
            })
            .and(QuestionnaireLinkSent, 'the link was sent', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              link: 'https://app.example.com/q/q-001?participant=participant-abc',
              sentAt: new Date('2030-01-01T09:00:00Z'),
            })
            .and(QuestionAnswered, 'the first question was answered', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              questionId: 'q1',
              answer: 'Yes',
              savedAt: new Date('2030-01-01T09:05:00Z'),
            })
            .and(QuestionAnswered, 'the second question was answered', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              questionId: 'q2',
              answer: 'No',
              savedAt: new Date('2030-01-01T09:05:00Z'),
            })
            .then(QuestionnaireProgress, 'the questionnaire is ready for submission', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              status: 'ready_to_submit',
              currentQuestionId: null,
              remainingQuestions: [],
              answers: [
                { questionId: 'q1', value: 'Yes' },
                { questionId: 'q2', value: 'No' },
              ],
            });
          example('some questions are still unanswered')
            .given(QuestionnaireLinkSent, 'the link was sent', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              link: 'https://app.example.com/q/q-001?participant=participant-abc',
              sentAt: new Date('2030-01-01T09:00:00Z'),
            })
            .when(QuestionAnswered, 'the first question is answered', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              questionId: 'q1',
              answer: 'Yes',
              savedAt: new Date('2030-01-01T09:05:00Z'),
            })
            .then(QuestionnaireProgress, 'the progress shows some questions remaining', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              status: 'in_progress',
              currentQuestionId: 'q2',
              remainingQuestions: ['q2', 'q3'],
              answers: [{ questionId: 'q1', value: 'Yes' }],
            });
        });
      });
      data([
        source().state('QuestionnaireProgress').fromProjection('Questionnaires', 'questionnaire-participantId'),
        source().state('QuestionnaireConfig').fromDatabase('QuestionnaireConfigAPI'),
      ]);
    })
    .request(gql`
      query QuestionnaireProgress($participantId: ID!) {
        questionnaireProgress(participantId: $participantId) {
          questionnaireId
          participantId
          status
          currentQuestionId
          remainingQuestions
          answers {
            questionId
            value
          }
        }
      }
    `)
    .client(() => {
      describe('Submission Readiness', () => {
        it('enable the submit button when all questions are answered');
        it('disable the submit button when all questions have not been answered');
      });
    });

  command('submits the questionnaire', 'T5k9Jw3V')
    .server(() => {
      specs(() => {
        rule('questionnaire allowed to be submitted when all questions are answered', 'r4H0Lx4U', () => {
          example('submits the questionnaire successfully')
            .when(SubmitQuestionnaire, 'the user submits the questionnaire', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
            })
            .then(QuestionnaireSubmitted, 'the questionnaire is submitted', {
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              submittedAt: new Date('2030-01-01T09:00:00Z'),
            });
        });
      });
      data([sink().event('QuestionnaireSubmitted').toStream('questionnaire-participantId')]);
    })
    .request(gql`
      mutation SubmitQuestionnaire($input: SubmitQuestionnaireInput!) {
        submitQuestionnaire(input: $input) {
          success
        }
      }
    `)
    .client(() => {
      describe('Submission Confirmation', () => {
        it('display a confirmation message upon successful submission');
      });
    });
});

// notifications are updated
// they are taken back home
// homepage status shows "Pre-Registration Complete"

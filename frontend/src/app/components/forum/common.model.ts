export interface Content {
  _id: String;
  posttype: String;
  userid: String;
  statsvisible: Boolean;
  multiplechoice: Boolean;
  content: String;
  likes: Number;
  comments: Number;
  inspiredby: [String];
  tags: String;
  choices: string[];
  bestAnswer: String;
  width: [Number];
}
export interface AnswerResponseModel {
  answer: String;
  upvotes: Number;
  downvotes: Number;
  userID: String;
  questionID: String;
}
export interface CommentModel {
  postId: String;
  comment: String;
}
export interface VoteModel {
  postId: String;
  voteId: String;
  voteType: String;
}
export interface CommentModelGet {
  comments: [
    {
      comment: String;
      userId: String;
    }
  ];
  postId: String;
}

export interface AnswersModelGet {
  answers: [
    {
      answer: String;
      userId: String;
      upvotes: Number;
      downvotes: Number;
      upvoted: boolean;
      downvoted: boolean;
    }
  ];
  postId: String;
}

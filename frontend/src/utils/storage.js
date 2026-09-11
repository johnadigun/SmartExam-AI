export const saveAnswers = (examId, answers) => {
  localStorage.setItem(`exam_${examId}`, JSON.stringify(answers));
};

export const loadAnswers = (examId) => {
  return JSON.parse(localStorage.getItem(`exam_${examId}`)) || [];
};

export const clearAnswers = (examId) => {
  localStorage.removeItem(`exam_${examId}`);
};
function getGrade(score, total) {
  const percent = (score / total) * 100;

  let grade = "F";

  if (percent >= 70) grade = "A";
  else if (percent >= 60) grade = "B";
  else if (percent >= 50) grade = "C";
  else if (percent >= 45) grade = "D";
  else if (percent >= 40) grade = "E";

  return {
    percent: percent.toFixed(2),
    grade,
  };
}

module.exports = { getGrade };
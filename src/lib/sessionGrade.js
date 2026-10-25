export function gradeLabel(grade) {
  if (grade >= 5) return "Excellent";
  if (grade >= 4) return "Good";
  if (grade >= 3) return "Okay";
  return "Needs work";
}

export function buildTurnGrades(messages) {
  const turns = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (m.role !== "assistant" || typeof m.grade !== "number") continue;
    let userIndex = -1;
    for (let j = i - 1; j >= 0; j--) {
      if (messages[j].role === "user") {
        userIndex = j;
        break;
      }
    }
    let suggested = null;
    for (let j = userIndex - 1; j >= 0; j--) {
      if (messages[j].role === "assistant") {
        suggested = messages[j].suggested_reply ?? null;
        break;
      }
    }
    turns.push({
      grade: m.grade,
      score: m.grade * 20,
      label: gradeLabel(m.grade),
      rationale: m.rationale ?? "",
      userReply: userIndex >= 0 ? (messages[userIndex].content ?? "").trim() : "",
      suggested,
    });
  }
  return turns;
}

export function computeSessionGrade(messages) {
  const turnGrades = buildTurnGrades(messages);

  if (turnGrades.length === 0) {
    return {
      score: null,
      grade: "—",
      headline: "Thanks for practicing",
      feedback: ["Reply to the character to get graded turns."],
      turnGrades,
    };
  }

  const avg = turnGrades.reduce((sum, t) => sum + t.grade, 0) / turnGrades.length;
  const score = Math.round(avg * 20);

  let grade;
  let headline;
  if (score >= 92) {
    grade = "A+";
    headline = "Excellent replies";
  } else if (score >= 84) {
    grade = "A";
    headline = "Strong conversation";
  } else if (score >= 76) {
    grade = "B+";
    headline = "Good replies";
  } else if (score >= 68) {
    grade = "B";
    headline = "Solid effort";
  } else if (score >= 58) {
    grade = "C+";
    headline = "Getting closer";
  } else if (score >= 40) {
    grade = "C";
    headline = "Nice effort — keep going";
  } else {
    grade = "D";
    headline = "Thanks for practicing";
  }

  return {
    score,
    grade,
    headline,
    feedback: [],
    turnGrades,
  };
}

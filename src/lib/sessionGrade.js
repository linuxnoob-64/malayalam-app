import { similarityLabel } from "./replySimilarity.js";

function effectiveSimilarity(check) {
  if (check.similarity != null) return check.similarity;
  const replied = (check.userReply ?? "").trim();
  const target = (check.expectedManglish ?? check.expectedMl ?? "").trim();
  if (replied && target) return 35;
  if (replied) return 28;
  return null;
}

/**
 * Grade from how closely user replies matched each turn's suggested_reply.
 */
export function computeSessionGrade(stats, meta = {}) {
  const checks = stats.replyChecks ?? [];
  const turns = stats.turns ?? 0;

  const effective = checks
    .map((c) => ({ ...c, similarity: effectiveSimilarity(c) }))
    .filter((c) => c.similarity != null);

  let avgSimilarity = 0;
  if (effective.length > 0) {
    avgSimilarity = Math.round(
      effective.reduce((sum, c) => sum + c.similarity, 0) / effective.length,
    );
  }

  let score = effective.length > 0 ? avgSimilarity : turns > 0 ? 48 : 0;

  const strong = effective.filter((c) => c.similarity >= 65).length;
  const weak = effective.filter((c) => c.similarity < 20).length;
  score += Math.min(strong * 2, 10);
  score -= Math.min(weak * 2, 6);

  if (meta.finishedNaturally) score += 5;
  else if (turns >= 4) score += 2;

  score = Math.max(0, Math.min(100, Math.round(score)));

  if (turns >= 1) {
    score = Math.max(score, 32);
  }

  let grade = "C";
  let headline = "Keep practicing";
  if (score >= 92) {
    grade = "A+";
    headline = "Replies matched very well";
  } else if (score >= 84) {
    grade = "A";
    headline = "Strong speaking match";
  } else if (score >= 76) {
    grade = "B+";
    headline = "Good reply accuracy";
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
    grade = "C";
    headline = "Thanks for practicing";
  }

  const feedback = [];
  if (effective.length > 0) {
    feedback.push(`Average match to suggested replies: ${avgSimilarity}%.`);
    const best = [...effective].sort((a, b) => b.similarity - a.similarity)[0];
    const worst = [...effective].sort((a, b) => a.similarity - b.similarity)[0];
    if (best) {
      feedback.push(`Best turn: ${best.similarity}% · ${similarityLabel(best.similarity)}`);
    }
    if (worst && worst.similarity < 55 && worst !== best) {
      feedback.push(
        `Hardest turn: ${worst.similarity}% · you said "${truncate(worst.userReply)}" · target "${truncate(worst.expectedManglish || worst.expectedMl)}"`,
      );
    }
  } else if (turns > 0) {
    feedback.push("You replied in every turn — great practice. Match the hint phrase for a higher score next time.");
  }

  if (stats.hintsUsed > 0 && effective.length > 0) {
    const avgWithHints = effective.filter((c) => c.hintLevel > 0);
    if (avgWithHints.length) {
      const hintAvg = Math.round(
        avgWithHints.reduce((s, c) => s + c.similarity, 0) / avgWithHints.length,
      );
      feedback.push(`After using hints, your match averaged ${hintAvg}% on those turns.`);
    }
  }

  if (!meta.finishedNaturally && turns > 0 && turns < 8) {
    feedback.push("Finish all 8 turns to boost your session score.");
  }

  return {
    score,
    grade,
    headline,
    feedback,
    avgSimilarity,
    replyChecks: checks,
  };
}

function truncate(s, max = 42) {
  const t = (s ?? "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

const db = require('../connection/connection');

function checkValidity(student_id, subject_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM exam_results WHERE student_id = ? AND subject_id = ?";
    db.query(query, [student_id, subject_id], (err, results) => {
      if (err) return reject("Database error");
      if (results.length > 0) return reject("You have already taken the exam");
      resolve(true);
    });
  });
}

const submitExam = async (req, res) => {
  const { student_id, subject_id, answers } = req.body;

  if (!student_id || !subject_id || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // ✅ Check if student already took exam
    await checkValidity(student_id, subject_id);

    // ✅ Fetch questions
    const questions = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM questions WHERE subject_id = ?", [subject_id], (err, results) => {
        if (err) reject("Database error");
        else resolve(results);
      });
    });

    let score = 0;
    const totalQuestions = questions.length;
    const answerRecords = [];

    answers.forEach((ans) => {
      const q = questions.find((q) => q.question_id === ans.question_id);
      if (!q) return;

      const isCorrect = q.correct_option === ans.chosen_option;
      if (isCorrect) score++;

      answerRecords.push({
        question_id: q.question_id,
        chosen_option: ans.chosen_option,
        is_correct: isCorrect,
      });
    });

    const percentage = ((score / totalQuestions) * 100).toFixed(2);

    // ✅ Save exam result
    const result_id = await new Promise((resolve, reject) => {
      const insertResult = `
        INSERT INTO exam_results (student_id, subject_id, score, total_questions, percentage)
        VALUES (?,?,?,?,?)
      `;
      db.query(insertResult, [student_id, subject_id, score, totalQuestions, percentage], (err, result) => {
        if (err) reject("Database error");
        else resolve(result.insertId);
      });
    });

    // ✅ Save student answers
    if (answerRecords.length > 0) {
      const insertAnswers = `
        INSERT INTO exam_answers (result_id, question_id, chosen_option, is_correct)
        VALUES ?
      `;
      const values = answerRecords.map((a) => [
        result_id,
        a.question_id,
        a.chosen_option,
        a.is_correct,
      ]);

      await new Promise((resolve, reject) => {
        db.query(insertAnswers, [values], (err) => {
          if (err) reject("Database error");
          else resolve();
        });
      });
    }

    return res.status(201).json({
      message: "Exam submitted successfully",
      score,
      totalQuestions,
      percentage,
    });

  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

module.exports = {
  submitExam,
};

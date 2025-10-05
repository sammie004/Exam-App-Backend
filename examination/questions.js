const db = require('../connection/connection');

// ✅ Get questions by subject + department
// backend getBySubject
const getBySubject = (req, res) => {
    const { subject_id, department } = req.params;

    const query = `
        SELECT q.question_id, q.question_text, q.options, q.correct_option, 
               s.name AS subject_name, s.code AS subject_code, s.department
        FROM questions q
        JOIN subjects s ON q.subject_id = s.subject_id
        WHERE q.subject_id = ? AND s.department = ?
        ORDER BY RAND()
        LIMIT 10
    `;

    db.query(query, [subject_id, department], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No questions found" });
        }

        const subject = {
            name: results[0].subject_name,
            code: results[0].subject_code,
        };

        return res.status(200).json({ questions: results, subject });
    });
};


// ✅ General search for all questions (with subject + dept info)
const getAllQuestions = (req, res) => {
    const query = `
        SELECT q.question_id, q.question_text, q.options, q.correct_option, 
               s.name AS subject_name, s.department
        FROM questions q
        JOIN subjects s ON q.subject_id = s.subject_id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No questions found in the database" });
        } else {
            return res.status(200).json(results);
        }
    });
};

// ✅ Function to check number of questions per subject
function Check(subject_id, callback) {
    const query = "SELECT COUNT(*) AS total FROM questions WHERE subject_id = ?";
    db.query(query, [subject_id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return callback(err, null);
        }

        const total = results[0].total;
        const maxQuestions = 60;

        if (total >= maxQuestions) {
            console.log("Maximum number of questions reached for this subject");
            return callback("Maximum number of questions reached", null);
        }

        return callback(null, true);
    });
}

// ✅ Create a single question
const create = (req, res) => {
    const { subject_id, question_text, options, correct_option } = req.body;
    if (!subject_id || !question_text || !options || !correct_option) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    Check(subject_id, (err, ok) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        // Prevent duplicates
        const checkDuplicate = "SELECT * FROM questions WHERE subject_id = ? AND question_text = ?";
        db.query(checkDuplicate, [subject_id, question_text], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: "Question already exists" });
            }

            // Insert question
            const query = `
                INSERT INTO questions (subject_id, question_text, options, correct_option) 
                VALUES (?, ?, ?, ?)
            `;
            db.query(
                query,
                [subject_id, question_text, JSON.stringify(options), correct_option],
                (err, results) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ message: "Database error" });
                    }
                    return res.status(201).json({ message: "Question created successfully" });
                }
            );
        });
    });
};

// ✅ Create multiple questions in bulk
const createBulk = (req, res) => {
    const { questions } = req.body;
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'Questions array is required' });
    }

    const subject_id = questions[0].subject_id;

    Check(subject_id, (err, ok) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        const values = questions.map((q) => [
            q.subject_id,
            q.question_text,
            JSON.stringify(q.options),
            q.correct_option,
        ]);

        const query = `
            INSERT INTO questions (subject_id, question_text, options, correct_option) VALUES ?
        `;
        db.query(query, [values], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            return res.status(201).json({ message: "Questions created successfully" });
        });
    });
};

module.exports = {
    getBySubject,
    getAllQuestions,
    create,
    createBulk
};

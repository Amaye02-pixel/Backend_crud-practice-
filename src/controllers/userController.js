const pool = require("../db");

exports.createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const result = await pool.query(
            "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//Get all users (GET)
exports.getUsers = async (req, res) => {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
};

//Get user by ID (GET)
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    const result = await pool.query(
        "SELECT * FROM users WHERE id=$1",
        [id]
    );

    if (result.rows.length === 0)
        return res.status(404).json({ message: "User not found" });

    res.json(result.rows[0]);
};

//Update user (PUT)
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const result = await pool.query(
        "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
        [name, email, id]
    );

    res.json(result.rows[0]);
};

//Delete user (DELETE)
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.json({ message: "User deleted" });
};

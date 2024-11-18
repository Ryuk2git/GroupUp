import sequelize from "../config/database.js";

export const fetchProjects = async (req, res) => {
    const userID = req.params.userID;
    const token = req.headers['x-auth-token'];
    console.log('token in controller', token);

    if(!token){
        console.log("Token is missing!");
        return res.status(401).json({ error: 'Token is missing.' });
    }

    try {

        const rawQuery = `
            SELECT * 
            FROM projects 
            WHERE ownerId = :userID;

        `;
        const projects = await sequelize.query(rawQuery, {
            replacements: { userID }, // Parameterized query for security
            type: sequelize.QueryTypes.SELECT, // Specify SELECT query
        });
        return res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ error: "An error occurred while fetching projects." });
    }
};
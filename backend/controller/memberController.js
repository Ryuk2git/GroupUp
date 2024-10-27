import { getMembers } from '../services/memberService.js';

export const fetchMembers = async (req, res) => {
    try {
        const members = await getMembers();
        res.json(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
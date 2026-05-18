const axios = require('axios');
const Employee = require('../models/Employee');

// @desc    Generate AI Recommendation
// @route   POST /api/ai/recommend
// @access  Private
const generateRecommendation = async (req, res) => {
    try {
        const { employeeId } = req.body;

        if (!employeeId) {
            return res.status(400).json({ message: 'Employee ID is required' });
        }

        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Make sure the logged in user matches the employee creator
        if (employee.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const prompt = `You are an expert HR analyst. Analyze the following employee's performance data and provide a detailed recommendation.
        
Employee Data:
- Name: ${employee.name}
- Department: ${employee.department}
- Experience: ${employee.experience} years
- Performance Score: ${employee.performanceScore}/100
- Skills: ${employee.skills.join(', ')}

Please provide a JSON response with the following keys exactly:
{
  "promotionRecommendation": "A short summary (Yes/No and why)",
  "trainingSuggestions": ["suggestion1", "suggestion2"],
  "employeeRanking": "A qualitative rank based on score (e.g., Top Performer, Needs Improvement)",
  "performanceFeedback": "A few sentences of constructive feedback",
  "missingSkillSuggestions": ["skill1", "skill2"]
}
Only output the valid JSON object, nothing else.`;

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: "openai/gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        let aiContent = response.data.choices[0].message.content;
        
        // Remove markdown block if exists
        aiContent = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const aiResponse = JSON.parse(aiContent);

        res.status(200).json(aiResponse);

    } catch (error) {
        console.error('AI Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error generating AI recommendation. Please try again.' });
    }
};

module.exports = {
    generateRecommendation
};

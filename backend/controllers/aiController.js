const callOpenRouterAI = async (prompt) => {
  const apiKey = process.env.OPENROUTER_API_KEY || 's1-v1-9ee253adae2b7e8c26a2ee74441450f60f76d26a6d013b4a317ba74aac33278e';

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Employee AI Analytics',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR analyst and career development advisor. Provide concise, actionable, and professional recommendations. Always structure your response clearly.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// @desc    Get AI recommendation for a single employee
// @route   POST /api/ai/recommend
// @access  Private
const getRecommendation = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'employeeId is required' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const prompt = `
Analyze this employee's profile and provide recommendations:

Name: ${employee.name}
Department: ${employee.department}
Skills: ${employee.skills.join(', ')}
Performance Score: ${employee.performanceScore}/100
Years of Experience: ${employee.experience}

Please provide:
1. **Promotion Recommendation**: Should this employee be promoted? Why or why not?
2. **Training Suggestions**: What specific training or certifications would benefit them?
3. **Skill Enhancement**: What skills should they develop next?
4. **Overall Feedback**: A brief professional assessment.

Be specific and actionable.
    `.trim();

    const recommendation = await callOpenRouterAI(prompt);

    // Save recommendation to employee record
    employee.aiRecommendation = recommendation;
    employee.lastRecommendationDate = new Date();
    await employee.save();

    res.status(200).json({
      success: true,
      data: {
        employee: {
          id: employee._id,
          name: employee.name,
          department: employee.department,
          performanceScore: employee.performanceScore,
        },
        recommendation,
        generatedAt: employee.lastRecommendationDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rank all employees with AI insights
// @route   GET /api/ai/rankings
// @access  Private
const getRankings = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    if (employees.length === 0) {
      return res.status(404).json({ success: false, message: 'No employees found' });
    }

    const employeeList = employees
      .map((e, i) => `${i + 1}. ${e.name} | ${e.department} | Score: ${e.performanceScore}/100 | Experience: ${e.experience} yrs | Skills: ${e.skills.join(', ')}`)
      .join('\n');

    const prompt = `
Here are all employees ranked by performance score. Provide a brief analysis:

${employeeList}

Please provide:
1. **Top Performers**: Highlight the top 3 and why they stand out.
2. **Needs Improvement**: Identify employees who need support.
3. **Department Analysis**: Any department-level observations.
4. **Overall Summary**: 2-3 sentences about the team's overall health.
    `.trim();

    const analysis = await callOpenRouterAI(prompt);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees: employees.length,
        rankings: employees.map((e, i) => ({
          rank: i + 1,
          id: e._id,
          name: e.name,
          department: e.department,
          performanceScore: e.performanceScore,
          experience: e.experience,
          skills: e.skills,
        })),
        aiAnalysis: analysis,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate bulk AI feedback for all employees in a department
// @route   POST /api/ai/bulk-feedback
// @access  Private
const getBulkFeedback = async (req, res, next) => {
  try {
    const { department } = req.body;
    const query = department ? { department } : {};
    const employees = await Employee.find(query);

    if (employees.length === 0) {
      return res.status(404).json({ success: false, message: 'No employees found' });
    }

    const results = [];

    for (const employee of employees) {
      try {
        const prompt = `
Employee: ${employee.name}, Department: ${employee.department}, Score: ${employee.performanceScore}/100, Experience: ${employee.experience} yrs, Skills: ${employee.skills.join(', ')}.
In 2-3 sentences, give a professional performance feedback and one key recommendation.
        `.trim();

        const feedback = await callOpenRouterAI(prompt);
        employee.aiRecommendation = feedback;
        employee.lastRecommendationDate = new Date();
        await employee.save();

        results.push({ id: employee._id, name: employee.name, feedback });
      } catch (err) {
        results.push({ id: employee._id, name: employee.name, feedback: 'Could not generate feedback at this time.' });
      }
    }

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendation, getRankings, getBulkFeedback };

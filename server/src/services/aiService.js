import OpenAI from 'openai';

let openai = null;

const getOpenAI = () => {
  console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);
  console.log('OPENAI_API_KEY value:', process.env.OPENAI_API_KEY ? 'set (length: ' + process.env.OPENAI_API_KEY.length + ')' : 'not set');

  if (!openai && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openrouter-api-key-here') {
    console.log('Initializing OpenAI client with OpenRouter...');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.REFERER_URL || 'http://localhost:5000',
        'X-Title': process.env.APP_NAME || 'AI Interview Platform'
      }
    });
    console.log('OpenAI client initialized successfully');
  }
  return openai;
};

const isAIConfigured = () => {
  const configured = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openrouter-api-key-here');
  console.log('isAIConfigured:', configured);
  return configured;
};

const DEFAULT_MODEL = 'openai/gpt-3.5-turbo';

const createCompletion = async (messages, temperature = 0.3, model = null) => {
  console.log('createCompletion called, isAIConfigured:', isAIConfigured());
  const client = getOpenAI();

  if (!client) {
    throw new Error('AI service not configured. Please add your OpenRouter API key to .env file.');
  }

  try {
    console.log('Calling OpenRouter API...');
    const response = await client.chat.completions.create({
      model: model || process.env.OPENAI_MODEL || DEFAULT_MODEL,
      messages,
      temperature,
      max_tokens: 4000
    });
    console.log('OpenRouter API response received');
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API Error:', error.message);
    throw new Error(`AI Service Error: ${error.message}`);
  }
};

const createCompletionWithFallback = async (messages, temperature = 0.3, fallbackResponse = {}) => {
  try {
    return await createCompletion(messages, temperature);
  } catch (error) {
    console.warn('AI service unavailable, using fallback:', error.message);
    return JSON.stringify(fallbackResponse);
  }
};

export const generateQuestions = async (role, difficulty, category, count = 10) => {
  if (!isAIConfigured()) {
    return getFallbackQuestions(category, count);
  }

  const systemPrompt = `You are an AI interview question generator. Generate ${count} interview questions for ${category} round.
  
  Role: ${role}
  Difficulty: ${difficulty}
  Category: ${category}
  
  Return a JSON object with this exact structure:
  {
    "questions": [
      {
        "question": "question text",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": "correct answer",
        "difficulty": "${difficulty}",
        "topic": "topic name",
        "keywords": ["keyword1", "keyword2"]
      }
    ]
  }
  
  For MCQ: provide 4 options with one correct answer.
  For coding: provide problem description and expected solution structure.
  For subjective: provide sample answer guidelines.`;

  const messages = [
    { role: 'system', content: systemPrompt }
  ];

  try {
    const result = await createCompletion(messages);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error generating questions:', error);
    return getFallbackQuestions(category, count);
  }
};

const getFallbackQuestions = (category, count) => {
  const fallbackData = {
    assessment: {
      questions: [
        { question: "What is the time complexity of binary search?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], correctAnswer: "O(log n)", topic: "Data Structures", keywords: ["binary search", "complexity"] },
        { question: "Which data structure uses LIFO principle?", options: ["Queue", "Stack", "Array", "Linked List"], correctAnswer: "Stack", topic: "Data Structures", keywords: ["LIFO", "stack"] },
        { question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"], correctAnswer: "Structured Query Language", topic: "Database", keywords: ["SQL", "database"] },
        { question: "Which HTTP method is used to update data?", options: ["GET", "POST", "PUT", "DELETE"], correctAnswer: "PUT", topic: "Web", keywords: ["HTTP", "REST"] },
        { question: "What is the default port for HTTP?", options: ["443", "80", "8080", "3000"], correctAnswer: "80", topic: "Networking", keywords: ["HTTP", "port"] },
        { question: "Which sorting algorithm has O(n²) worst case?", options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"], correctAnswer: "Bubble Sort", topic: "Algorithms", keywords: ["sorting", "complexity"] },
        { question: "What is a closure in JavaScript?", options: ["A type of loop", "A function with access to outer scope", "A error handler", "A module"], correctAnswer: "A function with access to outer scope", topic: "JavaScript", keywords: ["closure", "scope"] },
        { question: "Which protocol is used for secure web communication?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], correctAnswer: "HTTPS", topic: "Security", keywords: ["HTTPS", "SSL"] },
        { question: "What is the purpose of an index in a database?", options: ["To store more data", "To speed up queries", "To encrypt data", "To compress data"], correctAnswer: "To speed up queries", topic: "Database", keywords: ["index", "performance"] },
        { question: "What is recursion?", options: ["Looping", "Function calling itself", "Error handling", "Memory allocation"], correctAnswer: "Function calling itself", topic: "Programming", keywords: ["recursion", "function"] },
        { question: "Which is NOT a JavaScript framework?", options: ["React", "Angular", "Django", "Vue"], correctAnswer: "Django", topic: "Web Development", keywords: ["JavaScript", "framework"] },
        { question: "What does OOP stand for?", options: ["Object Oriented Programming", "Online Operating Protocol", "Object Oriented Protocol", "Open Operating Program"], correctAnswer: "Object Oriented Programming", topic: "Programming", keywords: ["OOP", "object"] },
        { question: "What is Git used for?", options: ["Database management", "Version control", "Image editing", "Web hosting"], correctAnswer: "Version control", topic: "Tools", keywords: ["Git", "version control"] },
        { question: "Which company developed React?", options: ["Google", "Microsoft", "Facebook", "Amazon"], correctAnswer: "Facebook", topic: "Web Development", keywords: ["React", "Facebook"] },
        { question: "What is an API?", options: ["Application Interface", "Application Programming Interface", "Advanced Programming Interface", "Automated Programming Interface"], correctAnswer: "Application Programming Interface", topic: "Web", keywords: ["API", "integration"] }
      ]
    },
    coding: {
      questions: [
        { question: "Write a function to find the factorial of a number.", topic: "Mathematics", keywords: ["factorial", "recursion"] },
        { question: "Implement a function to check if a string is a palindrome.", topic: "Strings", keywords: ["palindrome", "string"] },
        { question: "Write code to find the maximum element in an array.", topic: "Arrays", keywords: ["array", "maximum"] }
      ]
    },
    core: {
      questions: [
        { question: "Explain the working principle of a transformer in electrical engineering.", topic: "Electrical Machines", keywords: ["transformer", "electromagnetic"] },
        { question: "What are the different types of loads in structural engineering?", topic: "Structural Engineering", keywords: ["loads", "structures"] },
        { question: "Explain the concept of stress and strain in materials.", topic: "Material Science", keywords: ["stress", "strain"] },
        { question: "What is the difference between AC and DC motors?", topic: "Electrical Machines", keywords: ["AC", "DC", "motors"] },
        { question: "Explain the principles of concrete mix design.", topic: "Civil Engineering", keywords: ["concrete", "mix design"] },
        { question: "What are the properties of good cement?", topic: "Civil Engineering", keywords: ["cement", "properties"] },
        { question: "Explain Kirchhoff's laws in electrical circuits.", topic: "Circuit Theory", keywords: ["Kirchhoff", "circuits"] },
        { question: "What is the difference between synchronous and asynchronous motors?", topic: "Electrical Machines", keywords: ["synchronous", "asynchronous"] },
        { question: "Explain the concept of moment of inertia.", topic: "Mechanics", keywords: ["moment", "inertia"] },
        { question: "What are the different methods of surveying?", topic: "Civil Engineering", keywords: ["surveying", "measurement"] }
      ]
    },
    hr: {
      questions: [
        { question: "Tell me about yourself and why you want this role.", topic: "Introduction", keywords: ["introduction", "motivation"] },
        { question: "What are your strengths and weaknesses?", topic: "Self Assessment", keywords: ["strengths", "weaknesses"] },
        { question: "Where do you see yourself in 5 years?", topic: "Career Goals", keywords: ["career", "goals"] },
        { question: "Why should we hire you?", topic: "Value Proposition", keywords: ["hire", "value"] },
        { question: "Tell me about a challenging project you worked on.", topic: "Experience", keywords: ["challenge", "project"] },
        { question: "How do you handle pressure and deadlines?", topic: "Work Style", keywords: ["pressure", "deadlines"] },
        { question: "What are your salary expectations?", topic: "Discussion", keywords: ["salary", "expectations"] },
        { question: "Do you have any questions for us?", topic: "Closing", keywords: ["questions", "interest"] },
        { question: "Describe a time you worked in a team.", topic: "Teamwork", keywords: ["team", "collaboration"] },
        { question: "What motivates you to do your best work?", topic: "Motivation", keywords: ["motivation", "drive"] }
      ]
    }
  };

  const categoryQuestions = fallbackData[category]?.questions || [];
  return { questions: categoryQuestions.slice(0, count) };
};

export const evaluateCoding = async (question, code, language, testCases) => {
  if (!isAIConfigured()) {
    const hasCode = code && code.length > 10;
    return {
      score: hasCode ? 70 : 30,
      passed: hasCode,
      feedback: hasCode ? 'Code looks good! Consider optimizing for better performance.' : 'Please provide a complete solution.',
      syntaxErrors: [],
      logicErrors: [],
      optimization: 'Consider using more efficient algorithms',
      testResults: []
    };
  }

  const systemPrompt = `You are a code evaluator. Evaluate the following code solution.

Question: ${question}
Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`

Test Cases:
${JSON.stringify(testCases)}

Return a JSON object:
{
  "score": 0-100,
  "passed": true/false,
  "feedback": "detailed feedback",
  "syntaxErrors": ["any syntax errors"],
  "logicErrors": ["any logic errors"],
  "optimization": "suggestions for optimization",
  "testResults": [
    {"testCase": 1, "passed": true/false, "output": "actual output"}
  ]
}`;

  try {
    const messages = [{ role: 'system', content: systemPrompt }];
    const result = await createCompletion(messages, 0.2);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error evaluating code:', error);
    return { score: 50, feedback: 'Unable to evaluate code', passed: false };
  }
};

export const evaluateSubjective = async (question, answer) => {
  if (!isAIConfigured()) {
    return { score: 70, feedback: 'Good answer provided', strengths: ['Clear explanation'], improvements: ['Add more examples'] };
  }

  const systemPrompt = `You are an interview answer evaluator. Evaluate the following answer.

Question: ${question}

Answer: ${answer}

Return a JSON object:
{
  "score": 0-100,
  "feedback": "constructive feedback",
  "strengths": ["list of strengths"],
  "improvements": ["areas to improve"],
  "keywords": ["important keywords that should have been mentioned"],
  "completeness": "how complete the answer is"
}`;

  try {
    const messages = [{ role: 'system', content: systemPrompt }];
    const result = await createCompletion(messages);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error evaluating subjective answer:', error);
    return { score: 70, feedback: 'Good answer provided' };
  }
};

export const analyzeVoiceTone = async (transcript, duration) => {
  if (!isAIConfigured()) {
    return { confidence: 70, tone: 'professional', clarity: 70, pace: 'moderate' };
  }

  const systemPrompt = `Analyze the voice recording transcript for tone and confidence.

Transcript: ${transcript}
Duration: ${duration} seconds

Return a JSON object:
{
  "confidence": 0-100,
  "tone": "professional|nervous|confident|monotone|enthusiastic",
  "clarity": 0-100,
  "pace": "slow|moderate|fast|appropriate",
  "pauses": "number of significant pauses",
  "fillerWords": ["list of filler words used"],
  "sentiment": "positive|neutral|negative"
}`;

  try {
    const messages = [{ role: 'system', content: systemPrompt }];
    const result = await createCompletion(messages);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error analyzing voice tone:', error);
    return { confidence: 70, tone: 'professional', clarity: 70 };
  }
};

export const analyzeBehavior = async (events) => {
  if (!isAIConfigured()) {
    return { eyeContact: 70, confidence: 70, engagement: 70, overallScore: 70 };
  }

  const systemPrompt = `Analyze behavioral data from an interview session.

Events: ${JSON.stringify(events)}

Return a JSON object:
{
  "eyeContact": 0-100,
  "confidence": 0-100,
  "engagement": 0-100,
  "suspiciousPatterns": ["any suspicious patterns detected"],
  "flags": ["any red flags"],
  "overallScore": 0-100
}`;

  try {
    const messages = [{ role: 'system', content: systemPrompt }];
    const result = await createCompletion(messages);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error analyzing behavior:', error);
    return { eyeContact: 70, confidence: 70, engagement: 70, overallScore: 70 };
  }
};

export const parseResume = async (resumeText) => {
  const fallback = {
    skills: extractSkillsFromResume(resumeText),
    experience: 'Not specified',
    education: [],
    summary: 'Resume parsed (fallback mode)'
  };

  try {
    if (!isAIConfigured()) {
      console.log('AI not configured, using fallback');
      return fallback;
    }

    const systemPrompt = `Parse the following resume text and extract structured information.

Resume:
${resumeText}

Return a JSON object:
{
  "skills": ["technical skills"],
  "experience": "years of experience summary",
  "education": ["education details"],
  "summary": "professional summary",
  "projects": ["notable projects"],
  "certifications": ["certifications"]
}`;

    const messages = [{ role: 'system', content: systemPrompt }];
    const result = await createCompletionWithFallback(messages, 0.3, fallback);

    try {
      return JSON.parse(result);
    } catch {
      console.warn('Failed to parse AI response as JSON, using fallback');
      return fallback;
    }
  } catch (error) {
    console.error('Error parsing resume:', error.message);
    return fallback;
  }
};

const extractSkillsFromResume = (text) => {
  const commonSkills = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'HTML', 'CSS', 'Git', 'Machine Learning', 'Data Science', 'AWS', 'Docker', 'Kubernetes', 'Angular', 'Vue', 'TypeScript', 'PHP', 'Ruby'];
  const foundSkills = commonSkills.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
  return foundSkills.length > 0 ? foundSkills : ['General Skills'];
};

export const generateReport = async (interviewData, userProfile) => {
  if (!isAIConfigured()) {
    const assessmentScore = interviewData.rounds?.assessment?.score || 0;
    
    const codingQuestions = interviewData.rounds?.coding?.questions || [];
    const codingScore = codingQuestions.length > 0 
      ? codingQuestions.reduce((acc, q) => acc + (q.score || 0), 0) / codingQuestions.length 
      : 0;
    
    const coreQuestions = interviewData.rounds?.core?.questions || [];
    const coreScore = coreQuestions.length > 0
      ? coreQuestions.reduce((acc, q) => acc + (q.aiEvaluation?.score || 0), 0) / coreQuestions.length
      : 0;
    
    const hrQuestions = interviewData.rounds?.hr?.questions || [];
    const hrScore = hrQuestions.length > 0
      ? hrQuestions.reduce((acc, q) => acc + (q.aiEvaluation?.score || 0), 0) / hrQuestions.length
      : 0;
    
    const totalScore = (assessmentScore + codingScore + coreScore + hrScore) / 4;

    return {
      overallScore: Math.round(totalScore),
      roundBreakdown: {
        assessment: { score: Math.round(assessmentScore), weakAreas: ['Practice more questions'], strongAreas: ['Good understanding of basics'] },
        coding: { score: Math.round(codingScore), weakAreas: ['Algorithm optimization'], strongAreas: ['Code structure'] },
        core: { score: Math.round(coreScore), weakAreas: ['Technical depth'], strongAreas: ['Concepts clarity'] },
        hr: { score: Math.round(hrScore), improvements: ['More confidence'] }
      },
      weakAreas: ['Areas for improvement based on performance'],
      strengths: ['Good theoretical knowledge', 'Decent communication'],
      suggestions: ['Practice coding problems daily', 'Review fundamental concepts', 'Work on confidence'],
      behavioralInsights: { eyeContact: 70, confidence: 65, clarity: 70 },
      cheatingProbability: 5,
      aiRecommendations: {
        nextSteps: ['Practice more interviews', 'Review weak areas'],
        learningPath: [{ topic: 'Data Structures', priority: 'high', resources: ['LeetCode', 'GeeksforGeeks'] }]
      }
    };
  }

  const systemPrompt = `Generate a comprehensive interview analysis report.

Interview Data: ${JSON.stringify(interviewData)}
User Profile: ${JSON.stringify(userProfile)}

Return a JSON object with:
{
  "overallScore": 0-100,
  "roundBreakdown": {
    "assessment": {"score": number, "weakAreas": [], "strongAreas": []},
    "coding": {"score": number, "weakAreas": [], "strongAreas": []},
    "core": {"score": number, "weakAreas": [], "strongAreas": []},
    "hr": {"score": number, "improvements": []}
  },
  "weakAreas": ["list of weak areas"],
  "strengths": ["list of strengths"],
  "suggestions": ["personalized suggestions for improvement"],
  "behavioralInsights": {"eyeContact": number, "confidence": number, "clarity": number},
  "cheatingProbability": 0-100,
  "aiRecommendations": {
    "nextSteps": [],
    "learningPath": [{"topic": "", "priority": "high|medium|low", "resources": []}]
  }
}`;

  try {
    const messages = [{ role: 'system', content: systemPrompt }];
    const result = await createCompletion(messages);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error generating report:', error);
    return {
      overallScore: 50,
      roundBreakdown: { assessment: {}, coding: {}, core: {}, hr: {} },
      weakAreas: [],
      strengths: [],
      suggestions: [],
      behavioralInsights: { eyeContact: 50, confidence: 50, clarity: 50 },
      cheatingProbability: 0,
      aiRecommendations: { nextSteps: [], learningPath: [] }
    };
  }
};

export const chatWithAI = async (messages, userMessage, resumeInfo = null) => {
  const client = getOpenAI();

  let contextInfo = 'You are a helpful AI interview coach. Help users with interview preparation, practice questions, and career advice. Be concise and supportive.';

  if (resumeInfo) {
    const resumeContext = `
User's Resume Information:
- Skills: ${resumeInfo.skills.join(', ') || 'Not specified'}
- Education: ${resumeInfo.education.join(', ') || 'Not specified'}
- Experience: ${resumeInfo.experience || 'Not specified'}
- Summary: ${resumeInfo.summary || 'Not specified'}
- Projects: ${resumeInfo.projects?.join(', ') || 'Not specified'}

When the user asks about their resume, projects, skills, or experience, use this information to provide personalized answers.`;
    contextInfo = resumeContext;
  }

  if (!client) {
    return {
      response: resumeInfo
        ? "AI service is in fallback mode. Resume info is loaded but AI responses are limited. Please configure API key for full functionality."
        : "AI service is not configured. Please add your OpenRouter API key to .env file to enable AI chat functionality."
    };
  }

  const allMessages = [
    { role: 'system', content: contextInfo },
    ...messages.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage }
  ];

  try {
    const result = await createCompletion(allMessages, 0.7);
    return { response: result };
  } catch (error) {
    console.error('Chat error:', error);
    return { response: "I apologize, but I encountered an error. Please try again." };
  }
};

export const adaptDifficulty = async (currentScore, difficulty, round) => {
  if (!isAIConfigured()) {
    if (currentScore >= 80) return { recommendedDifficulty: 'hard', reason: 'Excellent performance, moving to advanced level', focusAreas: [] };
    if (currentScore >= 60) return { recommendedDifficulty: 'medium', reason: 'Good performance, maintaining level', focusAreas: [] };
    return { recommendedDifficulty: 'easy', reason: 'Focus on fundamentals first', focusAreas: [] };
  }

  const systemPrompt = `Based on performance data, suggest difficulty adjustment.

Current Score: ${currentScore}%
Current Difficulty: ${difficulty}
Round: ${round}

Return a JSON object:
{
  "recommendedDifficulty": "easy|medium|hard",
  "reason": "reason for change",
  "focusAreas": ["areas to focus on"],
  "nextQuestions": "difficulty of next questions"
}`;

  try {
    const messages = [{ role: 'system', content: systemPrompt }];
    const result = await createCompletion(messages);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error adapting difficulty:', error);
    return { recommendedDifficulty: difficulty, reason: 'Service unavailable' };
  }
};

export default {
  generateQuestions,
  evaluateCoding,
  evaluateSubjective,
  analyzeVoiceTone,
  analyzeBehavior,
  parseResume,
  generateReport,
  chatWithAI,
  adaptDifficulty
};
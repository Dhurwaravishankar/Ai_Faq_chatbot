import OpenAI from 'openai';

let openai = null;

export const initializeAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️  OpenAI API key not found. AI responses will be simulated.');
    return;
  }

  try {
    openai = new OpenAI({
      apiKey: apiKey
    });
    console.log('✅ OpenAI service initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI:', error);
  }
};

export const askAI = async (question) => {
  try {
    // If OpenAI is not available, return a simulated response
    if (!openai) {
      return getSimulatedResponse(question);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful FAQ assistant for a company. Your role is to answer frequently asked questions about products, services, policies, and general business inquiries.

Key guidelines:
- Provide clear, concise, and helpful answers
- If you don't know something specific about the company, say "I don't know" and suggest contacting support
- Be friendly and professional
- Keep responses focused and relevant to FAQ topics
- If the question is unclear, ask for clarification
- For complex topics, break down your response into easy-to-understand parts
- Always aim to be helpful while staying within the scope of FAQ assistance

Remember: You're designed to help users find information quickly and efficiently. If you cannot answer a question, it's better to admit it than to guess.`
        },
        {
          role: "user",
          content: question
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const answer = completion.choices[0]?.message?.content?.trim();
    
    if (!answer) {
      throw new Error('No response generated from OpenAI');
    }

    // Check if the AI says it doesn't know
    const dontKnowPhrases = [
      "i don't know",
      "i'm not sure",
      "i don't have information",
      "i cannot provide",
      "i'm unable to",
      "i don't have access"
    ];

    const lowerAnswer = answer.toLowerCase();
    const seemsUnsure = dontKnowPhrases.some(phrase => lowerAnswer.includes(phrase));

    if (seemsUnsure) {
      return {
        success: false,
        error: 'AI indicated uncertainty about the answer',
        answer: answer
      };
    }

    return {
      success: true,
      answer: answer
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Return fallback response
    return getSimulatedResponse(question);
  }
};

const getSimulatedResponse = (question) => {
  const lowerQuestion = question.toLowerCase();
  
  // Comprehensive keyword-based responses for demonstration
  const responses = {
    // Greetings
    'hello': 'Hello! How can I help you today?',
    'hi': 'Hi there! What can I assist you with?',
    'hey': 'Hey! How can I help you?',
    
    // Business hours
    'hours': 'Our support team is available Monday through Friday, 9 AM to 6 PM EST. For urgent matters, please email us and we\'ll respond as soon as possible.',
    'open': 'We\'re open Monday through Friday, 9 AM to 6 PM EST.',
    'closed': 'We\'re closed on weekends and major holidays. Our regular hours are Monday-Friday, 9 AM to 6 PM EST.',
    
    // Contact information
    'contact': 'You can reach us via email at support@example.com or phone at (555) 123-4567 during business hours.',
    'email': 'Our email address is support@example.com. We typically respond within 24 hours.',
    'phone': 'You can call us at (555) 123-4567 during business hours (Monday-Friday, 9 AM to 6 PM EST).',
    
    // Pricing
    'price': 'For detailed pricing information, please visit our pricing page or contact our sales team at sales@example.com.',
    'cost': 'Costs vary depending on your specific needs. Please contact our sales team for a personalized quote.',
    'free': 'We offer a free trial for new customers. Contact us to learn more about our free tier options.',
    
    // Returns and refunds
    'return': 'We offer a 30-day return policy for most items. Items must be in original condition. Please contact support to initiate a return.',
    'refund': 'Refunds are processed within 5-7 business days after we receive your returned item. Original shipping costs are non-refundable.',
    'exchange': 'We accept exchanges within 30 days of purchase. Contact support to arrange an exchange.',
    
    // Shipping
    'shipping': 'We offer free shipping on orders over $50. Standard shipping takes 3-5 business days, expedited shipping takes 1-2 business days.',
    'delivery': 'Delivery times vary by location. Standard delivery is 3-5 business days, expedited is 1-2 business days.',
    'tracking': 'You\'ll receive a tracking number via email once your order ships. You can track your package on our website.',
    
    // Account management
    'account': 'You can manage your account by logging into our website and visiting your account dashboard.',
    'password': 'To reset your password, click "Forgot Password" on the login page and follow the instructions.',
    'login': 'If you\'re having trouble logging in, try resetting your password or contact support for assistance.',
    
    // Payment
    'payment': 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers.',
    'billing': 'Billing questions can be directed to our accounting team at billing@example.com.',
    'invoice': 'Invoices are sent automatically after purchase. You can also download them from your account dashboard.',
    
    // Support
    'support': 'Our support team is here to help! Please describe your specific issue and we\'ll assist you as quickly as possible.',
    'help': 'I\'m here to help! What specific question do you have?',
    'problem': 'I\'m sorry you\'re experiencing an issue. Please provide more details so I can better assist you.',
    
    // Technical issues
    'bug': 'If you\'ve found a bug, please report it to our technical team at tech@example.com with details about what happened.',
    'error': 'For technical errors, please try refreshing the page or clearing your browser cache. If the issue persists, contact support.',
    'website': 'If you\'re having website issues, try clearing your browser cache or using a different browser. Contact support if problems continue.'
  };

  // Find matching keywords
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerQuestion.includes(keyword)) {
      return {
        success: true,
        answer: response
      };
    }
  }

  // Default response when no keywords match
  return {
    success: false,
    error: 'No matching response found in demo mode',
    answer: `I don't know the answer to "${question}". This chatbot is currently running in demo mode with limited responses. To get comprehensive AI-powered answers, please add your OpenAI API key to the backend configuration. 

In the meantime, I can help with questions about:
• Business hours and contact information
• Pricing and billing
• Returns, refunds, and exchanges  
• Shipping and delivery
• Account management
• Technical support

Please try rephrasing your question or contact our support team directly at support@example.com.`
  };
};

import { GoogleGenAI, Chat, GenerateContentResponse, Part, Tool, Type, FunctionCall } from "@google/genai";
import { calculateDisabilityCompensation } from './compensationCalculator';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_INSTRUCTION = `### AI Persona: Bennie

You are Bennie, an empathetic and knowledgeable virtual assistant. Your sole purpose is to help U.S. Veterans understand and navigate the Veteran disability compensation system.

**Your Tone:**
- **Supportive & Encouraging:** Always maintain a positive and patient tone. Acknowledge that the Veteran process can be difficult and frustrating. Use phrases like, "I understand this can be a challenging process, and I'm here to help guide you," or "Let's take this one step at a time."
- **Clear & Simple:** Translate complex bureaucratic language from the 38 CFR and Veteran websites into plain, easy-to-understand English. Avoid jargon wherever possible.
- **Professional & Respectful:** Address the user with respect at all times.

### Core Directive: The Guided Wizard

Your primary function is to act as a "Guided Wizard." You do not provide long, monolithic answers. Instead, you guide the user through a process by asking clarifying questions. Your goal is to understand the Veteran's specific situation and lead them to the next logical step.

**Interaction Flow:**
1.  Start the conversation with a warm greeting (e.g., "Hello, I'm Bennie. I'm here to help you navigate the Veteran disability system. I understand this can be a challenging process, and I'm here to help guide you.

Please select one of the options below to get started, or feel free to type your own question in the box below.").
2.  Based on the user's response, ask targeted follow-up questions to narrow down their needs.
3.  Provide information in small, digestible chunks, ending each response with a question that guides them to the next step.
4.  **When a user uploads a file, it is their Veteran benefits document (e.g., a denial letter). Your task is to analyze it, identify the key issues or reasons for denial, and then begin your guided wizard questioning to help them understand their next steps. Address the user directly about the document's contents.**

### NEW CAPABILITY: Compensation Calculation

You can now help Veterans estimate their potential monthly disability payment by following a strict, non-conversational script.

**Calculation Script:**
1.  When a user asks about payment amounts, your first question **must** be to ask for their disability rating.
2.  Once you receive the rating, your next question **must** be whether they have a dependent spouse.
3.  Once you receive the spouse information, your next question **must** be how many dependent children they have.
4.  Once you receive the number of children, your final question **must** be how many dependent parents they have.
5.  **CRITICAL:** During this process, do not add extra conversational text, summaries, or confirmations. Just ask the next required question directly. For example, after the user provides their rating, your response should simply be "Do you have a dependent spouse?".
6.  After the user provides the final piece of information (the number of parents), you **must** call the \`calculateDisabilityCompensation\` tool. You can also provide a brief confirmation message like, "Okay, calculating that for you...". The application will display the final results, so you do not need to include them in your response.


### CRITICAL RULES OF ENGAGEMENT

**1. ABSOLUTE PROHIBITION on Advice:**
- You MUST NOT provide medical or legal advice under any circumstances. You are an informational guide, not a clinician, lawyer, or VSO (Veteran Service Organization) representative.
- **Weave Disclaimers Naturally:** When discussing sensitive topics like evidence, specific conditions, or appeal strategies, you must include a disclaimer within the text.
- **Disclaimer Examples:**
    - "While many Veterans use [type of evidence] for claims like this, I cannot give you legal advice. It's always a good idea to discuss your specific evidence with an accredited VSO or attorney."
    - "I can explain what the 38 CFR says about [medical condition], but I can't offer a medical opinion. You should always work with your doctor on medical matters."
    - "This information is for educational purposes only and is not a substitute for professional legal advice."

**2. Source & Citation Protocol:**
- **Source Hierarchy:** Your information must come from the following sources in this order of priority:
    1.  **Primary:** 38 Code of Federal Regulations (38 CFR).
    2.  **Secondary:** Official U.S. government websites (Veteran.gov, DOL.gov, etc.).
    3.  **Tertiary:** Highly reputable and relevant public websites (e.g., established Veteran advocacy groups).
- **Mandatory Citations:** When you state a fact related to a regulation, timeline, or specific process, you MUST cite your source with a direct, functioning URL in markdown format like [link text](url).

**3. Safety & Crisis Protocol:**
- If a user expresses thoughts of self-harm, hopelessness, or mentions suicide, you must IMMEDIATELY and ONLY respond with the following, and then cease the current line of conversation:
> "I hear that you're going through a difficult time. It's important to talk to someone who can support you. You can connect with people who can support you by calling or texting 988 anytime in the US and Canada. In the UK, you can call 111. For Veterans, the Veterans Crisis Line is available 24/7. You can call them at 988 and press 1, or text them at 838255. Please reach out to them."

**4. PROHIBITED RESPONSES:**
- Do not present the user with a numbered list of generic topics. Specifically, you must not use lists like the following: "1. I'm thinking about filing a new claim. 2. I want to understand a decision on my existing claim. 3. I need help gathering evidence for my claim. 4. I want to appeal a decision. 5. Something else." Instead, provide guidance based on the user's direct input from questions or button clicks.

**5. Markdown, Emphasis, and List Formatting:**
- For **bold** text, wrap the text in double asterisks. Example: **This is important**.
- For *italic* text, wrap the text in single asterisks. Example: *This is emphasized*.
- To create a bulleted list, you MUST start each line with a dash and a space. Example:
  - This is a list item.
  - This is another list item.
- **CRITICAL RULE:** You must NEVER place a single, unmatched asterisk at the end of a word or sentence. This is invalid formatting and will confuse the user.
    - **WRONG:** Are you filing a new claim*?
    - **RIGHT:** Are you filing a new claim?
    - **WRONG:** * This is a list item. (Do not use asterisks for lists).
    - **RIGHT:** - This is a list item.
    - **RIGHT (for emphasis):** *Are you filing a new claim?*
`;

const calculateCompensationTool: Tool = {
    functionDeclarations: [
        {
            name: "calculateDisabilityCompensation",
            description: "Calculates the estimated monthly VA disability compensation payment. Before calling, you MUST ask the user clarifying questions to get all required parameters: disability rating, if they have a spouse, number of dependent children, and number of dependent parents.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    rating: {
                        type: Type.NUMBER,
                        description: "The veteran's disability rating as a whole number (e.g., 50 for 50%)."
                    },
                    hasSpouse: {
                        type: Type.BOOLEAN,
                        description: "Whether the veteran has a dependent spouse."
                    },
                    childrenCount: {
                        type: Type.NUMBER,
                        description: "The number of dependent children."
                    },
                    parentsCount: {
                        type: Type.NUMBER,
                        description: "The number of dependent parents (can be 0, 1, or 2)."
                    },
                    spouseNeedsAid: {
                        type: Type.BOOLEAN,
                        description: "Whether the veteran's spouse qualifies for Aid and Attendance. This is a special circumstance, so only ask if the user mentions it. Defaults to false."
                    }
                },
                required: ["rating", "hasSpouse", "childrenCount", "parentsCount"]
            }
        }
    ]
};


export interface ApiAttachment {
    mimeType: string;
    data: string;
}

class GeminiChatService {
    private chat: Chat | null = null;
    
    private initialize() {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable not set");
            throw new Error("API_KEY environment variable not set. Please configure it.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        this.chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                tools: [calculateCompensationTool],
            },
        });
    }

    public async getResponse(message: string, attachment?: ApiAttachment): Promise<string> {
        if (!this.chat) {
            this.initialize();
        }

        const crisisKeywords = ['suicide', 'kill myself', 'hopeless', 'end my life', "can't go on", 'self-harm'];
        const lowerCaseMessage = message.toLowerCase();
        if (crisisKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
             return "I hear that you're going through a difficult time. It's important to talk to someone who can support you. You can connect with people who can support you by calling or texting 988 anytime in the US and Canada. In the UK, you can call 111. For Veterans, the Veterans Crisis Line is available 24/7. You can call them at 988 and press 1, or text them at 838255. Please reach out to them.";
        }

        try {
            const parts: Part[] = [{ text: message }];
            if (attachment) {
                parts.push({
                    inlineData: {
                        mimeType: attachment.mimeType,
                        data: attachment.data,
                    }
                });
            }

            const response: GenerateContentResponse = await this.chat!.sendMessage({ message: parts });
            
            // Check if the model wants to call the tool
            const functionCall = response.candidates?.[0]?.content?.parts?.find(p => p.functionCall)?.functionCall;

            if (functionCall) {
                if (functionCall.name === 'calculateDisabilityCompensation') {
                    const args = functionCall.args;
                    
                    // Robustly parse arguments from the LLM
                    const rawRating = args.rating ? String(args.rating) : '0';
                    const rating = parseInt(rawRating.replace(/[^0-9]/g, ''), 10) || 0;

                    const rawHasSpouse = args.hasSpouse !== undefined ? String(args.hasSpouse).toLowerCase() : 'false';
                    const hasSpouse = rawHasSpouse === 'true' || rawHasSpouse === 'yes';

                    const childrenCount = Number(args.childrenCount ?? 0);
                    const parentsCount = Number(args.parentsCount ?? 0);

                    const rawSpouseNeedsAid = args.spouseNeedsAid !== undefined ? String(args.spouseNeedsAid).toLowerCase() : 'false';
                    const spouseNeedsAid = rawSpouseNeedsAid === 'true' || rawSpouseNeedsAid === 'yes';
                    
                    const result = calculateDisabilityCompensation({
                        rating,
                        hasSpouse,
                        childrenCount,
                        parentsCount,
                        spouseNeedsAid,
                    });

                    // NEW: Instead of sending result back to AI, format it directly.
                    if (result.error) {
                        return result.error as string;
                    }
                    
                    const finalAmount = result.finalAmount as number;
                    const breakdown = result.breakdown as string[];
                    const notes = result.notes as string[];

                    let resultText = `Based on the information you've provided, your estimated monthly payment is **$${finalAmount.toFixed(2)}**.\n\n`;
                    resultText += "Here is a simple breakdown:\n";
                    breakdown.forEach(line => {
                        resultText += `- ${line}\n`;
                    });
                    resultText += "\n";
                    notes.forEach(note => {
                        resultText += `${note}\n`;
                    });
                    
                    // Also get the conversational text part of the response, if any.
                    const conversationalText = response.text;
                    
                    // Combine the AI's conversational text with the formatted result.
                    const combinedResponse = conversationalText 
                        ? `${conversationalText}\n\n${resultText.trim()}`
                        : resultText.trim();
                        
                    return combinedResponse;

                } else {
                    // Unhandled tool call
                     return "I'm sorry, an unexpected error occurred while trying to use a tool.";
                }
            }

            return response.text;
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            // Re-initialize chat on error in case session expired
            this.initialize();
            throw new Error("Failed to get response from AI service.");
        }
    }
}

export const geminiService = new GeminiChatService();

export const startChat = async () => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash", // Or whichever model you use
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{
            functionDeclarations: [calculateDisabilityCompensation]
        }]
    });

    return model.startChat();
};

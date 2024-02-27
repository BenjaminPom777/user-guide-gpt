const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: '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' });

async function askChatGpt(userContent, systemContent) {
    try {
        // Use a prompt to generate a buying guide for the specified product
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: userContent },
            ],
            model: "gpt-3.5-turbo-0125",
        });

        const productList = completion.choices[0].message.content;
        return productList;
    } catch (error) {
        console.error("Error generating buying guide:", error);
    }
}


async function flow(userInput) {
    let stringAnswer = '';
    const links=[];

    const isBuyingGuide = await askChatGpt(
        `is userInput "${userInput}" related to a buying guide?`
        , "Provide a concise true or false answer"
    );
    if (isBuyingGuide.toLowerCase() == 'true') {
        const buyingGuide = await askChatGpt(
            `Generate a buying guide for ${userInput}`,
            "You are a helpful assistant that provides buying guides with list of popular products."
        );
        stringAnswer += `Byuing guide : ${buyingGuide}\n`
        const itemListAnswer = await askChatGpt(
            `userInput ${buyingGuide}`,
            "find product names in user input and return a list of them comma separeted"
        );
        if (itemListAnswer.includes(',')) {
            const itemList = itemListAnswer.split(',');
            for (const item of itemList) {
                links.push(`https://www.10bestdeals.co.uk/product/${encodeURIComponent(item)}/`)
            }
        } else {
            stringAnswer += 'Unfortunately chat gpt was not able to find items in user guide';            
        }
    } else {
        stringAnswer = 'user input is not related to buying guide'        
    }
    return {stringAnswer, links};
}

module.exports = {
    flow
}
import dotenv from "dotenv";
dotenv.config();

async function askGPT() {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content:
            "based on everything you know about me given my organization, my profile, and any other info you have on me, tell me something I probably don't know about myself"
        }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
}

// Call the function
askGPT().catch(console.error);

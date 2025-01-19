// Note: Replace *<YOUR_APPLICATION_TOKEN>* with your actual Application token.

class LangflowClient {
  constructor(baseURL, applicationToken) {
    this.baseURL = baseURL;
    this.applicationToken = applicationToken;
  }

  async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
    headers["Authorization"] = `Bearer ${this.applicationToken}`;
    headers["Content-Type"] = "application/json";
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const responseMessage = await response.json();
      if (!response.ok) {
        throw new Error(
          `${response.status} ${response.statusText} - ${JSON.stringify(
            responseMessage
          )}`
        );
      }
      return responseMessage;
    } catch (error) {
      console.error("Request Error:", error.message);
      throw error;
    }
  }

  async initiateSession(
    flowId,
    langflowId,
    inputValue,
    inputType = "chat",
    outputType = "chat",
    stream = false,
    tweaks = {}
  ) {
    const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
    return this.post(endpoint, {
      input_value: inputValue,
      input_type: inputType,
      output_type: outputType,
      tweaks,
    });
  }

  handleStream(streamUrl, onUpdate, onClose, onError) {
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };

    eventSource.onerror = (event) => {
      console.error("Stream Error:", event);
      onError(event);
      eventSource.close();
    };

    eventSource.addEventListener("close", () => {
      onClose("Stream closed");
      eventSource.close();
    });

    return eventSource;
  }

  async runFlow(
    flowIdOrName,
    langflowId,
    inputValue,
    inputType = "chat",
    outputType = "chat",
    tweaks = {},
    stream = false,
    onUpdate,
    onClose,
    onError
  ) {
    try {
      const initResponse = await this.initiateSession(
        flowIdOrName,
        langflowId,
        inputValue,
        inputType,
        outputType,
        stream,
        tweaks
      );

      console.log("Init Response:", initResponse);

      if (
        stream &&
        initResponse.outputs?.[0]?.outputs?.[0]?.artifacts?.stream_url
      ) {
        const streamUrl =
          initResponse.outputs[0].outputs[0].artifacts.stream_url;
        console.log(`Streaming from: ${streamUrl}`);
        this.handleStream(streamUrl, onUpdate, onClose, onError);
      }

      return initResponse;
    } catch (error) {
      console.error("Error running flow:", error);
      onError("Error initiating session");
    }
  }
}

// Main function to execute the flow
async function main(
  inputValue,
  inputType = "chat",
  outputType = "chat",
  stream = false
) {
  const flowIdOrName = "8ce9204b-b653-4d1d-a20d-259082d7568a";
  const langflowId = "a40b3ea0-fe83-4d99-9f89-31d416c121a3";
  const applicationToken = "<YOUR_APPLICATION_TOKEN>";
  const langflowClient = new LangflowClient(
    "https://api.langflow.astra.datastax.com",
    applicationToken
  );

  const tweaks = {
    "Prompt-IvFOp": {
      template: `Given the following references and instructions:
  
  Reference 1:
  {references}
  
  "Generate only JSON structured output for {instruction} in the following format:
  title: title from output || description: description from output and it should be more in detailed || keyword: keyword from output || metaDescription: metaDescription from output || metaTitle: metaTitle from output || metaTag: metatag from output
  Replace each placeholder with appropriate values. Ensure the title is concise and engaging, the description provides a detailed overview, and the metadata fields (keyword, metaDescription, metaTitle, metaTag) are SEO-optimized and relevant to {instruction}.`,
      references: "",
      instruction: "",
    },
    "TextOutput-xzGdL": {
      input_value:
        "Demystifying Natural Language Processing (NLP): How AI Understands Human Language",
    },
    "GoogleGenerativeAIModel-BniIy": {
      google_api_key: "<YOUR_GOOGLE_API_KEY>",
      input_value: "",
      max_output_tokens: null,
      model: "gemini-1.5-pro",
      n: null,
      stream: false,
      system_message: "",
      temperature: 0.1,
      top_k: null,
      top_p: null,
    },
    "ChatOutput-LQ1hT": {
      background_color: "",
      chat_icon: "",
      data_template: "{text}",
      input_value: "",
      sender: "Machine",
      sender_name: "AI",
      session_id: "",
      should_store_message: true,
      text_color: "",
    },
  };

  try {
    const response = await langflowClient.runFlow(
      flowIdOrName,
      langflowId,
      inputValue,
      inputType,
      outputType,
      tweaks,
      stream,
      (data) => console.log("Received:", data.chunk), // onUpdate
      (message) => console.log("Stream Closed:", message), // onClose
      (error) => console.log("Stream Error:", error) // onError
    );

    if (!stream && response?.outputs) {
      const flowOutputs = response.outputs[0];
      const firstComponentOutputs = flowOutputs.outputs[0];
      const output = firstComponentOutputs.outputs.message;

      console.log("Final Output:", output.message.text);
    }
  } catch (error) {
    console.error("Main Error:", error.message);
  }
}

// Parse command-line arguments and run the main function
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error(
    'Please run the file with the message as an argument: node <YOUR_FILE_NAME>.js "user_message"'
  );
} else {
  main(
    args[0], // inputValue
    args[1], // inputType
    args[2], // outputType
    args[3] === "true" // stream
  );
}

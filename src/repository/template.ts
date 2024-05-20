import axios from "axios";

export class TemplateRepository {
  public sendMessage = async (
    phone: string,
    templateName: string,
    key: string,
    wsIdentifier: string,
    language: string,
  ) => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    };

    const data = {
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: language,
        },
      },
    };
    try {
      const metaUrl = `${process.env.META_URL}${wsIdentifier}/messages`;
      if (!metaUrl) {
        throw new Error("META_URL is not defined");
      }
      await axios.post(metaUrl, data, axiosConfig);
      console.log(`Message sent to ${phone}`);
    } catch (error) {
      throw Error(`Failed to send message to ${phone}: ${error.response?.data.error.message}`);
    }
  };

  public sendMessageWithVars = async (
    phone: string,
    templateName: string,
    key: string,
    wsIdentifier: string,
    text1: string,
    text2: string,
    language: string,
  ) => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    };
    const data = {
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: language,
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: text1,
              },
              {
                type: "text",
                text: text2,
              },
            ],
          },
        ],
      },
    };
    try {
      const metaUrl = `${process.env.META_URL}${wsIdentifier}/messages`;
      if (!metaUrl) {
        throw new Error("META_URL is not defined");
      }
      await axios.post(metaUrl, data, axiosConfig);
      console.log(`Message sent to ${phone}`);
    } catch (error) {
      console.error("Error on send message with vars");
      throw Error(`Failed to send message to ${phone}: ${error.response?.data.error.message}`);
    }
  };
}

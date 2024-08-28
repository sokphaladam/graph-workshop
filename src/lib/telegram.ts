import { envconfig } from "./envconfig";
import request from "request-promise";

const END_POINT = "https://api.telegram.org/bot";

export class Telegram {
  private url = `${END_POINT}${envconfig.TELEGRAM}`;
  private CHAT_ID = "-1002167732104";

  constructor(CHAT_ID?: string) {
    this.CHAT_ID = CHAT_ID ? CHAT_ID : "-1002167732104";
  }

  public async getMe() {
    const res = await fetch(this.url + "/getMe");
    const json = await res.json();
    return json;
  }

  public sendMessage(text: string) {
    const link = `${this.url}/sendMessage`;

    const options = {
      method: "POST",
      uri: link,
      body: {
        chat_id: this.CHAT_ID,
        text,
        parse_mode: "HTML",
      },
      json: true, // Automatically stringifies the body to JSON
    };

    request(options).then().catch();
    // const res = await fetch(
    //   `${this.url}/sendMessage?chat_id=${this.CHAT_ID}&text=${text}&parse_mode=HTML`
    // );
    // const json = await res.json();
    // return json;
  }

  public sendPhoto(text: string, img: string) {
    // const res = await fetch(
    //   `${this.url}/sendPhoto?chat_id=${this.CHAT_ID}&photo=${img}&caption=${text}&parse_mode=HTML`
    // );
    // const json = await res.json();
    // return json;
  }
}

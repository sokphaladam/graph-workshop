import moment from "moment-timezone";

const mapTransactionType = [
  "",
  "STOCK_IN",
  "ADJUST",
  "INSTORE_PURCHASE",
  "ONLINE_PURCAHSE",
  "RECYCLE",
  "TRANSFER_OUT",
  "TRANSFER_IN",
  "DAMAGE",
  "MISSING",
  "STOCK_OUT",
];

const commonProductOptionMap = {
  xxl: "XXL",
  xl: "XL",
};

export class Formatter {
  static ucfirst(s: string): string {
    if (s.length === 0) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  static beautifyProductOption(s: string): string {
    if (s.length === 0) return s;

    if (commonProductOptionMap[s.toLowerCase()]) {
      return commonProductOptionMap[s.toLowerCase()];
    }

    const splitByWord = s.split(" ").map((x) => Formatter.ucfirst(x));
    return splitByWord.join(" ");
  }

  static trimPhoneNumber(str: string): string {
    let phone = str.trim();

    if (phone.length > 8) {
      // prevent trimming 085 5....
      if (phone.substr(0, 4) == "+855") {
        phone = phone.substr(4); // +TRIM 855
      } else if (phone.substr(0, 3) == "855") {
        phone = phone.substr(3); // +TRIM 855
      }
    }

    phone = phone.replace(/^0/, ""); // TRIM 0

    return phone;
  }

  static toTrueFalseField(b: boolean | undefined) {
    if (b === undefined) return undefined;
    if (b) return "T";
    return "F";
  }

  static dateTime(datetime): string {
    if (datetime === null) return null;
    return moment(datetime, "YYYY MM DD HH mm ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );
  }

  static date(date): string {
    if (date === null) return null;
    return moment(date, "YYYY MM DD").format("YYYY-MM-DD");
  }

  static utc(): number {
    return (Date.now() / 1000) | 0;
  }

  static utcFromDate(date: Date | string | null | undefined) {
    if (!date) return null;
    return Math.floor(new Date(date).getTime() / 1000);
  }

  /**
   * Get the current time in +7 timezone
   */
  static getNowDateTime(): string {
    return moment().tz("Asia/Phnom_Penh").format("YYYY-MM-DD HH:mm:ss");
  }

  static getNowDate(): string {
    return moment().tz("Asia/Phnom_Penh").format("YYYY-MM-DD");
  }

  static getLast30DaysDateTime(): string {
    return moment()
      .subtract(30, "days")
      .tz("Asia/Phnom_Penh")
      .format("YYYY-MM-DD HH:mm:ss");
  }

  static addDateToNow(
    value: number,
    dateType: "day" | "month" | "year"
  ): string {
    return moment()
      .add(value, dateType)
      .tz("Asia/Phnom_Penh")
      .format("YYYY-MM-DD HH:mm:ss");
  }

  static transactionTypeMap(transactionTypeID: number): string {
    return mapTransactionType[transactionTypeID];
  }

  static tokenMasking(token: string): string {
    if (token.length < 4) return token;

    const fourDigit = token.substr(0, 4);
    const rest = new Array(token.length - 4).fill("x").join("");
    return fourDigit + rest;
  }

  static customerSafeNameMasking(name: string) {
    const all = [...name.matchAll(/\d{2,3}\s*\d{5,20}/g)];
    let result = name;

    for (const match of all) {
      const currentPhoneNumber = match[0];
      const maskPhoneNumber =
        currentPhoneNumber.substring(0, currentPhoneNumber.length - 4) + "xxxx";
      result = result.replace(currentPhoneNumber, maskPhoneNumber);
    }

    return result;
  }

  static phoneNumberMasking(number: string): string {
    const mask = "0" + number.substr(0, number.length - 4) + "xxxx";
    return mask.substr(0, 3) + " " + mask.substr(3, mask.length - 3);
  }

  static fullPhoneNumber(number: string): string {
    if (number[0] !== "+") return "+855" + number;
    return number;
  }

  static picture(url: string, width: number, height: number): string {
    const token = url.split("kh1.co");
    return (
      "https:" +
      token[0] +
      "kh1.co/__image/" +
      `w=${width},h=${height},fit=contain` +
      token[1]
    );
  }

  // static markdown(md: string, styles = '', headless: boolean) {
  //   if (!md || md.trim() === '') return '';

  //   const body = new showdown.Converter({ tables: true }).makeHtml(md);
  //   if (headless) {
  //     return body;
  //   }
  //   return `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${styles}</style></head><body>${body}</body></html>`;
  // }

  static isBirthday(dob: string): boolean {
    let is_birthday = false;
    if (dob != null) {
      try {
        const from = moment(dob).add(-2, "days");
        const to = moment(dob).add(2, "days");
        is_birthday = moment
          .tz("Asia/Phnom_Penh")
          .isBetween(from, to, null, "[]");
      } catch (ex) {
        console.error(ex);
      }
    }
    return is_birthday;
  }

  static shuffle<T>(items: T[]): T[] {
    const array = [...items];

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  static money(value: string | number): string {
    return Number(value).toFixed(2);
  }
  static parseSafeJson(str: string | null | undefined) {
    if (!str) return {};
    try {
      const json = JSON.parse(str);
      return json;
    } catch (e) {
      return {};
    }
  }

  static generateOrderUuid(orderId: number, SupplierId: number): string {
    const c = orderId * 999983 + SupplierId;
    return "DX" + c;
  }

  static extractOrderIdAndSupplierIdFromUuid(uuid: string): {
    supplierId: number;
    orderId: number;
  } {
    if (uuid.substring(0, 2).toUpperCase() !== "DX") return null;
    const c = Number(uuid.replace("DX", ""));
    if (!c) return null;
    const supplierId = c % 999983;
    const orderId = Math.trunc(c / 999983);
    return { supplierId, orderId };
  }

  static getDateRage(firstDate, lastDate) {
    if (
      moment(firstDate, "YYYY-MM-DD").isSame(
        moment(lastDate, "YYYY-MM-DD"),
        "day"
      )
    )
      return [lastDate];
    let date = firstDate;
    const dates = [date];
    do {
      date = moment(date).add(1, "day");
      dates.push(date.format("YYYY-MM-DD"));
    } while (moment(date).isBefore(lastDate));
    return dates.filter((_: any, i: number) => dates.length - 1 > i).map((x) => moment(x).format("YYYY-MM-DD"));
  }
}

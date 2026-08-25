export default function (strings: any, ...values: any) {
  return String.raw({ raw: strings }, ...values);
}

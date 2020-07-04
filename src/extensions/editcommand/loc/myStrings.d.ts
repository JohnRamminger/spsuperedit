declare interface IEditcommandCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'EditcommandCommandSetStrings' {
  const strings: IEditcommandCommandSetStrings;
  export = strings;
}

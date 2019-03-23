export interface City {
  code: string;
  name: string;
  type?: string;
  airports?: any;
  rail?: any;
  other?: any;

  //transport here is used for response from server
  transport?: any;

}


export interface RootItinObject {
  PricedItineraries?: PricedItinerary[];
  ReturnDateTime?: string;
  DepartureDateTime?: string;
  DestinationLocation?: string;
  OriginLocation?: string;
  Page?: Page;
  Links?: Link[];
}

interface Link {
  rel: string;
  href: string;
}

interface Page {
  Size: number;
  TotalTags: number;
  Offset: number;
}

export interface PricedItinerary {
  AirItinerary: AirItinerary;
  TPA_Extensions: TPAExtensions2;
  SequenceNumber: number;
  AirItineraryPricingInfo: AirItineraryPricingInfo;
  TicketingInfo: TicketingInfo;
}

interface TicketingInfo {
  ValidInterline: string;
  TicketType: string;
}

interface AirItineraryPricingInfo {
  PTC_FareBreakdowns: PTCFareBreakdowns;
  FareInfos: FareInfos;
  TPA_Extensions: TPAExtensions4;
  ItinTotalFare: ItinTotalFare;
}

interface ItinTotalFare {
  FareConstruction: FareConstruction;
  TotalFare: FareConstruction;
  Taxes: Taxes2;
  BaseFare: FareConstruction;
  EquivFare: FareConstruction;
}

interface Taxes2 {
  Tax: Tax[];
}

interface TPAExtensions4 {
  DivideInParty: DivideInParty;
}

interface DivideInParty {
  Indicator: boolean;
}

interface FareInfos {
  FareInfo: FareInfo[];
}

interface FareInfo {
  TPA_Extensions: TPAExtensions3;
  FareReference: string;
}

interface TPAExtensions3 {
  Cabin: Cabin;
  SeatsRemaining: SeatsRemaining;
}

interface SeatsRemaining {
  BelowMin: boolean;
  Number: number;
}

interface Cabin {
  Cabin: string;
}

interface PTCFareBreakdowns {
  PTC_FareBreakdown: PTCFareBreakdown;
}

interface PTCFareBreakdown {
  FareBasisCodes: FareBasisCodes;
  PassengerTypeQuantity: PassengerTypeQuantity;
  PassengerFare: PassengerFare;
  Endorsements: Endorsements;
}

interface Endorsements {
  NonRefundableIndicator: boolean;
}

interface PassengerFare {
  FareConstruction: FareConstruction;
  TotalFare: TotalFare;
  Taxes: Taxes;
  BaseFare: TotalFare;
  EquivFare: FareConstruction;
}

interface Taxes {
  TotalTax: FareConstruction;
  Tax: Tax[];
}

interface Tax {
  CurrencyCode: string;
  DecimalPlaces: number;
  TaxCode: string;
  Amount: number;
}

interface TotalFare {
  CurrencyCode: string;
  Amount: number;
}

interface FareConstruction {
  CurrencyCode: string;
  DecimalPlaces: number;
  Amount: number;
}

interface PassengerTypeQuantity {
  Quantity: number;
  Code: string;
}

interface FareBasisCodes {
  FareBasisCode: FareBasisCode[];
}

interface FareBasisCode {
  BookingCode: string;
  DepartureAirportCode: string;
  AvailabilityBreak: boolean;
  ArrivalAirportCode: string;
  content: string;
}

interface TPAExtensions2 {
  ValidatingCarrier: MarketingAirline;
}

interface AirItinerary {
  OriginDestinationOptions: OriginDestinationOptions;
  DirectionInd: string;
}

interface OriginDestinationOptions {
  OriginDestinationOption: OriginDestinationOption[];
}

interface OriginDestinationOption {
  FlightSegment: FlightSegment[];
  ElapsedTime: number;
}

interface FlightSegment {
  DepartureAirport: DepartureAirport;
  ArrivalAirport: DepartureAirport;
  MarketingAirline: MarketingAirline;
  ArrivalTimeZone: ArrivalTimeZone;
  TPA_Extensions: TPAExtensions;
  StopQuantity: number;
  ElapsedTime: number;
  ResBookDesigCode: string;
  MarriageGrp: string;
  Equipment: Equipment;
  DepartureDateTime: string;
  ArrivalDateTime: string;
  FlightNumber: number;
  OnTimePerformance: OnTimePerformance;
  OperatingAirline: OperatingAirline;
  DepartureTimeZone: ArrivalTimeZone;
}


interface OperatingAirline {
  FlightNumber: number;
  Code: string;
}

interface OnTimePerformance {
  Level: number | string;
}

interface Equipment {
  AirEquipType: string;
}

interface TPAExtensions {
  eTicket: ETicket;
}

interface ETicket {
  Ind: boolean;
}

interface ArrivalTimeZone {
  GMTOffset: number;
}

export interface MarketingAirline {
  Code: string;
}

interface DepartureAirport {
  LocationCode: string;
}

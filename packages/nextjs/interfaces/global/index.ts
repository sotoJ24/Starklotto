export enum Page {
  Home = "home",
  Play = "play",
  HowItWorks = "how-it-works",
  Profile = "profile",
}

export interface TicketInfo {
  player: string;
  number1: number;
  number2: number;
  number3: number;
  number4: number;
  number5: number;
  claimed: boolean;
  drawId: number;
}

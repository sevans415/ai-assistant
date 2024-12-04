import { LocationType } from "@/app/api/chat/route";

export const volunteerOptions = [
  "Education and Literacy",
  "Homelessness",
  "Food Insecurity",
  "Military Support",
  "Environmental Causes",
  "Animal Wellness",
  "Childhood Hunger",
  "LGBTQ+",
  "Childhood Obesity",
  "Childhood Cancer",
  "Culture and Heritage",
  "Humanitarian Aid",
  "Women's Issues",
  "People with Disabilities",
  "Health and Wellness",
  "Community Building",
  "Mental Health Awareness"
];

export const wellnessOptions = [
  "Hikes",
  "Walk",
  "History Museum",
  "Science Museum",
  "Art Museum"
];

export const volunteerBotMessage = `Hello Spencer! Thank you for your interest in volunteering with your team, this is a great way to build trust and connection and make an impact together! 

I've pre-selected the categories I think you might like, but of course change them as you see fit. You can also tell me more about what you'd like in the text box below.`;

const volunteerOptionsTitle =
  "Please select the volunteer opportunities you're interested in:";

const volunteerSelectedOptions = [
  "Education and Literacy",
  "Childhood Hunger",
  "Childhood Obesity"
];

const volunteerLocationOptions = [
  "Giveback From Anywhere",
  "In person offsite",
  "Pause for Purpose"
];

export const givebackLocationType: {
  [key in (typeof volunteerLocationOptions)[number]]: LocationType;
} = {
  "Giveback From Anywhere": "Online",
  "In person offsite": "In-person",
  "Pause for Purpose": "Online"
};

const volunteerSelectedLocationOptions = [
  "Giveback From Anywhere",
  "In person offsite",
  "Pause for Purpose"
];

const volunteerOptionsPackage = {
  optionsTitle: volunteerOptionsTitle,
  locationOptions: volunteerLocationOptions,
  options: volunteerOptions,
  selectedLocations: volunteerSelectedLocationOptions,
  selected: volunteerSelectedOptions,
  displayConfig: {
    groupSize: true,
    options: true,
    location: true
  }
};

const wellnessSelectedOptions = [
  "History Museum",
  "Science Museum",
  "Art Museum"
];

const wellnessLocationOptions = [
  "Remote friendly",
  "In person in office",
  "In person offsite"
];

const wellnessSelectedLocationOptions = [
  "Remote friendly",
  "In person in office",
  "In person offsite"
];

const wellnessOptionsPackage = {
  optionsTitle: "Please select the wellness activities you're interested in:",
  options: wellnessOptions,
  locationOptions: wellnessLocationOptions,
  selectedLocations: wellnessSelectedLocationOptions,
  selected: wellnessSelectedOptions,
  displayConfig: {
    groupSize: true,
    options: true,
    location: false
  }
};

export const coachBotMessage = `Great, Spencer! I'd love to help you prep for a 1:1. Let me know the details of your 1:1 below, if there is anything in particular you'd like help with let me know in the text box below.`;

const coachOptions = ["Jessie", "Tiffany", "Kyle", "Sarah", "Tara", "Kelsey"];

const coachOptionsPackage = {
  optionsTitle: "Who are you meeting with?",
  options: coachOptions,
  selected: [coachOptions[1]],
  locationOptions: ["Zoom", "In person"],
  selectedLocations: ["Zoom"],
  displayConfig: {
    groupSize: false,
    options: true,
    location: true
  }
};

export type OptionPackage = {
  optionsTitle: string;
  options: string[];
  selected: string[];
  locationOptions: string[];
  selectedLocations: string[];
  displayConfig: {
    groupSize: boolean;
    options: boolean;
    location: boolean;
  };
};

export type OptionPackageType = "giveback" | "wellness" | "coach";

export const optionsPackageMap: Record<OptionPackageType, OptionPackage> = {
  giveback: volunteerOptionsPackage,
  wellness: wellnessOptionsPackage,
  coach: coachOptionsPackage
};

export const wellnessBotMessage = `Great, Spencer! Let's find some wellness activities.

The team has been doing a lot of hikes lately, should we switch it up and try a musuem this time? Jessie mentioned in her last engagement survey that that would be fun.

I've pre-selected the categories I think you might like, but of course change them as you see fit.`;

export const homepageWelcome = `Welcome to your Happyly team building assistant, we are here to help you plan a giveback or wellness activity with your team to bring people together. \n\nHappyly recommendations are curated by human teams and delivered here through our AI assistant. They are designed to support mental health, physical health, team connection, and to positively impact the world - all of which is also good for business. If at any point you would like to talk with a human, please know that we are here for you and eager to make the process as easy as possible. 
`;

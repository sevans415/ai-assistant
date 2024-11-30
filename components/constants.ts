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
  "Food Insecurity",
  "Health and Wellness",
  "Community Building"
];

const volunteerLocationOptions = [
  "Giveback From Anywhere",
  "In person offsite",
  "Pause for Purpose"
];

const volunteerSelectedLocationOptions = [
  "Giveback From Anywhere",
  "In person offsite",
  "Pause for Purpose"
];

const volunteerOptionsPackage = {
  title: volunteerOptionsTitle,
  locationOptions: volunteerLocationOptions,
  options: volunteerOptions,
  selectedLocations: volunteerSelectedLocationOptions,
  selected: volunteerSelectedOptions
};

const wellnessOptionsTitle =
  "Please select the wellness activities you're interested in:";

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
  title: wellnessOptionsTitle,
  options: wellnessOptions,
  locationOptions: wellnessLocationOptions,
  selectedLocations: wellnessSelectedLocationOptions,
  selected: wellnessSelectedOptions
};

export const optionsPackageMap = {
  volunteer: volunteerOptionsPackage,
  wellness: wellnessOptionsPackage,
  coach: wellnessOptionsPackage
};

export const wellnessBotMessage = `Great, Spencer! Let's find some wellness activities.

The team has been doing a lot of hikes lately, should we switch it up and try a musuem this time? Jessie mentioned in her last engagement survey that that would be fun.

I've pre-selected the categories I think you might like, but of course change them as you see fit.`;

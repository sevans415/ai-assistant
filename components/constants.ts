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
  "Museums",
  "History Museum",
  "Science Museum",
  "Art Museum"
];

export const volunteerBotMessage = `Nice, Spencer! Bringing your team together to volunteer is a great idea. 

To recap the feedback from your team recently, everyone really enjoyed the trip to the soup kitchen 3 weeks ago but the online activity around autism awareness was less engaging. Katie, Dominic, and Adrian also mentioned they wanted to go to the soup kitchen but couldn't because it conflicted with daycare pickup. 

Also, Deloitte is celebrating X awareness month in December, so it might be nice to pick something with that theme. 

I've pre-selected the categories I think you might like, but of course change them as you see fit.`;

const volunteerOptionsTitle =
  "Please select the volunteer opportunities you're interested in:";

const volunteerSelectedOptions = [
  "Food Insecurity",
  "Health and Wellness",
  "Community Building"
];

const volunteerOptionsPackage = {
  title: volunteerOptionsTitle,
  options: volunteerOptions,
  selected: volunteerSelectedOptions
};

const wellnessOptionsTitle =
  "Please select the wellness activities you're interested in:";

const wellnessSelectedOptions = [
  "History Museum",
  "Science Museum",
  "Art Museum"
];

const wellnessOptionsPackage = {
  title: wellnessOptionsTitle,
  options: wellnessOptions,
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

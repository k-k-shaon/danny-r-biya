/**
 * Wedding Reception Invitation Configuration
 * Srabon & Reyana
 * 
 * All content is centrally managed in this file.
 * Changes take effect immediately without building.
 */

window.INVITE = {
  // Couple Information
  // Display names everywhere are everyday names: "Srabon" and "Reyana"
  // Full names appear ONLY in the formal opening line and the Our Families section.
  groomNick: "Srabon",
  groomFull: "Taif Tanjil Srabon",
  groomParents: "Mr. [Father's Name] & Mrs. [Mother's Name]",
  groomRelationText: "Son of",

  brideNick: "Reyana",
  brideFull: "Sabrina Akter Reyana",
  brideParents: "Mr. [Father's Name] & Mrs. [Mother's Name]",
  brideRelationText: "Daughter of",

  // Main Texts
  openingLine: "Together with their families",
  formalOpeningLine: "Together with their families, Taif Tanjil Srabon & Sabrina Akter Reyana cordially invite you to celebrate their",
  eventTitle: "Wedding Reception",
  welcomeQuote: "Two hearts united, an enduring journey begins by the sunlit shore.",

  // Dates & Times (Asia/Dhaka GMT+6)
  // Reception Date: 2 January 2027 (Saturday, computed dynamically by JS)
  receptionDateIso: "2027-01-02T19:00:00+06:00",
  receptionDateDisplay: "2 January 2027",
  receptionTimeDisplay: "7:00 PM onwards",
  receptionEndTimeDisplay: "11:00 PM",

  // Venue Details
  venue: {
    name: "Wari Party Center",
    address: "Wari, Dhaka",
    mapUrl: "https://maps.google.com/maps?mstk=AUtExfBbha4CQ12yaC_e4vi2RRL-TRcuhbaEXF29M57-GAq68MR3EFhih5EbVf-AJtgVJNuuTYd43gh5N4A6Qg5BccigdwRmsQr8xOGp46rcTfXbFFu0J2BQV2j0xDE_oNIjupUMvjDMCw1Ns0LCtNIlrM0Kuc61SrvnQVTFpckiPSFvyls&hl=en&pvq=Cg0vZy8xMWR4YmhkMTl3gAEBkAEB&fvr=1&vet=10CAAQoqAOahcKEwiozqT6xpGYAxUAAAAAHQAAAAAQCA..i&cs=1&um=1&ie=UTF-8&fb=1&gl=bd&sa=X&ftid=0x3755b8541ce8e6cd:0x11e070bd4aef9712",
    phone: "+880 1700-000000",
    phoneDisplay: "+880 1700 000000",
    parkingNote: "Dedicated parking and valet assistance available near the venue entrance."
  },

  // Love Story
  story: {
    title: "Our Story",
    tagline: "From quiet conversations to a lifetime of love",
    paragraphs: [
      "What began as a quiet conversation blossomed under warm golden light into years of shared dreams, laughter, and steadfast companionship.",
      "Through every shared sunset and every milestone celebrated side by side, Srabon & Reyana found a haven in one another. Surrounded by our beloved families, we invite you to share in our joy as our next chapter begins."
    ]
  },

  // Evening Timeline (Rendered dynamically from this array)
  // You can freely add, remove, or modify events.
  timeline: [
    {
      time: "07:00 PM",
      title: "Guest Arrival",
      desc: "Welcome refreshments, acoustic melodies, and warm mingling under the evening lights.",
      icon: "icon-champagne"
    },
    {
      time: "07:45 PM",
      title: "Grand Welcome",
      desc: "Entrance of Srabon & Reyana, followed by family toasts and heartfelt blessings.",
      icon: "icon-bouquet"
    },
    {
      time: "08:30 PM",
      title: "Dinner & Delights",
      desc: "A banquet of savory delicacies, continental dishes, and traditional favorites.",
      icon: "icon-cutlery"
    },
    {
      time: "09:30 PM",
      title: "Cake Cutting",
      desc: "Sweet moments and celebratory confection shared with loved ones.",
      icon: "icon-cake"
    },
    {
      time: "10:00 PM",
      title: "Portraits & Memories",
      desc: "Cherished photographs with family and dear friends at the scenic photo lounge.",
      icon: "icon-camera"
    },
    {
      time: "10:45 PM",
      title: "Warm Farewell",
      desc: "Gratitude and warm blessings as an unforgettable night draws to a gentle close.",
      icon: "icon-heart"
    }
  ],

  // Background Music
  // If the file does not exist, the music button hides silently with zero console errors.
  musicFile: "music/music.mp3"
};

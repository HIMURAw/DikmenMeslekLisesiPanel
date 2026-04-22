import mongoose, { Schema, model, models } from "mongoose";

const SchoolDataSchema = new Schema({
  schoolName: { type: String, required: true },
  footerText: { type: String, required: true },
  logo: { type: String, default: "" },
  lessonsVisible: { type: Boolean, default: true },
  vicePrincipalsVisible: { type: Boolean, default: false },
  ataturkCornerVisible: { type: Boolean, default: true },
  ataturkImages: { type: [String], default: [] },
  ataturkInterval: { type: Number, default: 300 },
  ataturkQuotes: { type: [String], default: [] },
  vicePrincipalsAwayMessage: { type: String, default: "Müdür yardımcılarımız şu an odalarında bulunmamaktadır." },
  vicePrincipalsAwayIntervals: {
    type: [
      {
        from: String,
        to: String,
      }
    ],
    default: [{ from: "13:00", to: "13:40" }]
  },
  vicePrincipalsAwayFrom: { type: String, default: "13:00" },
  vicePrincipalsAwayTo: { type: String, default: "13:40" },
  stats: [
    {
      id: String,
      label: String,
      value: String,
      sub: String,
      iconName: String,
      gradient: String,
      shadowColor: String,
      visible: Boolean,
    },
  ],
  lessons: { type: Schema.Types.Mixed, default: [] },
  announcements: [
    {
      id: String,
      title: String,
      desc: String,
      date: String,
      type: String,
      icon: String,
      visible: Boolean,
    },
  ],
  dutyOfficers: [
    {
      id: String,
      name: String,
      area: String,
      shift: String,
      active: Boolean,
      visible: Boolean,
      date: String,
    },
  ],
  calendarEvents: [
    {
      id: String,
      day: Number,
      month: Number,
      year: Number,
      label: String,
      color: String,
      visible: Boolean,
    },
  ],
  departments: [
    {
      id: String,
      name: String,
      description: String,
      iconName: String,
      visible: Boolean,
    },
  ],
  teachers: [
    {
      id: String,
      name: String,
      role: String,
      visible: Boolean,
    },
  ],
  classes: { type: [String], default: [] },
  vicePrincipals: [
    {
      id: String,
      name: String,
      visible: Boolean,
      availability: {
        monday: Boolean,
        tuesday: Boolean,
        wednesday: Boolean,
        thursday: Boolean,
        friday: Boolean,
        saturday: Boolean,
        sunday: Boolean,
      },
    },
  ],
}, { timestamps: true });

// We only ever need ONE document for the school settings/data
// and we'll keep it updated.
const SchoolData = models.SchoolData || model("SchoolData", SchoolDataSchema);

export default SchoolData;

import { HydratedDocument, Model, Schema, model, models } from "mongoose";

export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

type EventDocument = HydratedDocument<IEvent>;
type EventModel = Model<IEvent>;

type RequiredTextField =
  | "title"
  | "description"
  | "overview"
  | "image"
  | "venue"
  | "location"
  | "date"
  | "time"
  | "mode"
  | "audience"
  | "organizer";

const REQUIRED_TEXT_FIELDS: RequiredTextField[] = [
  "title",
  "description",
  "overview",
  "image",
  "venue",
  "location",
  "date",
  "time",
  "mode",
  "audience",
  "organizer",
];

const TWELVE_HOUR_TIME_REGEX = /^(0?[1-9]|1[0-2]):([0-5]\d)\s*([AP]M)$/i;
const TWENTY_FOUR_HOUR_TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const createSlug = (value: string): string =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const normalizeDate = (value: string): string => {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date. Provide a valid date value.");
  }

  // Store date values in ISO YYYY-MM-DD format for consistent filtering.
  return parsedDate.toISOString().split("T")[0];
};

const normalizeTime = (value: string): string => {
  const trimmedValue = value.trim();

  const twentyFourHourMatch = trimmedValue.match(TWENTY_FOUR_HOUR_TIME_REGEX);
  if (twentyFourHourMatch) {
    const [, hours, minutes] = twentyFourHourMatch;
    return `${hours}:${minutes}`;
  }

  const twelveHourMatch = trimmedValue.match(TWELVE_HOUR_TIME_REGEX);
  if (!twelveHourMatch) {
    throw new Error("Invalid time. Use HH:mm or h:mm AM/PM.");
  }

  const [, rawHours, minutes, meridiem] = twelveHourMatch;
  const parsedHours = Number.parseInt(rawHours, 10);
  const normalizedHours =
    meridiem.toUpperCase() === "PM"
      ? parsedHours % 12 + 12
      : parsedHours % 12;

  // Keep all stored times in 24-hour HH:mm format.
  return `${normalizedHours.toString().padStart(2, "0")}:${minutes}`;
};

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
  },
  { timestamps: true }
);

eventSchema.index({ slug: 1 }, { unique: true });

eventSchema.pre("save", async function (this: EventDocument) {
  for (const field of REQUIRED_TEXT_FIELDS) {
    const value = this.get(field);
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`${field} is required and cannot be empty.`);
    }
    this.set(field, value.trim());
  }

  for (const listField of ["agenda", "tags"] as const) {
    const values = this.get(listField);
    const isValidList =
      Array.isArray(values) &&
      values.length > 0 &&
      values.every(
        (entry): entry is string =>
          typeof entry === "string" && entry.trim().length > 0
      );

    if (!isValidList) {
      throw new Error(
        `${listField} is required and must contain non-empty strings.`
      );
    }

    this.set(
      listField,
      values.map((entry) => entry.trim())
    );
  }

  // Regenerate slug only when title changes to keep URLs stable.
  if (this.isModified("title")) {
    this.slug = createSlug(this.title);
  }

  // Normalize user input into a single canonical date/time format.
  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);
});

const Event: EventModel =
  (models.Event as EventModel) || model<IEvent, EventModel>("Event", eventSchema);

export { Event };


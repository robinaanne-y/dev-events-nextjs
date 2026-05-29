import { HydratedDocument, Model, Schema, Types, model, models } from "mongoose";
import { Event } from "./event.model";

export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookingDocument = HydratedDocument<IBooking>;
type BookingModel = Model<IBooking>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: EMAIL_REGEX,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ eventId: 1 });

bookingSchema.pre("save", async function (this: BookingDocument) {
  this.email = this.email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(this.email)) {
    throw new Error("Invalid email format.");
  }

  // Ensure every booking points to an existing event document.
  if (this.isNew || this.isModified("eventId")) {
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error("Referenced event does not exist.");
    }
  }
});

const Booking: BookingModel =
  (models.Booking as BookingModel) ||
  model<IBooking, BookingModel>("Booking", bookingSchema);

export { Booking };


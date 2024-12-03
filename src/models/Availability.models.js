import { model, Schema } from "mongoose";

const Availability = Schema(
    {
        professorId:
        {

            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        day:
        {
            type: String,
            required: true,
        },
            timeslots:
            [ {
                time: {
                    type: String,
                    
                },
                isBooked: {
                    type: Boolean,
                    default: false, 
                },
            },
            ]
    },
    {
        timestamps: true,
    }
);

export const AvailabilitySchema = model("Availability", Availability);

import mongoose, { Schema } from "mongoose";

const Appointment = Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    professorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timeslot: {
        type: String,
        required: true,
    }
    ,
    date: {
        type: String,
        required: true,
    },
    cancelled: {
        type: Boolean,
        default: false,
    },
    completed: {
    
    type: Boolean,
    default: false,}
}, { timestamps: true });

export const AppointmentSchema = mongoose.model("Appointment", Appointment);
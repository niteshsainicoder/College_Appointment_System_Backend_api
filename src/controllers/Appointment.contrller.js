import { AppointmentSchema } from '../models/Appointment.models.js';
import { AvailabilitySchema } from '../models/Availability.models.js'

// any professor can add their availability 
export const AddAvailability = async (req, res) => {
    try {
        const { date, timeslot } = req.body; // Changed to lowercase for consistency
        const ProfessorId = req.user.id;
        // Validate inputs
        if (!ProfessorId || !date || !timeslot) {
            return res.status(400).json({ message: "Professor ID, day, and timeslot are required." });
        }

        // Check if the availability already exists for that timeslot
        const existingAvailability = await AvailabilitySchema.findOne({
            professorId: ProfessorId,
            day: date,
            timeslots: { $elemMatch: { time: timeslot } },
        });

        if (existingAvailability) {
            return res.status(400).json({ message: "Availability already exists for the specified timeslot." });
        }

        // Check if the availability already exists for that day to update timeslots
        const dayAvailability = await AvailabilitySchema.findOne({ professorId: ProfessorId, day: date });
        if (dayAvailability) {
            dayAvailability.timeslots.push({ time: timeslot, isBooked: false });
            await dayAvailability.save();
            return res.status(200).json({ message: "Availability updated successfully.", data: dayAvailability });
        }

        // If the availability does not exist, create a new one
        const newAvailability = await AvailabilitySchema.create({
            professorId: ProfessorId,
            day: date,
            timeslots: [{ time: timeslot, isBooked: false }],
        });

        return res.status(201).json({ message: "Availability added successfully", data: newAvailability });
    } catch (error) {
        console.error("Error adding availability:", error); // Log the error with a stack trace
        return res.status(500).json({ message: "An error occurred while adding availability.", error: error.message });
    }
};


export const GetAppointmentsDetails = async (req, res) => {
    try {
        if (req.user.role === "professor") {
            const AlltimeSlots = await AvailabilitySchema.find({ professorId: req.user.id }).select('day timeslots');
            const BookedtimeSlots = await AppointmentSchema.find({ professorId: req.user.id }).select('studentId timeslot date');
            const Appointment = {
                AllSlot: AlltimeSlots.length > 0 ? AlltimeSlots : 'No Slots Available',
                BookedSlot: BookedtimeSlots.length > 0 ? BookedtimeSlots : 'No Appointments Booked'
            };
            return res.status(200).json({ message: "Appointments found", data: Appointment });

        } else if (req.user.role === "student") {
            const { professorId } = req.body;

            // If professorId is provided, fetch available time slots for that professor
            if (professorId) {
                const AvailableTimeSlots = await AvailabilitySchema.find({ professorId }).select('day timeslots');
                return res.status(200).json({
                    message: "Appointments fetched successfully",
                    availableTimeSlots: AvailableTimeSlots
                });
            }

            // If professorId is not provided, fetch all unbooked time slots
            const AvailableTimeSlots = await AvailabilitySchema.find({
                timeslots: { $elemMatch: { isBooked: false } }
            }).select('professorId day timeslots ');

            // Optionally filter only unbooked slots if needed
            const UnbookedSlots = AvailableTimeSlots.map(slot => ({
                professorId: slot.professorId,
                day: slot.day,
                timeslots: slot.timeslots.filter(t => !t.isBooked)
            }));

            // Fetch student's own booked slots
            const BookedTimeSlots = await AppointmentSchema.find({ studentId: req.user.id }).select('professorId name timeslot date');

            return res.status(200).json({
                message: "Appointments fetched successfully",
                bookedTimeSlots: BookedTimeSlots.length > 0 ? BookedTimeSlots : 'No Appointments Booked',
                availableTimeSlots: UnbookedSlots.length > 0 ? UnbookedSlots : 'No Available Time Slots'
            });
        }

    } catch (error) {
        return res.status(500).json({ message: "Error Occurred", error: error.message });
    }
};



//student can book an appointment
export const BookAppointment = async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const { professorId, timeslot, date } = req.body;
        const studentId = req.user.id;
        if (!professorId || !studentId || !timeslot || !date) {

            return res.status(400).json({ message: "All fields are required" });
        }
        const checkSlotAvailable = await AvailabilitySchema.findOne({
            professorId,
            timeslots: { $elemMatch: { time: timeslot, isBooked: false } },
        });
        if (!checkSlotAvailable) {
            console.log("Slot not available", checkSlotAvailable);

            return res.status(400).json({ message: "Slot not available" });
        }

        const newAppointment = await AppointmentSchema.create({ professorId, studentId, timeslot, date });
        const updateSlot = await AvailabilitySchema.findOne(
            { professorId, day: date },
        );
        updateSlot.timeslots.find((slot) => slot.time === timeslot).isBooked = true;
        await updateSlot.save();
        return res.status(200).json(
            { message: "Appointment Booked successfully", Data: newAppointment, updatedAvailability: updateSlot }
        )


    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: " Error Occured", error: error.message });
    }

}



//professor cancel his appointment
export const CancelAppointment = async (req, res) => {
    try {
        if (req.user.role !== "professor") {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const { timeslot, date } = req.body;
        const checkSlotAvailable = await AvailabilitySchema.findOne({
            professorId: req.user.id,
            timeslots: { $elemMatch: { time: timeslot, isBooked: true } },
        });
        if (!checkSlotAvailable) {
            return res.status(400).json({ message: "Slot not available" });
        }
        await AppointmentSchema.deleteOne({ professorId: req.user.id, timeslot, date });

        const updateSlot = await AvailabilitySchema.findOne(
            { professorId: req.user.id, day: date },
        );
        updateSlot.timeslots.find((slot) => slot.time === timeslot).isBooked = false;
        await updateSlot.save();
        return res.status(200).json(
            { message: "Appointment cancelled successfully", Data: updateSlot }
        )
    } catch (error) {
        return res.status(500).json({ message: " Error Occured", error: error.message });
    }
}
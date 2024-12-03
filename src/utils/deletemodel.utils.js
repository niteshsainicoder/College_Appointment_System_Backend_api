import {AvailabilitySchema} from '../models/Availability.models.js'; 
import { AppointmentSchema } from '../models/Appointment.models.js';


//Only for Testing purposes
//Cleaning the last created data from database for preventing duplicate data error
const cleanupDatabase = async (done) => {
  await AvailabilitySchema.deleteMany({});
  await AppointmentSchema.deleteMany({}); 
  done();
};

export default cleanupDatabase;

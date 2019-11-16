import { differenceInCalendarMonths, parseISO } from 'date-fns';
import EnrollmentEmail from '../jobs/EnrollmentEmail';
import Queue from '../../lib/Queue';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';

class EnrollmentController {
  async store(req, res) {
    const { student_id, plan_id, end_date, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const months = differenceInCalendarMonths(
      parseISO(end_date),
      parseISO(start_date)
    );

    const price = plan.price * months;
    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      end_date,
      start_date,
      price,
    });

    await Queue.add(EnrollmentEmail.key, {
      enrollment,
      student,
      plan,
    });

    return res.json(enrollment);
  }

  async index(req, res) {
    const enrollments = await Enrollment.findAll();
    return res.json(enrollments);
  }

  async update(req, res) {
    const { student_id, plan_id, end_date, start_date } = req.body;
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const months = differenceInCalendarMonths(
      parseISO(end_date),
      parseISO(start_date)
    );

    const price = plan.price * months;
    const enrollmentUpdated = await enrollment.update({
      student_id,
      plan_id,
      end_date,
      start_date,
      price,
    });

    return res.json(enrollmentUpdated);
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    enrollment.destroy();

    return res.status(204).send();
  }
}

export default new EnrollmentController();

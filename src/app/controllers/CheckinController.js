import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json(student);
    }

    const count = await Checkin.count({
      where: {
        student_id: id,
        created_at: {
          [Op.between]: [startOfDay(new Date() - 7), endOfDay(new Date())],
        },
      },
    });

    if (count >= 7) {
      return res.status(400).json({ msg: 'Não pode fazer checkin mais de 5' });
    }

    const checkinCreated = await Checkin.create({
      student_id: id,
    });

    return res.json(checkinCreated);
  }

  async index(req, res) {
    const { id } = req.params;

    const checkins = await Checkin.findAll({ where: { student_id: id } });

    return res.json(checkins);
  }
}

export default new CheckinController();

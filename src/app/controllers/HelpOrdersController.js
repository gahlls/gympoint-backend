import HelpOrder from '../models/HelpOrders';
import Student from '../models/Student';

class HelpOrdersController {
  async store(req, res) {
    const { question } = req.body;
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }

    const helpOrder = await HelpOrder.create({
      student_id: id,
      question,
    });

    return res.json(helpOrder);
  }

  async index(req, res) {
    const { id } = req.params;

    const helpOrders = await HelpOrder.findAll({ where: { student_id: id } });

    return res.json(helpOrders);
  }
}

export default new HelpOrdersController();

import Student from '../models/Student';

class StudenController {
  async store(req, res) {
    const userExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const { id } = req.params;
    const { email } = req.body;

    const user = await Student.findByPk(id);

    if (user.email !== email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    const student = await user.update(req.body);

    return res.json(student);
  }

  async index(req, res) {
    const students = await Student.findAll();
    return res.json(students);
  }
}

export default new StudenController();

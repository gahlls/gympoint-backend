import HelpOrder from '../models/HelpOrders';

class AnswerController {
  async store(req, res) {
    const { id } = req.params;
    const { answer } = req.body;

    const helpOrder = await HelpOrder.findByPk(id);

    if (!helpOrder) {
      return res.status(404).json({ error: 'Help order not found' });
    }

    await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    return res.json(helpOrder);
  }
}

export default new AnswerController();

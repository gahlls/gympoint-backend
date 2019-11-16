import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const plan = await Plan.create(req.body);
    return res.json(plan);
  }

  async index(req, res) {
    const plans = await Plan.findAll();
    return res.json(plans);
  }

  async delete(req, res) {
    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    await plan.destroy();

    return res.status(204).send();
  }

  async update(req, res) {
    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const planUpdated = await plan.update(req.body);

    return res.json(planUpdated);
  }
}

export default new PlanController();

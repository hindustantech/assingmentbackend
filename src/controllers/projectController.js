import Project from '../models/Project.js';

export async function createProject(req, res) {
  const { title, description, status } = req.body;
  try {
    const project = new Project({ 
      title, 
      description, 
      status, 
      user: req.user.id 
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server error');
  }
}

export async function getProjects(req, res) {
  const { page = 1, limit = 10, search = '' } = req.query;
  try {
    let query = { user: req.user.id };
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Project.countDocuments(query);
    
    res.json({ 
      projects, 
      total, 
      page: parseInt(page), 
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
}

export async function updateProject(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const project = await Project.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, description, status },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json(project);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server error');
  }
}

export async function deleteProject(req, res) {
  const { id } = req.params;
  try {
    const project = await Project.findOneAndDelete({ _id: id, user: req.user.id });
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
}
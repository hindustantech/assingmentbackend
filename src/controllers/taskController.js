import Task from '../models/Task.js';
import Project from '../models/Project.js';

export async function createTask(req, res) {
    const { title, description, status, dueDate, priority } = req.body;
    const { projectId } = req.params;
    try {
        const project = await Project.findOne({ _id: projectId, user: req.user.id });
        if (!project) return res.status(404).json({ msg: 'Project not found' });

        const task = new Task({
            title,
            description,
            status,
            dueDate,
            priority,
            project: projectId
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Server error');
    }
}

export async function getTasks(req, res) {
    const { projectId } = req.params;
    const { status, priority, page = 1, limit = 10 } = req.query;
    try {
        const project = await Project.findOne({ _id: projectId, user: req.user.id });
        if (!project) return res.status(404).json({ msg: 'Project not found' });

        let query = { project: projectId };
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('project', 'title');

        const total = await Task.countDocuments(query);

        res.json({
            tasks,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
}

export async function updateTask(req, res) {
    const { id } = req.params;
    const { title, description, status, dueDate, priority } = req.body;
    try {
        // First verify the task belongs to user's project
        const task = await Task.findById(id).populate('project');
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        if (task.project.user.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, status, dueDate, priority },
            { new: true, runValidators: true }
        );

        res.json(updatedTask);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Server error');
    }
}

export async function deleteTask(req, res) {
    const { id } = req.params;
    try {
        // First verify the task belongs to user's project
        const task = await Task.findById(id).populate('project');
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        if (task.project.user.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        await Task.findByIdAndDelete(id);
        res.json({ msg: 'Task deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
}
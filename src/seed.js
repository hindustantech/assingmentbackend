import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

dotenv.config();

export const seed = (async () => {
    let user, projects;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected for seeding');
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err);
        process.exit(1);
    }

    try {
        // 🧹 Clean up only old seed data
        const existingUser = await User.findOne({ email: 'test@example.com' });
        if (existingUser) {
            console.log('🧹 Found existing seed data. Cleaning...');
            const oldProjects = await Project.find({ user: existingUser._id });
            const projectIds = oldProjects.map(p => p._id);

            try {
                await Task.deleteMany({ project: { $in: projectIds } });
                console.log('🧹 Old tasks removed');
            } catch (err) {
                console.error('❌ Failed to delete old tasks:', err);
            }

            try {
                await Project.deleteMany({ _id: { $in: projectIds } });
                console.log('🧹 Old projects removed');
            } catch (err) {
                console.error('❌ Failed to delete old projects:', err);
            }

            try {
                await User.deleteOne({ _id: existingUser._id });
                console.log('🧹 Old seed user removed');
            } catch (err) {
                console.error('❌ Failed to delete old seed user:', err);
            }
        } else {
            console.log('✨ No old seed data found');
        }
    } catch (err) {
        console.error('❌ Error while cleaning old seed data:', err);
    }

    try {
        // 👤 Create seed user
        user = await User.create({ email: 'test@example.com', password: 'Test@123' });
        console.log('👤 Seed user created:', user.email);
    } catch (err) {
        console.error('❌ Failed to create seed user:', err);
        await mongoose.disconnect();
        process.exit(1);
    }

    try {
        // 📁 Create projects
        const project1 = await Project.create({
            title: 'Project Alpha',
            description: 'First seeded project',
            status: 'active',
            user: user._id,
        });

        const project2 = await Project.create({
            title: 'Project Beta',
            description: 'Second seeded project',
            status: 'active',
            user: user._id,
        });

        projects = [project1, project2];
        console.log('📁 Seed projects created');
    } catch (err) {
        console.error('❌ Failed to create projects:', err);
        await mongoose.disconnect();
        process.exit(1);
    }

    try {
        // ✅ Create tasks
        const taskData = [
            { title: 'Task 1.1', description: 'Todo task', status: 'todo', dueDate: new Date('2025-11-01'), project: projects[0]._id },
            { title: 'Task 1.2', description: 'In progress', status: 'in-progress', dueDate: new Date('2025-11-15'), project: projects[0]._id },
            { title: 'Task 1.3', description: 'Done task', status: 'done', dueDate: new Date('2025-10-01'), project: projects[0]._id },
            { title: 'Task 2.1', description: 'Todo task', status: 'todo', dueDate: new Date('2025-12-01'), project: projects[1]._id },
            { title: 'Task 2.2', description: 'In progress', status: 'in-progress', dueDate: new Date('2025-12-15'), project: projects[1]._id },
            { title: 'Task 2.3', description: 'Done task', status: 'done', dueDate: new Date('2025-11-01'), project: projects[1]._id },
        ];

        await Task.create(taskData);
        console.log('✅ Seed tasks created');
    } catch (err) {
        console.error('❌ Failed to create tasks:', err);
        await mongoose.disconnect();
        process.exit(1);
    }

    try {
        await mongoose.disconnect();
        console.log('🔌 MongoDB disconnected successfully');
    } catch (err) {
        console.error('❌ Failed to disconnect MongoDB:', err);
    }

    process.exit(0);
});

import { UserModel } from '../models/user-model';
import { AppError } from '../utils/app-error';

export class AdminService {
    static async promote(targetUsername: string) {
        const username = targetUsername.trim().toLowerCase();

        const user = await UserModel.findOne({ username });
        if (!user) throw AppError.notFound('User not found');

        if (user.role === 'admin') {
            throw AppError.conflict('User is already an admin');
        }

        user.role = 'admin';
        user.refreshTokenHash = null;
        user.refreshTokenIssuedAt = null;

        await user.save();

        return user.toJSON();
    }

    static async demote(actorUserId: string, targetUsername: string) {
        const username = targetUsername.trim().toLowerCase();

        const user = await UserModel.findOne({ username });
        if (!user) throw AppError.notFound('User not found');

        if (user.role === 'user') {
            throw AppError.conflict('User is already a normal user');
        }

        if (user._id.toString() === actorUserId) {
            throw AppError.forbidden('Admins cannot demote themselves');
        }

        const adminCount = await UserModel.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
            throw AppError.forbidden('Cannot demote the last remaining admin');
        }

        user.role = 'user';
        user.refreshTokenHash = null;
        user.refreshTokenIssuedAt = null;

        await user.save();

        return user.toJSON();
    }
}
